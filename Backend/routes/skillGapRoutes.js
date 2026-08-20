const express = require("express");

const router = express.Router();

const {
  analyzeSkillGap,
  getLatestSkillGap,
} = require("../controllers/skillGapController");

const {
  protect,
} = require("../middleware/authMiddleware");

// =====================================================
// DEBUG
// =====================================================

console.log("=================================");
console.log("SKILL GAP ROUTES");

console.log(
  "protect:",
  typeof protect
);

console.log(
  "analyzeSkillGap:",
  typeof analyzeSkillGap
);

console.log(
  "getLatestSkillGap:",
  typeof getLatestSkillGap
);

console.log("=================================");

// =====================================================
// GET LATEST SKILL GAP
// =====================================================

router.get(
  "/latest",
  protect,
  getLatestSkillGap
);

// =====================================================
// ANALYZE SKILL GAP
// =====================================================

router.post(
  "/analyze",
  protect,
  analyzeSkillGap
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;