const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  askCoachController,
  getCoachHistoryController,
  getCoachDashboardController,
} = require("../controllers/coachController");

router.post(
  "/ask",
  protect,
  askCoachController
);

router.get(
  "/history",
  protect,
  getCoachHistoryController
);

router.get(
  "/dashboard",
  protect,
  getCoachDashboardController
);

module.exports = router;