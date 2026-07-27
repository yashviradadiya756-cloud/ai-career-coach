const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log("Key ID:", process.env.RAZORPAY_KEY_ID);
console.log("Key Secret:", process.env.RAZORPAY_KEY_SECRET);

module.exports = razorpay;