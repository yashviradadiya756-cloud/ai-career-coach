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


// ==========================================
// ADMIN AUTH MIDDLEWARE
// ==========================================

router.use(protect);
router.use(adminMiddleware);


// ==========================================
// TEST ROUTE
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
  (req, res, next) => {

    console.log(
      "================================"
    );

    console.log(
      "ADMIN SKILL GAP ROUTE HIT"
    );

    console.log(
      "USER:",
      req.user?._id
    );

    console.log(
      "================================"
    );

    next();
  },
  getAdminSkillGaps
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