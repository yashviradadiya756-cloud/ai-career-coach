import api from "./axios";

export const analyzeSkillGap = async (targetRole) => {
  return api.post(
    "/api/skillgap/analyze",
    {
      targetRole,
    }
  );
};

export const getLatestSkillGap = async () => {
  return api.get(
    "/api/skillgap/latest"
  );
};