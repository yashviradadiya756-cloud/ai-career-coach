const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  generateLearningController,
  getLearningController,
} = require("../controllers/learningController");

// ==========================================
// GENERATE LEARNING PLAN
// POST /api/learning/generate
// ==========================================
router.post(
  "/generate",
  protect,
  generateLearningController
);

// ==========================================
// GET LATEST LEARNING PLAN
// GET /api/learning
// ==========================================
router.get(
  "/",
  protect,
  getLearningController
);

module.exports = router;