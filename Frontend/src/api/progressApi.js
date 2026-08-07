import api from "./axios";

// Get logged-in user's progress
export const getProgress = () => {
  return api.get("/api/progress");
};

// Calculate/update logged-in user's progress
export const updateProgress = () => {
  return api.post("/api/progress/update");
};