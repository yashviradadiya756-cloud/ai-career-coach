import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export const getDashboardOverview = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/api/dashboard/overview`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};