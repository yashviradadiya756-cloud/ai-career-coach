import api from "./axios";


export const askCoach = (question) => {
  return api.post("/api/coach/ask", {
    question,
  });
};


export const getCoachHistory = () => {
  return api.get("/api/coach/history");
};


export const getCoachDashboard = () => {
  return api.get("/api/coach/dashboard");
};