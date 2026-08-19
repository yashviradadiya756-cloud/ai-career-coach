import api from "./axios";

export const loginUser = (data) => {
  return api.post("/api/auth/login", data);
};

export const registerUser = (data) => {
  return api.post("/api/auth/register", data);
};

export const googleLoginUser = (credential) => {
  return api.post("/api/auth/google", {
    credential,
  });
};