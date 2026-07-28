require("dotenv").config();
const mongoose = require("mongoose");
const Payment = require("./models/Payment");

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    const payment = await Payment.create({
      user: new mongoose.Types.ObjectId(), // Dummy ObjectId
      plan: "Pro",
      amount: 299,
      currency: "INR",
      status: "Pending",
      transactionId: "TEST123456",
    });

    console.log("Payment Saved:");
    console.log(payment);

    process.exit();

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

test();