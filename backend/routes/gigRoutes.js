const express = require("express");
const Gig = require("../models/Gig");

const router = express.Router();


// CREATE GIG

router.post("/", async (req, res) => {
  try {
    const {
      freelancer,
      title,
      description,
      price,
      skills,
      category,
    } = req.body;

    if (
      !freelancer ||
      !title ||
      !description ||
      !price ||
      !category
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const gig = await Gig.create({
      freelancer,
      title,
      description,
      price,
      skills,
      category,
    });

    res.status(201).json({
      message: "Gig created successfully",
      gig,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// GET ALL GIGS

router.get("/", async (req, res) => {
  try {
    const gigs = await Gig.find()
      .populate("freelancer", "name email skills bio");

    res.json(gigs);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate("freelancer", "name email skills bio");

    if (!gig) {
      return res.status(404).json({
        message: "Gig not found",
      });
    }

    res.json(gig);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;