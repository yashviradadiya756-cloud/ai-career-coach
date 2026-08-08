import api from "./axios";


// REGISTER
export const registerUser = (data) => {
  return api.post(
    "/api/auth/register",
    data
  );
};


// LOGIN
export const loginUser = (data) => {
  return api.post(
    "/api/auth/login",
    data
  );
};