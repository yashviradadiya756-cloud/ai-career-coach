const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware"); 
const {
  generateLearningController,
  getLearningController,
} = require("../controllers/learningController");

// Generate AI Learning Recommendations
router.post("/generate", protect, generateLearningController);

// Get Latest Learning Recommendations
router.get("/", protect, getLearningController);

module.exports = router;