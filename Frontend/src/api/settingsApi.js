import api from "./axios";


// GET SETTINGS

export const getSettings = () => {
  return api.get("/api/settings");
};


// UPDATE PROFILE

export const updateProfile = (data) => {
  return api.put(
    "/api/settings/profile",
    data
  );
};


// UPDATE PREFERENCES

export const updatePreferences = (data) => {
  return api.put(
    "/api/settings/preferences",
    data
  );
};


// CHANGE PASSWORD

export const changePassword = (data) => {
  return api.put(
    "/api/settings/password",
    data
  );
};


// DELETE ACCOUNT

export const deleteAccount = () => {
  return api.delete(
    "/api/settings/account"
  );
};