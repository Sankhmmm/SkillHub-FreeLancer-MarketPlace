const express = require("express");
const Order = require("../models/Order");
const Gig = require("../models/Gig");
const User = require("../models/User");

const router = express.Router();

/* =========================
   CREATE ORDER / HIRE
========================= */

router.post("/", async (req, res) => {
  try {
    const { client, gigId } = req.body;

    if (!client || !gigId) {
      return res.status(400).json({
        message: "Client and gig are required",
      });
    }

    const clientUser = await User.findById(client);

    if (!clientUser) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    if (clientUser.role !== "client") {
      return res.status(403).json({
        message: "Only clients can hire freelancers",
      });
    }

    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({
        message: "Gig not found",
      });
    }

    if (
      gig.freelancer.toString() ===
      client.toString()
    ) {
      return res.status(400).json({
        message: "You cannot hire yourself",
      });
    }

    const existingOrder = await Order.findOne({
      client: client,
      gig: gigId,
      status: {
        $in: ["pending", "accepted"],
      },
    });

    if (existingOrder) {
      return res.status(400).json({
        message:
          "You already hired this freelancer for this gig",
      });
    }

    const order = await Order.create({
      client: client,
      freelancer: gig.freelancer,
      gig: gig._id,
      amount: gig.price,
      status: "pending",
    });

    res.status(201).json({
      message: "Hire request sent successfully!",
      order,
    });

  } catch (error) {
    console.log("ORDER ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


/* =========================
   GET CLIENT ORDERS
========================= */

router.get("/client/:id", async (req, res) => {
  try {
    const orders = await Order.find({
      client: req.params.id,
    })
      .populate("gig")
      .populate(
        "freelancer",
        "name email skills bio"
      )
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    console.log(
      "CLIENT ORDERS ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


/* =========================
   GET FREELANCER ORDERS
========================= */

router.get("/freelancer/:id", async (req, res) => {
  try {
    const orders = await Order.find({
      freelancer: req.params.id,
    })
      .populate("gig")
      .populate(
        "client",
        "name email"
      )
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    console.log(
      "FREELANCER ORDERS ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


/* =========================
   UPDATE ORDER STATUS
========================= */

router.put("/:id/status", async (req, res) => {
  try {
    const {
      status,
      userId,
    } = req.body;

    if (!status || !userId) {
      return res.status(400).json({
        message:
          "Status and user ID are required",
      });
    }

    const allowedStatuses = [
      "accepted",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }


    /* =========================
       FREELANCER ACTIONS
    ========================= */

    if (
      order.freelancer.toString() ===
      userId.toString()
    ) {

      // Freelancer accepts request
      if (status === "accepted") {

        if (order.status !== "pending") {
          return res.status(400).json({
            message:
              "Only pending orders can be accepted",
          });
        }

        order.status = "accepted";
      }


      // Freelancer completes order
      else if (status === "completed") {

        if (order.status !== "accepted") {
          return res.status(400).json({
            message:
              "Only accepted orders can be completed",
          });
        }

        order.status = "completed";
      }


      // Freelancer cancels order
      else if (status === "cancelled") {

        if (
          order.status !== "pending" &&
          order.status !== "accepted"
        ) {
          return res.status(400).json({
            message:
              "This order cannot be cancelled",
          });
        }

        order.status = "cancelled";
      }

    }


    /* =========================
       CLIENT ACTION
    ========================= */

    else if (
      order.client.toString() ===
      userId.toString()
    ) {

      if (status !== "cancelled") {
        return res.status(403).json({
          message:
            "Clients can only cancel orders",
        });
      }

      if (
        order.status !== "pending" &&
        order.status !== "accepted"
      ) {
        return res.status(400).json({
          message:
            "This order cannot be cancelled",
        });
      }

      order.status = "cancelled";

    }


    else {

      return res.status(403).json({
        message:
          "You are not allowed to update this order",
      });

    }


    await order.save();

    const updatedOrder =
      await Order.findById(order._id)
        .populate("gig")
        .populate(
          "client",
          "name email"
        )
        .populate(
          "freelancer",
          "name email"
        );

    res.json({
      message:
        "Order status updated successfully",
      order: updatedOrder,
    });

  } catch (error) {

    console.log(
      "STATUS UPDATE ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });

  }
});


module.exports = router;