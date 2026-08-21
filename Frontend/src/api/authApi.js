import api from "./axios";

export const loginUser = (data) => {
  console.log("=================================");
  console.log("AUTH API LOGIN REQUEST");
  console.log("EMAIL SENT TO BACKEND:", data.email);
  console.log("PASSWORD EXISTS:", !!data.password);
  console.log("=================================");
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