import api from "./axios";

// =====================================================
// ANALYZE SKILL GAP
// =====================================================

export const analyzeSkillGap = async (data) => {
  return api.post(
    "/api/skillgap/analyze",
    data
  );
};

// =====================================================
// GET LATEST SKILL GAP
// =====================================================

export const getLatestSkillGap = async () => {
  return api.get(
    "/api/skillgap/latest"
  );
};

// =====================================================
// GET ALL SKILL GAPS
// =====================================================

export const getSkillGaps = async () => {
  return api.get(
    "/api/skillgap"
  );
};