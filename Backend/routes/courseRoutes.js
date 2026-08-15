const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { getUserCourses } = require("../controllers/courseController");

// ==========================================
// USER COURSES
// GET /api/courses
// ==========================================
router.get("/", protect, getUserCourses);

module.exports = router;