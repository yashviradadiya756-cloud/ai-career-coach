import api from "./axios";

// =====================================================
// GET ROADMAP
// =====================================================

export const getRoadmap = async () => {
  return api.get("/api/roadmap");
};

// =====================================================
// GENERATE ROADMAP
// =====================================================

export const generateRoadmap = async (targetRole) => {
  return api.post(
    "/api/roadmap/generate",
    {
      targetRole,
    }
  );
};

// =====================================================
// UPDATE PHASE
// =====================================================

export const updatePhaseCompletion = async (
  phaseId,
  completed
) => {
  return api.put(
    `/api/roadmap/phase/${phaseId}`,
    {
      completed,
    }
  );
};