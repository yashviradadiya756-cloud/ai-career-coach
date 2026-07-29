import api from "./axios";

export const startInterview = () =>
  api.post("/api/interview/start");

export const submitAnswer = (data) =>
  api.post("/api/interview/answer", data);

export const getInterviewResult = () =>
  api.get("/api/interview/result");