const Course = require("../models/Course");

const getUserCourses = async (req, res) => {
  try {
    // Fetch all published courses from MongoDB
    const courses = await Course.find({ isPublished: { $ne: false } }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Get courses error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

module.exports = { getUserCourses };