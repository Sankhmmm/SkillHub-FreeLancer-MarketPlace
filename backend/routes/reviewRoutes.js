const express = require("express");
const Review = require("../models/Review");
const Order = require("../models/Order");

const router = express.Router();


/* =========================
   CREATE REVIEW
========================= */

router.post("/", async (req, res) => {
  try {
    const {
      client,
      orderId,
      rating,
      comment,
    } = req.body;


    if (
      !client ||
      !orderId ||
      !rating ||
      !comment
    ) {
      return res.status(400).json({
        message:
          "All review fields are required",
      });
    }


    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message:
          "Rating must be between 1 and 5",
      });
    }


    const order =
      await Order.findById(orderId);


    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }


    if (
      order.client.toString() !==
      client.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only review your own orders",
      });
    }


    if (order.status !== "completed") {
      return res.status(400).json({
        message:
          "You can only review completed orders",
      });
    }


    const existingReview =
      await Review.findOne({
        order: orderId,
      });


    if (existingReview) {
      return res.status(400).json({
        message:
          "You have already reviewed this order",
      });
    }


    const review =
      await Review.create({
        client,
        freelancer: order.freelancer,
        order: orderId,
        rating,
        comment,
      });


    res.status(201).json({
      message:
        "Review submitted successfully!",
      review,
    });

  } catch (error) {

    console.log(
      "REVIEW ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


/* =========================
   GET FREELANCER REVIEWS
========================= */

router.get(
  "/freelancer/:id",
  async (req, res) => {

    try {

      const reviews =
        await Review.find({
          freelancer:
            req.params.id,
        })
          .populate(
            "client",
            "name"
          )
          .sort({
            createdAt: -1,
          });


      res.json(reviews);

    } catch (error) {

      console.log(
        "GET REVIEWS ERROR:",
        error
      );

      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  }
);


module.exports = router;