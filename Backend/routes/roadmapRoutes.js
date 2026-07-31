const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  generateRoadmapController,
  getRoadmapController,
} = require("../controllers/roadmapController");

router.post("/generate", protect, generateRoadmapController);

router.get("/", protect, getRoadmapController);

module.exports = router;