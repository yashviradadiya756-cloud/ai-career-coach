const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createOrder,
} = require("../controllers/paymentController");

// Create Razorpay Order
router.post("/create-order", protect, createOrder);

module.exports = router;