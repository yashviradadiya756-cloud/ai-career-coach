import api from "./axios";

export const generateRoadmap = () =>
  api.post("/api/roadmap/generate");

export const getRoadmap = () =>
  api.get("/api/roadmap");