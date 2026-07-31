import api from "./axios";

export const generateRoadmap = (targetRole) =>
  api.post("/api/roadmap/generate", {
    targetRole,
  });

export const getRoadmap = () =>
  api.get("/api/roadmap");  