import api from "./axios";

// ==========================================
// ADMIN DASHBOARD
// ==========================================

export const getAdminDashboard = () => {
  return api.get("/api/admin/dashboard");
};


// ==========================================
// ADMIN USERS
// ==========================================

export const getAdminUsers = () => {
  return api.get("/api/admin/users");
};

export const deleteAdminUser = (id) => {
  return api.delete(`/api/admin/users/${id}`);
};


// ==========================================
// ADMIN RESUMES
// ==========================================

export const getAdminResumes = () => {
  return api.get("/api/admin/resumes");
};


// ==========================================
// ADMIN ROADMAPS
// ==========================================

export const getAdminRoadmaps = () => {
  return api.get("/api/admin/roadmap");
};


// ==========================================
// ADMIN SKILL GAP
// ==========================================

export const getAdminSkillGaps = () => {
  return api.get("/api/admin/skillgap");
};


// ==========================================
// ADMIN INTERVIEWS
// ==========================================

export const getAdminInterviews = () => {
  return api.get("/api/admin/interviews");
};


// ==========================================
// ADMIN PAYMENTS
// ==========================================

export const getAdminPayments = () => {
  return api.get("/api/admin/payments");
};


// ==========================================
// ADMIN FEEDBACK
// ==========================================

export const getAdminFeedback = () => {
  return api.get("/api/admin/feedback");
};