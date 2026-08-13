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

router.use(protect);
router.use(adminMiddleware);

router.get(
  "/dashboard",
  getAdminDashboard
);

router.get(
  "/users",
  getAdminUsers
);

router.delete(
  "/users/:id",
  deleteAdminUser
);

router.get(
  "/resumes",
  getAdminResumes
);

router.get(
  "/payments",
  getAdminPayments
);

router.get(
  "/feedback",
  getAdminFeedback
);

module.exports = router;