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
// ADMIN COURSES
// ==========================================

export const getAdminCourses = async () => {
  const response = await api.get("/api/admin/courses");
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

export const getAdminUserLearnings = async () => {
  const response = await api.get(
    "/api/admin/user-learnings"
  );

  return response.data;
};


// ==========================================
// ADMIN PAYMENTS
// ==========================================

export const getAdminPayments = async () => {
  const response = await api.get("/api/admin/payments", {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
    params: {
      _: Date.now(),
    },
  });

  return response.data;
};

// ==========================================
// ADMIN FEEDBACK
// ==========================================

export const getAdminFeedback = () => {
  return api.get("/api/admin/feedback");
};