import axios from "axios";

const API_URL =
  "https://ai-career-coach-jpzu.onrender.com/api/roadmap";

// ======================================================
// GET SAVED ROADMAP
// ======================================================

export const getRoadmap = async () => {
  return axios.get(`${API_URL}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// ======================================================
// GENERATE ROADMAP
// ======================================================

export const generateRoadmap = async (targetRole) => {
  console.log("ROADMAP API REQUEST");
  console.log("URL:", `${API_URL}/generate`);
  console.log("TARGET ROLE:", targetRole);

  return axios.post(
    `${API_URL}/generate`,
    {
      targetRole: targetRole.trim(),
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }
  );
};

// ======================================================
// UPDATE PHASE COMPLETION
// ======================================================

export const updatePhaseCompletion = async (
  phaseId,
  completed
) => {
  return axios.patch(
    `${API_URL}/phase/${phaseId}`,
    {
      completed,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }
  );
};