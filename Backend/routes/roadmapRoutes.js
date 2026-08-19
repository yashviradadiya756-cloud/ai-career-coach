const express = require("express");

const router = express.Router();

const {
  generateRoadmapController,
  getRoadmapController,
  updatePhaseCompletionController,
} = require("../controllers/roadmapController");

const protect = require("../middleware/authMiddleware");

// ======================================================
// GET ROADMAP
// GET /api/roadmap
// ======================================================

router.get(
  "/",
  protect,
  getRoadmapController
);

// ======================================================
// GENERATE ROADMAP
// POST /api/roadmap/generate
// ======================================================

router.post(
  "/generate",
  protect,
  generateRoadmapController
);

// ======================================================
// UPDATE PHASE
// PATCH /api/roadmap/phase/:phaseId
// ======================================================

router.patch(
  "/phase/:phaseId",
  protect,
  updatePhaseCompletionController
);

module.exports = router;