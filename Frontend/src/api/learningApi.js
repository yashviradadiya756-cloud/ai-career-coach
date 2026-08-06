import api from "./axios";

export const getLearning = async () => {
  const response = await api.get("/api/learning");
  return response.data;
};

export const generateLearning = async (targetRole) => {
  const response = await api.post("/api/learning/generate", {
    targetRole,
  });

  return response.data;
};