const express = require("express");
const router = express.Router();
// const protect = require("../middleware/authMiddleware");
const { getUserCourses } = require("../controllers/courseController");

// User routes (Requires login or can be public)
router.get("/", protect, getUserCourses);

module.exports = router;