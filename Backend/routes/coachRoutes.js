const express = require("express");

const router = express.Router();

// IMPORTANT: use this form because this is how your middleware
// is exported in your current project
const protect = require("../middleware/authMiddleware");

const {
  askCoachController,
  getCoachHistoryController,
  getCoachDashboardController,
} = require("../controllers/coachController");

console.log("================================");
console.log("COACH ROUTES");
console.log("protect:", typeof protect);
console.log("askCoachController:", typeof askCoachController);
console.log("getCoachHistoryController:", typeof getCoachHistoryController);
console.log("getCoachDashboardController:", typeof getCoachDashboardController);
console.log("================================");

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