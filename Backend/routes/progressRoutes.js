const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  updateProgressController,
  getProgressController,
} = require("../controllers/progressController");

// Update Progress
router.post("/update", protect, updateProgressController);

// Get Progress
router.get("/", protect, getProgressController);

module.exports = router;