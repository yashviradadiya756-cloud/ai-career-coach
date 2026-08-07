import api from "./axios";


// Create Razorpay Order
export const createOrder = () =>
  api.post("/api/payment/create-order");


// Verify Razorpay Payment
export const verifyPayment = (data) =>
  api.post("/api/payment/verify", data);


// Get Payment History
export const getPaymentHistory = () =>
  api.get("/api/payment/history");