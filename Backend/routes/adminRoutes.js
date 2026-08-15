const express = require("express");

const router = express.Router();

// ==========================================
// MIDDLEWARE
// ==========================================
const protect = require("../middleware/authMiddleware");

// ==========================================
// CONTROLLER
// ==========================================
const {
  getUserCourses,
} = require("../controllers/courseController");

// ==========================================
// USER COURSES
// ==========================================

// GET /api/courses
router.get("/", protect, getUserCourses);

module.exports = router;