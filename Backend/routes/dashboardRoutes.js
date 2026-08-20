const express = require("express");

const router = express.Router();

// Controller
const {
  getDashboardOverview,
} = require("../controllers/dashboardController");

// Middleware
const protect = require("../middleware/authMiddleware");

// =====================================================
// GET DASHBOARD OVERVIEW
// GET /api/dashboard/overview
// =====================================================
console.log(
  "Dashboard protect:",
  typeof protect
);

console.log(
  "Dashboard controller:",
  typeof getDashboardOverview
);
router.get(
  "/overview",
  protect,
  getDashboardOverview
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;