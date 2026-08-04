const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  generateRoadmapController,
  getRoadmapController,
  updateRoadmapPhaseController,
} = require("../controllers/roadmapController");

console.log("================================");
console.log("ROADMAP ROUTES LOADED");
console.log("generate:", typeof generateRoadmapController);
console.log("get:", typeof getRoadmapController);
console.log("update:", typeof updateRoadmapPhaseController);
console.log("================================");

// TEST ROUTE
router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Roadmap route is working",
  });
});

// GET latest roadmap
router.get(
  "/latest",
  protect,
  getRoadmapController
);

// Generate roadmap
router.post(
  "/generate",
  protect,
  generateRoadmapController
);

// Update roadmap phase
router.put(
  "/phase/:phaseIndex",
  protect,
  updateRoadmapPhaseController
);

module.exports = router;