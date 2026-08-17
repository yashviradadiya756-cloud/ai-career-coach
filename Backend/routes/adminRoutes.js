const express = require("express");

const router = express.Router();

// ==========================================
// MIDDLEWARE
// ==========================================
const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ==========================================
// ADMIN CONTROLLER
// ==========================================
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
// ADMIN DASHBOARD
// GET /api/admin/dashboard
// ==========================================
router.get(
  "/dashboard",
  protect,
  adminMiddleware,
  getAdminDashboard
);

// ==========================================
// ADMIN USERS
// GET /api/admin/users
// DELETE /api/admin/users/:id
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
// ADMIN COURSES
// GET    /api/admin/courses
// POST   /api/admin/courses
// PUT    /api/admin/courses/:id
// DELETE /api/admin/courses/:id
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
// ADMIN USER LEARNINGS
// GET /api/admin/user-learnings
// ==========================================
router.get(
  "/user-learnings",
  protect,
  adminMiddleware,
  getAdminUserLearnings
);

// ==========================================
// ADMIN RESUMES
// GET /api/admin/resumes
// ==========================================
router.get(
  "/resumes",
  protect,
  adminMiddleware,
  getAdminResumes
);

// ==========================================
// ADMIN ROADMAPS
// GET /api/admin/roadmaps
// ==========================================
router.get(
  "/roadmaps",
  protect,
  adminMiddleware,
  getAdminRoadmaps
);

// ==========================================
// ADMIN SKILL GAPS
// GET /api/admin/skill-gaps
// ==========================================
router.get(
  "/skill-gaps",
  protect,
  adminMiddleware,
  getAdminSkillGaps
);

// ==========================================
// ADMIN INTERVIEWS
// GET /api/admin/interviews
// ==========================================
router.get(
  "/interviews",
  protect,
  adminMiddleware,
  getAdminInterviews
);

// ==========================================
// ADMIN PAYMENTS
// GET /api/admin/payments
// ==========================================
router.get(
  "/payments",
  protect,
  adminMiddleware,
  getAdminPayments
);

// ==========================================
// ADMIN USER PROGRESS
// GET /api/admin/progress
// ==========================================

router.get(
  "/progress",
  protect,
  adminMiddleware,
  getAdminProgress
);


// ==========================================
// ADMIN ACHIEVEMENTS
// GET /api/admin/achievements
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
// ADMIN FEEDBACK
// GET /api/admin/feedback
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