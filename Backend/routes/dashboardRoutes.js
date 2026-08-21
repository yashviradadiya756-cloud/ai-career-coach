const express = require("express");

const router = express.Router();

// =====================================================
// CONTROLLER
// =====================================================

const {
  getDashboardOverview,
} = require("../controllers/dashboardController");

// =====================================================
// AUTH MIDDLEWARE
// =====================================================

const protect = require(
  "../middleware/authMiddleware"
);

// =====================================================
// DEBUG
// =====================================================

console.log("=================================");
console.log("DASHBOARD ROUTES");
console.log("=================================");

console.log(
  "protect:",
  typeof protect
);

console.log(
  "Dashboard controller:",
  typeof getDashboardOverview
);

console.log("=================================");

// =====================================================
// VALIDATION
// =====================================================

if (typeof protect !== "function") {
  throw new Error(
    "protect middleware is not a function. Check authMiddleware.js export."
  );
}

if (typeof getDashboardOverview !== "function") {
  throw new Error(
    "getDashboardOverview controller is not a function. Check dashboardController.js export."
  );
}

// =====================================================
// ROUTES
// =====================================================

router.get(
  "/overview",
  protect,
  getDashboardOverview
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;