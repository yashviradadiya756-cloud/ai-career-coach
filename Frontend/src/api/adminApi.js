import api from "./axios";

export const getAdminDashboard = () => {
  return api.get("/api/admin/dashboard");
};

export const getAdminUsers = () => {
  return api.get("/api/admin/users");
};

export const deleteAdminUser = (id) => {
  return api.delete(`/api/admin/users/${id}`);
};

export const getAdminResumes = () => {
  return api.get("/api/admin/resumes");
};

export const getAdminPayments = () => {
  return api.get("/api/admin/payments");
};

export const getAdminFeedback = () => {
  return api.get("/api/admin/feedback");
};