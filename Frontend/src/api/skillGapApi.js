import api from "./axios";

// ==========================================
// ANALYZE
// ==========================================

export const analyzeSkillGap = (
  targetRole
) => {
  return api.post(
    "/api/skillgap/analyze",
    {
      targetRole,
    }
  );
};

// ==========================================
// GET LATEST
// ==========================================

export const getLatestSkillGap = () => {
  return api.get(
    "/api/skillgap/latest"
  );
};