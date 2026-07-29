import api from "./axios";

export const getAchievements = () =>
  api.get("/api/achievement");

export const claimAchievement = (id) =>
  api.post(`/api/achievement/${id}`);