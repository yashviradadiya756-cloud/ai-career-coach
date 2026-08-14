import api from "./axios";

// =====================================================
// GET LATEST LEARNING PLAN
// =====================================================

export const getLearning = async () => {
  const response =
    await api.get("/api/learning");

  return response.data;
};

// =====================================================
// GENERATE LEARNING PLAN
// =====================================================

export const generateLearning =
  async () => {
    const response =
      await api.post(
        "/api/learning/generate"
      );

    return response.data;
  };