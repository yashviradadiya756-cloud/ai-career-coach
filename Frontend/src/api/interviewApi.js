import api from "./axios";

// Generate interview
export const generateInterview = (targetRole) => {
  return api.post("/api/interview/generate", {
    targetRole,
  });
};

// Submit interview answers
export const submitInterview = (interviewId, answers) => {
  return api.post("/api/interview/submit", {
    interviewId,
    answers,
  });
};