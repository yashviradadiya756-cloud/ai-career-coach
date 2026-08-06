import api from "./axios";

// ======================================================
// GENERATE ROADMAP
// ======================================================

export const generateRoadmap = async (targetRole) => {

  if (!targetRole) {
    throw new Error(
      "Target role is required"
    );
  }

  console.log(
    "generateRoadmap() targetRole:",
    targetRole
  );

  const response = await api.post(
    "/api/roadmap/generate",
    {
      targetRole,
    }
  );

  console.log(
    "generateRoadmap() response:",
    response.data
  );

  return response;
};


// ======================================================
// GET SAVED ROADMAP
// ======================================================

export const getRoadmap = async () => {

  console.log(
    "getRoadmap() called"
  );

  const response = await api.get(
    "/api/roadmap"
  );

  console.log(
    "getRoadmap() response:",
    response.data
  );

  return response;
};

export const updatePhaseCompletion = (
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