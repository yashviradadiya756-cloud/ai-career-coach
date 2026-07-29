import api from "./axios";


export const uploadResume = (formData) => {
  return api.post("/api/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export const getLatestResume = () => {
  return api.get("/api/resume/latest");
};