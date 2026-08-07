import api from "./axios";

// Get latest learning recommendations
export const getLearning = async () => {
  const response = await api.get("/api/learning");
  return response.data;
};

// Generate new learning recommendations
export const generateLearning = async (targetRole) => {
  const response = await api.post(
    "/api/learning/generate",
    {
      targetRole,
    }
  );

  return response.data;
};
