import api from "./axios";

export const analyzeSkillGap = (targetRole) =>
  api.post("/api/skillgap/analyze", {
    targetRole,
  });

export const getLatestSkillGap = () =>
  api.get("/api/skillgap/latest");