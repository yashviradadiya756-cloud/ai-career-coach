import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export const getLearning = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/api/learning`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const generateLearning = async (targetRole) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/api/learning/generate`,
    {
      targetRole: targetRole,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};