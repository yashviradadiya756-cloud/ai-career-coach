const Course = require("../models/Course");

// ==========================================
// GET COURSES FOR USERS (Dashboard / Learning)
// GET /api/courses
// ==========================================
const getUserCourses = async (req, res) => {
  try {
    const { category, search, level } = req.query;

    const filter = { isPublished: true };

    if (category && category !== "All") {
      filter.category = new RegExp(`^${category}$`, "i");
    }

    if (level && level !== "All") {
      filter.level = level;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const courses = await Course.find(filter).sort({ createdAt: -1 });

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
    });
  }
};

module.exports = { getUserCourses };