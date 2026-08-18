import api from "./axios";

// ==========================================
// CACHE CONTROL
// ==========================================
const noCacheConfig = {
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  },
};

// ==========================================
// ADMIN DASHBOARD
// ==========================================
export const getAdminDashboard = async () => {
  const response = await api.get(
    "/api/admin/dashboard",
    noCacheConfig
  );

  return response.data;
};

// ==========================================
// ADMIN USERS
// ==========================================
export const getAdminUsers = async () => {
  const response = await api.get(
    "/api/admin/users",
    noCacheConfig
  );

  return response.data;
};

export const deleteAdminUser = async (id) => {
  const response = await api.delete(
    `/api/admin/users/${id}`
  );

  return response.data;
};

export const updateAdminUserStatus = async (id, status) => {
  const response = await api.put(
    `/api/admin/users/${id}/status`,
    { status }
  );

  return response.data;
};

// ==========================================
// ADMIN RESUMES
// ==========================================
export const getAdminResumes = async () => {
  const response = await api.get(
    "/api/admin/resumes",
    noCacheConfig
  );

  return response.data;
};

// ==========================================
// ADMIN ROADMAPS
// ==========================================
export const getAdminRoadmaps = async () => {
  const response = await api.get(
    "/api/admin/roadmaps",
    noCacheConfig
  );

  return response.data;
};

// ==========================================
// ADMIN SKILL GAPS
// ==========================================
export const getAdminSkillGaps = async () => {
  const response = await api.get(
    "/api/admin/skill-gaps",
    noCacheConfig
  );

  return response.data;
};

// ==========================================
// ADMIN INTERVIEWS
// ==========================================
export const getAdminInterviews = async () => {
  const response = await api.get(
    "/api/admin/interviews",
    noCacheConfig
  );

  return response.data;
};

// ==========================================
// ADMIN COURSES
// ==========================================
export const getAdminCourses = async () => {
  const response = await api.get(
    "/api/admin/courses",
    noCacheConfig
  );

  return response.data;
};

export const createAdminCourse = async (courseData) => {
  const response = await api.post(
    "/api/admin/courses",
    courseData
  );

  return response.data;
};

export const updateAdminCourse = async (id, courseData) => {
  const response = await api.put(
    `/api/admin/courses/${id}`,
    courseData
  );

  return response.data;
};

export const deleteAdminCourse = async (id) => {
  const response = await api.delete(
    `/api/admin/courses/${id}`
  );

  return response.data;
};

// ==========================================
// ADMIN USER LEARNINGS
// ==========================================
export const getAdminUserLearnings = async () => {
  const response = await api.get(
    "/api/admin/user-learnings",
    noCacheConfig
  );

  return response.data;
};

// ==========================================
// ADMIN PROGRESS
// ==========================================
export const getAdminProgress = async () => {
  const response = await api.get(
    "/api/admin/progress",
    noCacheConfig
  );

  return response.data;
};

// ==========================================
// ADMIN ACHIEVEMENTS
// ==========================================
export const getAdminAchievements = async () => {
  const response = await api.get(
    "/api/admin/achievements",
    noCacheConfig
  );

  return response.data;
};

// ==========================================
// CERTIFICATE CRITERIA
// ==========================================

export const getCertificateCriteria = async () => {
  const response = await api.get(
    "/api/admin/certificate-criteria",
    noCacheConfig
  );

  return response.data;
};

export const createCertificateCriteria = async (criteriaData) => {
  const response = await api.post(
    "/api/admin/certificate-criteria",
    criteriaData
  );

  return response.data;
};

export const updateCertificateCriteria = async (id, criteriaData) => {
  const response = await api.put(
    `/api/admin/certificate-criteria/${id}`,
    criteriaData
  );

  return response.data;
};

export const deleteCertificateCriteria = async (id) => {
  const response = await api.delete(
    `/api/admin/certificate-criteria/${id}`
  );

  return response.data;
};

// ==========================================
// ADMIN PAYMENTS
// ==========================================
export const getAdminPayments = async () => {
  const response = await api.get(
    "/api/admin/payments",
    noCacheConfig
  );

  return response.data;
};

// ==========================================
// ADMIN FEEDBACK
// ==========================================
export const getAdminFeedback = async () => {
  const response = await api.get(
    "/api/admin/feedback",
    noCacheConfig
  );

  return response.data;
};