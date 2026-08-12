const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAdminDashboard,
  getAdminUsers,
  deleteAdminUser,
  getAdminResumes,
  getAdminPayments,
  getAdminFeedback,
} = require("../controllers/adminController");


// ==========================================
// ADMIN PROTECTION
// ==========================================

router.use(protect);
router.use(adminMiddleware);


// ==========================================
// DASHBOARD
// ==========================================

router.get("/dashboard", getAdminDashboard);


// ==========================================
// USERS
// ==========================================

router.get("/users", getAdminUsers);

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