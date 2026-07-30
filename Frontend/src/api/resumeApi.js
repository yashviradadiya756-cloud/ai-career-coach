import axios from "./axios";

export const uploadResume = (formData) =>
  axios.post("/api/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getLatestResume = () =>
  axios.get("/api/resume/latest");

