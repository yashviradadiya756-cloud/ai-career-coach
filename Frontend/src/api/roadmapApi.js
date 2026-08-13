import api from "./axios";

export const generateRoadmap = (targetRole) => {
  return api.post("/api/roadmap/generate", {
    targetRole,
  });
};

export const getRoadmap = () => {
  return api.get("/api/roadmap");
};

export const updatePhaseCompletion = (
  phaseId,
  completed
) => {
  return api.put(
    `/api/roadmap/phase/${phaseId}`,
    {
      completed,
    }
  );
};