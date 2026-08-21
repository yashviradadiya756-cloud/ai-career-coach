const express = require("express");

const router = express.Router();

const {
  analyzeSkillGap,
  getLatestSkillGap,
} = require("../controllers/skillGapController");

const authMiddleware = require("../middleware/authMiddleware");

const protect = require("../middleware/authMiddleware");

router.post(
  "/analyze",
  protect,
  analyzeSkillGap
);

router.get(
  "/latest",
  protect,
  getLatestSkillGap
);

module.exports = router;