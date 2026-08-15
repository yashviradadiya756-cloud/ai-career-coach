const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAdminDashboard,
  getAdminUsers,
  deleteAdminUser,
  getAdminResumes,
  getAdminRoadmaps,
  getAdminSkillGaps,
  getAdminInterviews,
  getAdminCourses,
  createAdminCourse,
  updateAdminCourse,
  deleteAdminCourse,
  getAdminUserLearnings,
  getAdminPayments,
  getAdminFeedback,
} = require("../controllers/adminController");

// ==========================================
// ADMIN AUTH
// ==========================================

router.use(protect);
router.use(adminMiddleware);

// ==========================================
// TEST
// GET /api/admin/test
// ==========================================

router.get("/test", (req, res) => {
  console.log("ADMIN TEST ROUTE HIT");

  res.status(200).json({
    success: true,
    message: "Admin routes are working",
  });
});

// ==========================================
// DASHBOARD
// GET /api/admin/dashboard
// ==========================================

router.get(
  "/dashboard",
  getAdminDashboard
);

// ==========================================
// USERS
// ==========================================

router.get(
  "/users",
  getAdminUsers
);

router.delete(
  "/users/:id",
  deleteAdminUser
);

// ==========================================
// RESUMES
// ==========================================

router.get(
  "/resumes",
  getAdminResumes
);

// ==========================================
// ROADMAPS
// ==========================================

router.get(
  "/roadmap",
  getAdminRoadmaps
);

// ==========================================
// SKILL GAP
// ==========================================

router.get(
  "/skillgap",
  getAdminSkillGaps
);

// ==========================================
// INTERVIEWS
// ==========================================

router.get(
  "/interviews",
  getAdminInterviews
);

// ==========================================
// COURSE MANAGEMENT ROUTES (FIXES 404)
// ==========================================
router.get("/courses", getAdminCourses);
router.post("/courses", createAdminCourse);
router.put("/courses/:id", updateAdminCourse);
router.delete("/courses/:id", deleteAdminCourse);
// ==========================================
// USER LEARNING INSIGHTS ROUTE
// ==========================================
router.get("/user-learnings", getAdminUserLearnings);

// ==========================================
// PAYMENTS
// ==========================================

router.get(
  "/payments",
  getAdminPayments
);

// ==========================================
// FEEDBACK
// ==========================================

router.get(
  "/feedback",
  getAdminFeedback
);

module.exports = router;