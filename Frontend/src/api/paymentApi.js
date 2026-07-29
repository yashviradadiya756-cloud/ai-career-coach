import api from "./axios";

export const createOrder = () =>
  api.post("/api/payment/create-order");

export const verifyPayment = (data) =>
  api.post("/api/payment/verify", data);

export const paymentHistory = () =>
  api.get("/api/payment/history");