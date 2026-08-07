import api from "./axios";

export const getProgress = () =>
  api.get("/api/progress");

export const updateProgress = () =>
  api.post("/api/progress/update");