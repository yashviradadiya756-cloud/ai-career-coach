import api from "./axios";

// =====================================================
// GET LATEST RESUME
// =====================================================

export const getLatestResume = async () => {
  try {
    return await api.get("/api/resume/latest");
  } catch (error) {
    console.error(
      "GET LATEST RESUME ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =====================================================
// UPLOAD RESUME
// =====================================================

export const uploadResume = async (formData) => {
  try {
    return await api.post(
      "/api/resume/upload",
      formData
    );
  } catch (error) {
    console.error(
      "UPLOAD RESUME ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};