import api from "./axios";

export const getNotifications = () =>
  api.get("/api/notification");

export const markAsRead = (id) =>
  api.put(`/api/notification/${id}`);