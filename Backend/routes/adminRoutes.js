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
  getAdminPayments,
  getAdminFeedback,
} = require("../controllers/adminController");


router.use(protect);
router.use(adminMiddleware);


// Dashboard
router.get(
  "/dashboard",
  getAdminDashboard
);


// Users
router.get(
  "/users",
  getAdminUsers
);

router.delete(
  "/users/:id",
  deleteAdminUser
);


// Resumes
router.get(
  "/resumes",
  getAdminResumes
);


// Roadmaps
router.get(
  "/roadmap",
  getAdminRoadmaps
);


// Skill Gap
router.get(
  "/skillgap",
  getAdminSkillGaps
);


// Payments
router.get(
  "/payments",
  getAdminPayments
);


// Feedback
router.get(
  "/feedback",
  getAdminFeedback
);


module.exports = router;