const Course = require("../models/Course");

// ==========================================
// GET ALL COURSES FOR USERS
// GET /api/courses
// ==========================================
const getCourses = async (req, res) => {
  try {
    console.log("========== USER COURSES API ==========");

    const courses = await Course.find()
      .sort({ createdAt: -1 })
      .lean();

    console.log("TOTAL COURSES:", courses.length);

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Get user courses error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

module.exports = {
  getCourses,
};