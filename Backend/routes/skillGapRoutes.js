const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  analyzeSkillGapController,
  getLatestSkillGap,
} = require("../controllers/skillGapController");

console.log("protect:", typeof protect);
console.log("analyzeSkillGapController:", typeof analyzeSkillGapController);
console.log("getLatestSkillGap:", typeof getLatestSkillGap);

router.get("/test", (req, res) => {
  res.json({ message: "OK" });
});

router.post(
  "/analyze",
  protect,
  analyzeSkillGapController
);

router.get(
  "/latest",
  protect,
  getLatestSkillGap
);

module.exports = router;