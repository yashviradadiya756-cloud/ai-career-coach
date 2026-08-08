const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  generateLearningController,
  getLearningController,
} = require("../controllers/learningController");

// ======================================================
// GET latest learning plan
// GET /api/learning
// ======================================================

router.get(
  "/",
  protect,
  getLearningController
);

// ======================================================
// Generate learning plan
// POST /api/learning/generate
// ======================================================

router.post(
  "/generate",
  protect,
  generateLearningController
);

module.exports = router;