const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  generateRoadmapController,
} = require("../controllers/roadmapController");

// Generate AI Career Roadmap
router.post("/generate", protect, generateRoadmapController);

module.exports = router;