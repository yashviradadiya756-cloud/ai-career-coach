import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://ai-career-coach-jpzu.onrender.com/api";

export const sendContactMessage = async (data) => {
  const response = await axios.post(
    `${API_URL}/contact`,
    data
  );

  return response.data;
};