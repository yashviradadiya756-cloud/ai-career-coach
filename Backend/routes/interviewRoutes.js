const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  generateInterviewController,
} = require("../controllers/interviewController");

const {
  submitInterviewController,
} = require("../controllers/submitInterviewController");

// ==========================================
// GENERATE INTERVIEW
// ==========================================

router.post(
  "/generate",
  protect,
  generateInterviewController
);

// ==========================================
// SUBMIT INTERVIEW
// ==========================================

router.post(
  "/submit",
  protect,
  submitInterviewController
);

module.exports = router;