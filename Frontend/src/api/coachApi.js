import api from "./axios";


// Ask AI Coach
export const askCoach = (question) => {
  return api.post("/api/coach/ask", {
    question,
  });
};


// Get previous conversations
export const getCoachHistory = () => {
  return api.get("/api/coach/history");
};