import adminApi from "./adminAxios";

// ==========================================
// ADMIN DASHBOARD
// ==========================================

export const getAdminDashboard = () => {
  return adminApi.get("/api/admin/dashboard");
};

// ==========================================
// ADMIN USERS
// ==========================================

export const getAdminUsers = () => {
  return adminApi.get("/api/admin/users");
};

export const deleteAdminUser = (id) => {
  return adminApi.delete(`/api/admin/users/${id}`);
};

// ==========================================
// ADMIN RESUMES
// ==========================================

export const getAdminResumes = () => {
  return adminApi.get("/api/admin/resumes");
};

// ==========================================
// ADMIN PAYMENTS
// ==========================================

export const getAdminPayments = () => {
  return adminApi.get("/api/admin/payments");
};

// ==========================================
// ADMIN FEEDBACK
// ==========================================

export const getAdminFeedback = () => {
  return adminApi.get("/api/admin/feedback");
};