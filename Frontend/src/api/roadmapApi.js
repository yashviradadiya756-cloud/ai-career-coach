
import api from "./axios";

// ==========================================
// GENERATE ROADMAP
// ==========================================

export const generateRoadmap = async (targetRole) => {
  if (!targetRole) {
    throw new Error("Target role is required");
  }

  console.log("generateRoadmap() targetRole:", targetRole);

  const response = await api.post("/roadmap/generate", {
    targetRole,
  });

  console.log("generateRoadmap() response:", response.data);

  return response;
};


// ==========================================
// GET LATEST ROADMAP
// ==========================================

export const getRoadmap = async () => {
  console.log("getRoadmap() called");

  const response = await api.get("/roadmap");

  console.log("getRoadmap() response:", response.data);

  return response;
};
