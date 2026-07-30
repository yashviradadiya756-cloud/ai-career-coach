const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware"); 

const {
  updateAchievementsController,
  getAchievementsController,
} = require("../controllers/achievementController");

router.post("/update", protect, updateAchievementsController);

router.get("/", protect, getAchievementsController);

module.exports = router;