import api from "./api";

export const analyzeSkillGap = async (
  targetRole
) => {
  return api.post(
    "/api/skill-gap/analyze",
    {
      targetRole,
    }
  );
};

export const getLatestSkillGap = async () => {
  return api.get(
    "/api/skill-gap/latest"
  );
};