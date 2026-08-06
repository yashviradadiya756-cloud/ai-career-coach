const express = require("express");

const router = express.Router();

const {
  generateRoadmapController,
  getRoadmapController,
  updatePhaseCompletionController,
} = require("../controllers/roadmapController");

const protect = require("../middleware/authMiddleware");

console.log("✅ roadmapRoutes.js loaded");


// GET SAVED ROADMAP
router.get(
  "/",
  protect,
  getRoadmapController
);


// GENERATE + SAVE ROADMAP
router.post(
  "/generate",
  protect,
  generateRoadmapController
);

router.put(
  "/phase/:phaseId",
  protect,
  updatePhaseCompletionController
);

module.exports = router;