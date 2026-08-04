const express = require("express");
const router = express.Router();

const {
  generateRoadmapController,
  getRoadmapController,
} = require("../controllers/roadmapController");

const protect = require("../middleware/authMiddleware");

console.log("✅ roadmapRoutes.js loaded");

router.get("/", protect, (req, res, next) => {
  console.log("🔥 GET /api/roadmap reached");
  next();
}, getRoadmapController);

router.post("/generate", protect, (req, res, next) => {
  console.log("🔥 POST /api/roadmap/generate reached");
  console.log("BODY:", req.body);
  console.log("USER:", req.user?._id);
  next();
}, generateRoadmapController);

module.exports = router;