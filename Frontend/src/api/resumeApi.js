import api from "./axios";

export const uploadResume = (formData) =>
  api.post("/api/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const analyzeResume = () =>
  api.get("/api/resume/analyze");