import api from "./axios";

export const analyzeSkillGap = (targetRole) => {
  return api.post("/api/skillgap/analyze", {
    targetRole,
  });
};

export const getLatestSkillGap = () => {
  return api.get("/api/skillgap/latest");
};