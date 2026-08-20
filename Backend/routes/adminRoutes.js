const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAdminDashboard,
  getAdminUsers,
  deleteAdminUser,

  getAdminCourses,
  createAdminCourse,
  updateAdminCourse,
  deleteAdminCourse,

  getAdminUserLearnings,

  getAdminResumes,
  getAdminRoadmaps,
  getAdminSkillGaps,
  getAdminInterviews,
  getAdminPayments,
  getAdminProgress,
  getAdminAchievements,

  createCertificateCriteria,
  getCertificateCriteria,
  updateCertificateCriteria,
  deleteCertificateCriteria,

  checkCertificateEligibility,
  generateCertificate,

  getAdminFeedback,
} = require("../controllers/adminController");


// ==========================================
// DASHBOARD
// ==========================================

router.get(
  "/dashboard",
  protect,
  adminMiddleware,
  getAdminDashboard
);


// ==========================================
// USERS
// ==========================================

router.get(
  "/users",
  protect,
  adminMiddleware,
  getAdminUsers
);

router.delete(
  "/users/:id",
  protect,
  adminMiddleware,
  deleteAdminUser
);


// ==========================================
// COURSES
// ==========================================

router.get(
  "/courses",
  protect,
  adminMiddleware,
  getAdminCourses
);

router.post(
  "/courses",
  protect,
  adminMiddleware,
  createAdminCourse
);

router.put(
  "/courses/:id",
  protect,
  adminMiddleware,
  updateAdminCourse
);

router.delete(
  "/courses/:id",
  protect,
  adminMiddleware,
  deleteAdminCourse
);


// ==========================================
// USER LEARNINGS
// ==========================================

router.get(
  "/user-learnings",
  protect,
  adminMiddleware,
  getAdminUserLearnings
);


// ==========================================
// RESUMES
// ==========================================

router.get(
  "/resumes",
  protect,
  adminMiddleware,
  getAdminResumes
);


// ==========================================
// ROADMAPS
// ==========================================

router.get(
  "/roadmaps",
  protect,
  adminMiddleware,
  getAdminRoadmaps
);


// ==========================================
// SKILL GAPS
// ==========================================

router.get(
  "/skill-gaps",
  protect,
  adminMiddleware,
  getAdminSkillGaps
);


// ==========================================
// INTERVIEWS
// ==========================================

router.get(
  "/interviews",
  protect,
  adminMiddleware,
  getAdminInterviews
);


// ==========================================
// PAYMENTS
// ==========================================

router.get(
  "/payments",
  protect,
  adminMiddleware,
  getAdminPayments
);


// ==========================================
// PROGRESS
// ==========================================

router.get(
  "/progress",
  protect,
  adminMiddleware,
  getAdminProgress
);


// ==========================================
// ACHIEVEMENTS
// ==========================================

router.get(
  "/achievements",
  protect,
  adminMiddleware,
  getAdminAchievements
);


// ==========================================
// CERTIFICATE CRITERIA
// ==========================================

router.get(
  "/certificate-criteria",
  protect,
  adminMiddleware,
  getCertificateCriteria
);

router.post(
  "/certificate-criteria",
  protect,
  adminMiddleware,
  createCertificateCriteria
);

router.put(
  "/certificate-criteria/:id",
  protect,
  adminMiddleware,
  updateCertificateCriteria
);

router.delete(
  "/certificate-criteria/:id",
  protect,
  adminMiddleware,
  deleteCertificateCriteria
);


// ==========================================
// CERTIFICATE ELIGIBILITY
// ==========================================

router.get(
  "/certificate-eligibility/:userId/:criteriaId",
  protect,
  adminMiddleware,
  checkCertificateEligibility
);


// ==========================================
// GENERATE CERTIFICATE
// ==========================================

router.post(
  "/certificates/generate",
  protect,
  adminMiddleware,
  generateCertificate
);


// ==========================================
// FEEDBACK
// ==========================================

router.get(
  "/feedback",
  protect,
  adminMiddleware,
  getAdminFeedback
);


// ==========================================
// EXPORT
// ==========================================

module.exports = router;