import api from "./axios";

// Get current user settings
export const getSettings = () => {
  return api.get("/api/settings");
};

// Update profile — sends FormData to support photo upload
export const updateProfile = (formData) => {
  return api.put("/api/settings/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Update preferences (darkMode, notifications, etc.)
export const updatePreferences = (data) => {
  return api.put("/api/settings/preferences", data);
};

// Change password
export const changePassword = (data) => {
  return api.put("/api/settings/password", data);
};

// Delete account permanently
export const deleteAccount = () => {
  return api.delete("/api/settings/account");
};