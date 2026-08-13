import axios from "axios";

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    console.log(
      "ADMIN API:",
      config.baseURL + config.url
    );

    console.log(
      "ADMIN TOKEN EXISTS:",
      !!token
    );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default adminApi;