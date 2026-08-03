import api from "./axios";

export const generateInterview = (targetRole) => {
  return api.post("/api/interview/generate", {
    targetRole,
  });
};

export const submitInterviewAnswer = (
  interviewId,
  questionIndex,
  question,
  answer
) => {
  return api.post("/api/interview/submit", {
    interviewId,
    questionIndex,
    question,
    answer,
  });
};