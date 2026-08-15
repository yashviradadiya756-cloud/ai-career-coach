const express = require("express");

const router = express.Router();

const { getCourses } = require("../controllers/courseController");

// ==========================================
// USER COURSES
// GET /api/courses
// ==========================================

router.get("/", getCourses);

module.exports = router;