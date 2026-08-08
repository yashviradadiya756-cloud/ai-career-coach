const express = require("express");

const router = express.Router();

const {
  getDashboardOverview,
} = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");

// GET /api/dashboard/overview
router.get(
  "/overview",
  protect,
  getDashboardOverview
);

module.exports = router;