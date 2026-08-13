const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  generateRoadmapController,
  getRoadmapController,
  updatePhaseCompletionController,
} = require("../controllers/roadmapController");

console.log(
  "================================"
);

console.log(
  "ROADMAP ROUTES LOADED"
);

console.log(
  "generateRoadmapController:",
  typeof generateRoadmapController
);

console.log(
  "getRoadmapController:",
  typeof getRoadmapController
);

console.log(
  "updatePhaseCompletionController:",
  typeof updatePhaseCompletionController
);

console.log(
  "================================"
);

/* =====================================================
   GET SAVED ROADMAP
===================================================== */

router.get(
  "/",
  protect,
  getRoadmapController
);

/* =====================================================
   GENERATE ROADMAP
===================================================== */

router.post(
  "/generate",
  protect,
  generateRoadmapController
);

/* =====================================================
   UPDATE PHASE
===================================================== */

router.put(
  "/phase/:phaseId",
  protect,
  updatePhaseCompletionController
);

module.exports = router;