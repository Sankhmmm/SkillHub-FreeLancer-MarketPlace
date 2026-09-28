const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const gigRoutes = require("./routes/gigRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Freelancer Marketplace Backend is Working!"
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working!"
  });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected!");

    app.listen(process.env.PORT || 5000, () => {
      console.log("Backend running on http://localhost:5000");
    });

  } catch (error) {
    console.log("MongoDB connection failed!");
    console.log(error.message);
  }
}

startServer();