import api from "./axios";

export const getProgress = () =>
  api.get("/api/progress");

export const updateProgress = (data) =>
  api.put("/api/progress", data);