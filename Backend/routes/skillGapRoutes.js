const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  analyzeSkillGap,
  getLatestSkillGap,
} = require("../controllers/skillGapController");

console.log("=================================");
console.log("SKILL GAP ROUTES");
console.log("=================================");

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