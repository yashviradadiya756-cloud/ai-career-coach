const express = require("express");

const router = express.Router();

const {
  getDashboardOverview,
} = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");

router.get(
  "/overview",
  protect,
  getDashboardOverview
);

module.exports = router;