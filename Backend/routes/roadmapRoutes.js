const express = require("express");

const router = express.Router();

const {
  generateRoadmap,
  getRoadmap,
  updatePhaseCompletion,
} = require("../controllers/roadmapController");

const protect = require("../middleware/authMiddleware");

// ======================================================
// GET ROADMAP
// GET /api/roadmap
// ======================================================

router.get(
  "/",
  protect,
  getRoadmap
);

// ======================================================
// GENERATE ROADMAP
// POST /api/roadmap/generate
// ======================================================

router.post(
  "/generate",
  protect,
  generateRoadmap
);

// ======================================================
// UPDATE PHASE
// PATCH /api/roadmap/phase/:phaseId
// ======================================================

router.patch(
  "/phase/:phaseId",
  protect,
  updatePhaseCompletion
);

module.exports = router;