import api from "./axios";

export const analyzeSkillGap = async (targetRole) => {
  const response = await api.post(
    "/api/skill-gap/analyze",
    {
      targetRole,
    }
  );

  return response;
};

export const getLatestSkillGap = async () => {
  const response = await api.get(
    "/api/skill-gap/latest"
  );

  return response;
};