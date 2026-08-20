import api from "./axios";

// ==========================================
// GET LATEST RESUME
// ==========================================
export const getLatestResume = async () => {
  try {
    const res = await api.get('/api/resume/latest'); // ✅ fixed
    return res.data;
  } catch (err) {
    if (err.response?.status === 404) {
      return null; // No resume yet — not a real error
    }
    throw err;
  }
};

// ==========================================
// UPLOAD RESUME
// ==========================================
export const uploadResume = async (formData) => {
  try {
    const response = await api.post(
      "/api/resume/upload",
      formData
    );
    return response.data;
  } catch (error) {
    console.error(
      "UPLOAD RESUME ERROR:",
      error.response?.data || error.message
    );
    throw error;
  }
};