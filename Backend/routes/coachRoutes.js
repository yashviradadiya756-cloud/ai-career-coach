const express = require("express");

const router = express.Router();

const {
  askCoachController,
  getCoachHistory,
  getCoachDashboard,
} = require("../controllers/coachController");

const protect = require("../middleware/authMiddleware");


// Ask AI Coach
router.post(
  "/ask",
  protect,
  askCoachController
);


// Chat History
router.get(
  "/history",
  protect,
  getCoachHistory
);


// Dashboard Scores
router.get(
  "/dashboard",
  protect,
  getCoachDashboard
);


module.exports = router;