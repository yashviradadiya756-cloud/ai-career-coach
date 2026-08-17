import api from "./axios";

// ==========================================
// ADMIN DASHBOARD
// ==========================================

export const getAdminDashboard = async () => {
  const response = await api.get("/api/admin/dashboard", {
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
// ADMIN USERS
// ==========================================

export const getAdminUsers = async () => {
  const response = await api.get("/api/admin/users", {
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

export const deleteAdminUser = async (id) => {
  const response = await api.delete(
    `/api/admin/users/${id}`
  );

  return response.data;
};

// ==========================================
// ADMIN RESUMES
// ==========================================

export const getAdminResumes = async () => {
  const response = await api.get("/api/admin/resumes", {
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
// ADMIN ROADMAPS
// ==========================================

export const getAdminRoadmaps = async () => {
  const response = await api.get("/api/admin/roadmaps", {
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
// ADMIN SKILL GAPS
// ==========================================

export const getAdminSkillGaps = async () => {
  const response = await api.get("/api/admin/skill-gaps", {
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
// ADMIN INTERVIEWS
// ==========================================

export const getAdminInterviews = async () => {
  const response = await api.get("/api/admin/interviews", {
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
// ADMIN COURSES
// ==========================================

export const getAdminCourses = async () => {
  const response = await api.get("/api/admin/courses", {
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
    {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      params: {
        _: Date.now(),
      },
    }
  );

  return response.data;
};

// ==========================================
// ADMIN PAYMENTS
// ==========================================

export const getAdminPayments = async () => {
  const response = await api.get(
    "/api/admin/payments",
    {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      params: {
        _: Date.now(),
      },
    }
  );

  return response.data;
};

// ==========================================
// ADMIN USER PROGRESS
// ==========================================

export const getAdminProgress = async () => {
  const response = await api.get(
    "/api/admin/progress",
    {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      params: {
        _: Date.now(),
      },
    }
  );

  return response.data;
};

// ==========================================
// ADMIN ACHIEVEMENTS
// ==========================================

export const getAdminAchievements = async () => {
  const response = await api.get(
    "/api/admin/achievements",
    {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      params: {
        _: Date.now(),
      },
    }
  );

  return response.data;
};

// ==========================================
// CERTIFICATE CRITERIA
// ==========================================

export const getCertificateCriteria = async () => {
  const response = await api.get(
    "/api/admin/certificate-criteria",
    {
      params: {
        _: Date.now(),
      },
    }
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
// ==========================================

export const getAdminFeedback = async () => {
  const response = await api.get(
    "/api/admin/feedback",
    {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      params: {
        _: Date.now(),
      },
    }
  );

  return response.data;
};