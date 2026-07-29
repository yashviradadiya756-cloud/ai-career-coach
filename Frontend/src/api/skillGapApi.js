import api from "./axios";

export const analyzeSkillGap = () =>
  api.post("/api/skill-gap/analyze");

export const getSkillGap = () =>
  api.get("/api/skill-gap");