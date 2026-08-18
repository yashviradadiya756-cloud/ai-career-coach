import api from "./axios";

// ==========================================
// ADMIN DASHBOARD
// ==========================================

export const getAdminDashboard = async (
  range = "12m"
) => {
  const response = await api.get(
    `/api/admin/dashboard?range=${range}`
  );

  return response.data;
};

// ==========================================
// ADMIN USERS
// GET /api/admin/users
// ==========================================
export const getAdminUsers = async () => {
  const response = await api.get(
    "/api/admin/users",
    noCacheConfig
  );

  console.log(
    "ADMIN USERS API:",
    response.data
  );

  return response.data;
};

// ==========================================
// DELETE ADMIN USER
// DELETE /api/admin/users/:id
// ==========================================
export const deleteAdminUser = async (id) => {
  const response = await api.delete(
    `/api/admin/users/${id}`
  );

  return response.data;
};

// ==========================================
// ADMIN RESUMES
// GET /api/admin/resumes
// ==========================================
export const getAdminResumes = async () => {
  const response = await api.get(
    "/api/admin/resumes",
    noCacheConfig
  );

  console.log(
    "ADMIN RESUMES API:",
    response.data
  );

  return response.data;
};

// ==========================================
// ADMIN ROADMAPS
// GET /api/admin/roadmaps
// ==========================================
export const getAdminRoadmaps = async () => {
  const response = await api.get(
    "/api/admin/roadmaps",
    noCacheConfig
  );

  console.log(
    "ADMIN ROADMAPS API:",
    response.data
  );

  return response.data;
};

// ==========================================
// ADMIN SKILL GAPS
// GET /api/admin/skill-gaps
// ==========================================
export const getAdminSkillGaps = async () => {
  const response = await api.get(
    "/api/admin/skill-gaps",
    noCacheConfig
  );

  console.log(
    "ADMIN SKILL GAPS API:",
    response.data
  );

  return response.data;
};

// ==========================================
// ADMIN INTERVIEWS
// GET /api/admin/interviews
// ==========================================
export const getAdminInterviews = async () => {
  const response = await api.get(
    "/api/admin/interviews",
    noCacheConfig
  );

  console.log(
    "ADMIN INTERVIEWS API:",
    response.data
  );

  return response.data;
};

// ==========================================
// ADMIN COURSES
// GET /api/admin/courses
// ==========================================
export const getAdminCourses = async () => {
  const response = await api.get(
    "/api/admin/courses",
    noCacheConfig
  );

  return response.data;
};

// ==========================================
// CREATE ADMIN COURSE
// POST /api/admin/courses
// ==========================================
export const createAdminCourse = async (
  courseData
) => {
  const response = await api.post(
    "/api/admin/courses",
    courseData
  );

  return response.data;
};

// ==========================================
// UPDATE ADMIN COURSE
// PUT /api/admin/courses/:id
// ==========================================
export const updateAdminCourse = async (
  id,
  courseData
) => {
  const response = await api.put(
    `/api/admin/courses/${id}`,
    courseData
  );

  return response.data;
};

// ==========================================
// DELETE ADMIN COURSE
// DELETE /api/admin/courses/:id
// ==========================================
export const deleteAdminCourse = async (id) => {
  const response = await api.delete(
    `/api/admin/courses/${id}`
  );

  return response.data;
};

// ==========================================
// ADMIN USER LEARNINGS
// GET /api/admin/user-learnings
// ==========================================
export const getAdminUserLearnings = async () => {
  const response = await api.get(
    "/api/admin/user-learnings",
    noCacheConfig
  );

  console.log(
    "ADMIN USER LEARNINGS API:",
    response.data
  );

  return response.data;
};

// ==========================================
// ADMIN PAYMENTS
// GET /api/admin/payments
// ==========================================
export const getAdminPayments = async () => {
  const response = await api.get(
    "/api/admin/payments",
    noCacheConfig
  );

  return response.data;
};

// ==========================================
// ADMIN PROGRESS
// GET /api/admin/progress
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
// GET /api/admin/achievements
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

export const createCertificateCriteria = async (
  data
) => {
  const response = await api.post(
    "/api/admin/certificate-criteria",
    data
  );

  return response.data;
};

export const updateCertificateCriteria = async (
  id,
  data
) => {
  const response = await api.put(
    `/api/admin/certificate-criteria/${id}`,
    data
  );

  return response.data;
};

export const deleteCertificateCriteria = async (
  id
) => {
  const response = await api.delete(
    `/api/admin/certificate-criteria/${id}`
  );

  return response.data;
};

// ==========================================
// CERTIFICATE ELIGIBILITY
// ==========================================
export const checkCertificateEligibility = async (
  userId,
  criteriaId
) => {
  const response = await api.get(
    `/api/admin/certificate-eligibility/${userId}/${criteriaId}`
  );

  return response.data;
};

// ==========================================
// GENERATE CERTIFICATE
// ==========================================
export const generateCertificate = async (
  userId,
  criteriaId
) => {
  const response = await api.post(
    "/api/admin/certificates/generate",
    {
      userId,
      criteriaId,
    }
  );

  return response.data;
};

// ==========================================
// ADMIN FEEDBACK
// GET /api/admin/feedback
// ==========================================
export const getAdminFeedback = async () => {
  const response = await api.get(
    "/api/admin/feedback",
    noCacheConfig
  );

  return response.data;
};