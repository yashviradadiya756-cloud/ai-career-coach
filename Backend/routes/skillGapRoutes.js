const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  analyzeSkillGapController,
  getLatestSkillGap,
} = require("../controllers/skillGapController");

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