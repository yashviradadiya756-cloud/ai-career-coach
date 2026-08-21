import axios from "axios";

const api = axios.create({
  baseURL:
    "https://ai-career-coach-jpzu.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================================
// ADD JWT TOKEN TO EVERY REQUEST
// =====================================================

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    console.log(
      "API REQUEST:",
      config.method?.toUpperCase(),
      config.url
    );

    console.log(
      "TOKEN SENT:",
      !!token
    );

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {

    console.error(
      "API ERROR:",
      error.response?.status,
      error.response?.data
    );

    return Promise.reject(error);
  }
);

export default api;