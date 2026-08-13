import api from "./axios";

// =====================================================
// ANALYZE SKILL GAP
// =====================================================

export const analyzeSkillGap = (
  targetRole
) => {
  return api.post(
    "/api/skillgap/analyze",
    {
      targetRole: String(
        targetRole || ""
      ).trim(),
    }
  );
};

// =====================================================
// GET LATEST
// =====================================================

export const getLatestSkillGap = () => {
  return api.get(
    "/api/skillgap/latest"
  );
};