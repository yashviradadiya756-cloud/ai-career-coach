const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getDashboardOverview,
} = require("../controllers/dashboardController");

console.log("Dashboard protect:", typeof protect);
console.log("Dashboard controller:", typeof getDashboardOverview);

router.get("/overview", protect, getDashboardOverview);

module.exports = router;