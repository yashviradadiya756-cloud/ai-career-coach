import api from "./axios";

export const getLearningPlan = () =>
  api.get("/api/learning");

export const updateLearning = (data) =>
  api.put("/api/learning", data);