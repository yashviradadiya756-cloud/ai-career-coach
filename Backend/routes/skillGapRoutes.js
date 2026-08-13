const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  analyzeSkillGapController,
  getLatestSkillGap,
} = require("../controllers/skillGapController");

console.log("================================");
console.log("SKILL GAP ROUTES LOADED");
console.log("protect:", typeof protect);
console.log(
  "analyzeSkillGapController:",
  typeof analyzeSkillGapController
);
console.log(
  "getLatestSkillGap:",
  typeof getLatestSkillGap
);
console.log("================================");

// ======================================================
// TEST
// ======================================================

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Skill Gap API is working",
  });
});

// ======================================================
// ANALYZE
// ======================================================

router.post(
  "/analyze",
  protect,
  analyzeSkillGapController
);

// ======================================================
// GET LATEST
// ======================================================

router.get(
  "/latest",
  protect,
  getLatestSkillGap
);

module.exports = router;