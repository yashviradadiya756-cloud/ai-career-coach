const Razorpay = require("razorpay");

console.log("===== RAZORPAY CONFIG =====");

console.log(
  "KEY ID:",
  process.env.RAZORPAY_KEY_ID ? "LOADED" : "MISSING"
);

console.log(
  "KEY SECRET:",
  process.env.RAZORPAY_KEY_SECRET ? "LOADED" : "MISSING"
);

console.log("===========================");

if (!process.env.RAZORPAY_KEY_ID) {
  throw new Error("RAZORPAY_KEY_ID is missing");
}

if (!process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("RAZORPAY_KEY_SECRET is missing");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpay;