const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  analyzeSkillGapController,
  getLatestSkillGap,
} = require("../controllers/skillGapController");


console.log("SKILL GAP ROUTES");

console.log(
  "protect:",
  typeof protect
);

console.log(
  "analyzeSkillGapController:",
  typeof analyzeSkillGapController
);

console.log(
  "getLatestSkillGap:",
  typeof getLatestSkillGap
);


// TEST

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Skill Gap API is working",
  });
});


// ANALYZE

router.post(
  "/analyze",
  protect,
  analyzeSkillGapController
);


// LATEST

router.get(
  "/latest",
  protect,
  getLatestSkillGap
);


module.exports = router;