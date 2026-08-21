const express = require("express");

const router = express.Router();

const {
  analyzeSkillGap,
  getLatestSkillGap,
} = require(
  "../controllers/skillGapController"
);

const protect = require(
  "../middleware/authMiddleware"
);

// =====================================================
// POST - ANALYZE SKILL GAP
// =====================================================

router.post(
  "/analyze",
  protect,
  analyzeSkillGap
);

// =====================================================
// GET - LATEST SKILL GAP
// =====================================================

router.get(
  "/latest",
  protect,
  getLatestSkillGap
);

module.exports = router;