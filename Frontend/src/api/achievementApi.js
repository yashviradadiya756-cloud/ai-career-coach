import api from "./axios";

export const getAchievements = () => {
  return api.get("/api/achievement");
};

export const updateAchievements = () => {
  return api.post("/api/achievement/update");
};