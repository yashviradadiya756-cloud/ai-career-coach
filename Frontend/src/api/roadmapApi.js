import api from "./axios";

/* =====================================================
   GET ROADMAP
===================================================== */

export const getRoadmap = () => {
  return api.get(
    "/api/roadmap"
  );
};

/* =====================================================
   GENERATE ROADMAP
===================================================== */

export const generateRoadmap = (
  data
) => {
  return api.post(
    "/api/roadmap/generate",
    data
  );
};

/* =====================================================
   UPDATE PHASE COMPLETION
===================================================== */

export const updatePhaseCompletion = (
  phaseId,
  completed
) => {
  return api.put(
    `/api/roadmap/phase/${phaseId}`,
    {
      phaseId,
      completed,
    }
  );
};