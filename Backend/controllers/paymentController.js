const razorpay = require("../config/razorpay");
const Payment = require("../models/Payment");
const User = require("../models/User");
const crypto = require("crypto");

const getAdminPayments = async (req, res) => {
  try {
    // Disable caching for admin payment data
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    const payments = await Payment.find()
      .populate("user", "name username email phone")
      .sort({ createdAt: -1 });

    console.log("ADMIN PAYMENTS COUNT:", payments.length);

    return res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("ADMIN PAYMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load payments",
      error: error.message,
    });
  }
};

// ==========================================
// CREATE RAZORPAY ORDER
// ==========================================

const createOrder = async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID) {
      return res.status(500).json({
        success: false,
        message: "Razorpay Key ID is not configured on server.",
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay Secret Key is not configured on server.",
      });
    }

    const options = {
      amount: 29900,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    const payment = await Payment.create({
      user: req.user._id,
      plan: "Pro",
      amount: order.amount,
      currency: order.currency,
      status: "Pending",
      orderId: order.id,
    });

    return res.status(200).json({
      success: true,
      message: "Order Created Successfully",
      order,
      payment,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to create Razorpay order",
    });
  }
};

// ==========================================
// VERIFY PAYMENT
// ==========================================

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification data is incomplete.",
      });
    }

    // ==========================================
    // GENERATE SIGNATURE
    // ==========================================

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    // ==========================================
    // VERIFY SIGNATURE
    // ==========================================

    if (generatedSignature !== razorpay_signature) {
      await Payment.findOneAndUpdate(
        {
          user: req.user._id,
          orderId: razorpay_order_id,
        },
        {
          status: "Failed",
        }
      );

      return res.status(400).json({
        success: false,
        message: "Invalid payment signature.",
      });
    }

    // ==========================================
    // FIND PAYMENT
    // ==========================================

    const payment = await Payment.findOne({
      user: req.user._id,
      orderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found.",
      });
    }

    // ==========================================
    // UPDATE PAYMENT
    // ==========================================

    payment.transactionId = razorpay_payment_id;
    payment.signature = razorpay_signature;
    payment.status = "Success";

    await payment.save();

    // ==========================================
    // ACTIVATE PRO PLAN
    // ==========================================

    const startDate = new Date();

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    await User.findByIdAndUpdate(req.user._id, {
      plan: "Pro",
      subscriptionStatus: "Active",
      subscriptionStartDate: startDate,
      subscriptionEndDate: endDate,
    });

    return res.status(200).json({
      success: true,
      message: "Payment Verified Successfully",
      payment,
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Payment verification failed",
    });
  }
};

// ==========================================
// PAYMENT HISTORY
// ==========================================

const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("PAYMENT HISTORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to load payment history",
    });
  }
};

module.exports = {
  getAdminPayments,
  createOrder,
  verifyPayment,
  getPaymentHistory,
};