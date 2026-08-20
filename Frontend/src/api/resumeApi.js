import axios from "axios";

/*
|--------------------------------------------------------------------------
| API BASE URL
|--------------------------------------------------------------------------
| Local development:
|   http://localhost:5000
|
| Production:
|   https://ai-career-coach-jpzu.onrender.com
|--------------------------------------------------------------------------
*/

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://ai-career-coach-jpzu.onrender.com";

const resumeApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
});

/*
|--------------------------------------------------------------------------
| Add JWT token automatically
|--------------------------------------------------------------------------
*/

resumeApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*
|--------------------------------------------------------------------------
| Upload Resume
|--------------------------------------------------------------------------
|
| IMPORTANT:
| Do NOT manually set:
| Content-Type: multipart/form-data
|
| Axios/browser automatically adds:
| multipart/form-data; boundary=...
|
|--------------------------------------------------------------------------
*/

export const uploadResume = async (formData) => {
  try {
    console.log("====================================");
    console.log("RESUME UPLOAD START");
    console.log("====================================");

    // Debug FormData
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log("FORM FIELD:", key);
        console.log("FILE NAME:", value.name);
        console.log("FILE TYPE:", value.type);
        console.log("FILE SIZE:", value.size);
      } else {
        console.log("FORM FIELD:", key, value);
      }
    }

    const response = await resumeApi.post(
      "/api/resume/upload",
      formData
    );

    console.log("RESUME UPLOAD RESPONSE:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "API ERROR:",
      error.response?.status,
      error.response?.data || error.message
    );

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| Get Latest Resume
|--------------------------------------------------------------------------
*/

export const getLatestResume = async () => {
  try {
    const response = await resumeApi.get(
      "/api/resume/latest"
    );

    console.log(
      "LATEST RESUME RESPONSE:",
      response.data
    );

    return response.data;
  } catch (error) {
    /*
    |--------------------------------------------------------------------------
    | 404 means user has not uploaded a resume yet.
    |--------------------------------------------------------------------------
    */

    if (error.response?.status === 404) {
      console.log("No resume found.");
      return null;
    }

    console.error(
      "GET LATEST RESUME ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export default resumeApi;