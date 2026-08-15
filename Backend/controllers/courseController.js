const Course = require("../models/Course");

const getUserCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      isPublished: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Get user courses error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load courses",
    });
  }
};

module.exports = {
  getUserCourses,
};