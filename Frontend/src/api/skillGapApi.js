import api from "./axios";

// ======================================================
// ANALYZE SKILL GAP
// ======================================================

export const analyzeSkillGap = async (targetRole) => {
  const response = await api.post(
    "/api/skillgap/analyze",
    {
      targetRole,
    }
  );

  return response.data;
};

// ======================================================
// GET LATEST SKILL GAP
// ======================================================

export const getLatestSkillGap = async () => {
  const response = await api.get(
    "/api/skillgap/latest"
  );

  return response.data;
};