import adminApi from "./adminAxios";

export const getAdminDashboard = () => {
  return adminApi.get("/api/admin/dashboard");
};

export const getAdminUsers = () => {
  return adminApi.get("/api/admin/users");
};

export const deleteAdminUser = (id) => {
  return adminApi.delete(
    `/api/admin/users/${id}`
  );
};

export const getAdminResumes = () => {
  return adminApi.get("/api/admin/resumes");
};

export const getAdminPayments = () => {
  return adminApi.get("/api/admin/payments");
};

export const getAdminFeedback = () => {
  return adminApi.get("/api/admin/feedback");
};