import api from "./axios";


// Get settings
export const getSettings = () => {
  return api.get("/api/settings");
};


// Update profile
export const updateProfile = (data) => {
  return api.put("/api/settings/profile", data);
};


// Update preferences
export const updatePreferences = (data) => {
  return api.put("/api/settings/preferences", data);
};


// Change password
export const changePassword = (data) => {
  return api.put("/api/settings/password", data);
};


// Delete account
export const deleteAccount = () => {
  return api.delete("/api/settings/account");
};