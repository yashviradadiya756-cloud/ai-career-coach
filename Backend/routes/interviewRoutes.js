const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  generateInterviewController,
} = require("../controllers/interviewController");

const {
  submitInterviewController,
} = require("../controllers/submitInterviewController");

// Generate interview questions
router.post("/generate", protect, generateInterviewController);

// Submit interview answers
router.post("/submit", protect, submitInterviewController);

module.exports = router;