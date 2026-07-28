const razorpay = require("../config/razorpay");
const Payment = require("../models/Payment");
const crypto = require("crypto");

// ===============================
// Create Razorpay Order
// ===============================
const createOrder = async (req, res) => {
  try {
    const options = {
      amount: 29900, // ₹299 in paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    // Create Razorpay Order
    const order = await razorpay.orders.create(options);

    // Save Payment in MongoDB
    const payment = await Payment.create({
      user: req.user._id,
      plan: "Pro",
      amount: order.amount,
      currency: order.currency,
      status: "Pending",
      transactionId: order.id,
    });

    return res.status(200).json({
      success: true,
      message: "Order Created Successfully",
      order,
      payment,
    });

  } catch (err) {
    console.error("Create Order Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// Verify Payment
// ===============================
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
    } = req.body;

    const payment = await Payment.findOne({
      transactionId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    payment.transactionId = razorpay_payment_id;
    payment.status = "Success";

    await payment.save();

    return res.status(200).json({
      success: true,
      message: "Payment Verified Successfully",
      payment,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};