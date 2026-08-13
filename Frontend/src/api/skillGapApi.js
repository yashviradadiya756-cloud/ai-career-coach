import api from "./axios";

/* =====================================================
   ANALYZE SKILL GAP
===================================================== */

export const analyzeSkillGap = (
  data
) => {
  return api.post(
    "/api/skill-gap/analyze",
    data
  );
};

/* =====================================================
   GET LATEST SKILL GAP
===================================================== */

export const getLatestSkillGap = () => {
  return api.get(
    "/api/skill-gap/latest"
  );
};