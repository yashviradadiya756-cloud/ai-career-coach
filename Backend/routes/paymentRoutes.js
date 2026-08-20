const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware")

const {
  createOrder,
  verifyPayment,
  getPaymentHistory,
} = require("../controllers/paymentController");


// Create Razorpay order
router.post(
  "/create-order",
  protect,
  createOrder
);


// Verify Razorpay payment
router.post(
  "/verify",
  protect,
  verifyPayment
);


// Get logged-in user's payment history
router.get(
  "/history",
  protect,
  getPaymentHistory
);


module.exports = router;