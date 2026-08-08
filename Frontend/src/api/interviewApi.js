import api from "./axios";

// ==========================================
// GENERATE INTERVIEW
// ==========================================

export const generateInterview = async (targetRole) => {
  const response = await api.post(
    "/api/interview/generate",
    {
      targetRole,
    }
  );

  return response.data;
};

// ==========================================
// SUBMIT INTERVIEW
// ==========================================

export const submitInterview = async (data) => {
  const response = await api.post(
    "/api/interview/submit",
    data
  );

  return response.data;
};