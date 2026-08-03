import api from "./axios";

export const generateInterview = (targetRole) => {
  return api.post("/api/interview/generate", {
    targetRole,
  });
};

export const submitInterview = (
  interviewId,
  answers
) => {
  return api.post("/api/interview/submit", {
    interviewId,
    answers,
  });
};