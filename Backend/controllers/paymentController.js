const razorpay = require("../config/razorpay");
const Payment = require("../models/Payment");

const createOrder = async (req, res) => {
  try {
    const { plan, amount } = req.body;

    if (!plan || !amount) {
      return res.status(400).json({
        success: false,
        message: "Plan and Amount are required",
      });
    }

    const options = {
      amount: amount * 100, // Convert ₹ to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save payment as Pending
    const payment = await Payment.create({
      user: req.user._id,
      plan,
      amount,
      currency: "INR",
      status: "Pending",
      transactionId: order.id,
    });

    res.status(201).json({
      success: true,
      message: "Order Created Successfully",
      order,
      payment,
    });

  } catch (error) {
  console.log("Payment Error:", error);

  res.status(500).json({
    success: false,
    message: error.message,
    error,
  });
}
  
};

module.exports = {
  createOrder,
};