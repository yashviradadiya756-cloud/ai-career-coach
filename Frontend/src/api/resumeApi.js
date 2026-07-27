import API from "./axios";

export const uploadResume = (formData) =>
  API.post("/resume/upload", formData);

export const getResume = () =>
  API.get("/resume");