const express = require("express");

const router = express.Router();

const {
  generateRoadmapController,
  getRoadmapController,
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


module.exports = router;