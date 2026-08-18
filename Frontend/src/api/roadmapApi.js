import api from "./axios";

// =====================================================
// GET ROADMAP
// =====================================================

export const getRoadmap = () => {
  return api.get("/roadmap");
};

// =====================================================
// GENERATE ROADMAP
// =====================================================

export const generateRoadmap = (
  targetRole
) => {
  return api.post(
    "/roadmap/generate",
    {
      targetRole,
    }
  );
};

// =====================================================
// UPDATE PHASE COMPLETION
// =====================================================

export const updatePhaseCompletion = (
  phaseId,
  completed
) => {
  return api.patch(
    `/roadmap/phase/${phaseId}`,
    {
      completed,
    }
  );
};