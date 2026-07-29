import api from "./axios";

export const getProfile = () => {
  return api.get("/api/users/profile");
};

export const updateProfile = (data) => {
  return api.put("/api/users/profile", data);
};