import api from "./axios";

export const getSettings = () => {
  return api.get("/api/settings");
};

export const updateProfile = (data) => {
  console.log("SENDING PROFILE DATA:", data);

  return api.put(
    "/api/settings/profile",
    data
  );
};

export const updatePreferences = (data) => {
  return api.put(
    "/api/settings/preferences",
    data
  );
};

export const changePassword = (data) => {
  return api.put(
    "/api/settings/password",
    data
  );
};

export const deleteAccount = () => {
  return api.delete(
    "/api/settings/account"
  );
};