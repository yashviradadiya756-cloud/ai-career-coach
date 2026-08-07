import api from "./axios";

export const getNotifications = () =>
  api.get("/api/notifications");

export const markAsRead = (id) =>
  api.put(`/api/notifications/read/${id}`);

export const deleteNotification = (id) =>
  api.delete(`/api/notifications/${id}`);