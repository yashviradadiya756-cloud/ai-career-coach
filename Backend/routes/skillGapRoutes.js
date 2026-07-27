const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const controller = require("../controllers/skillGapController");


console.log("Controller Export:", controller);
console.log("Type:", typeof controller.analyzeSkillGapController);

router.get("/test", (req, res) => {
  res.json({ message: "OK" });
});

router.post(
  "/analyze",
  protect,
  controller.analyzeSkillGapController
);

module.exports = router;