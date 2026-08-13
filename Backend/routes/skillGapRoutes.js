const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  analyzeSkillGapController,
  getLatestSkillGap,
} = require("../controllers/skillGapController");

// ==========================================
// TEST
// ==========================================

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Skill Gap API is working",
  });
});

// ==========================================
// ANALYZE
// ==========================================

router.post(
  "/analyze",
  protect,
  analyzeSkillGapController
);

// ==========================================
// LATEST
// ==========================================

router.get(
  "/latest",
  protect,
  getLatestSkillGap
);

module.exports = router;