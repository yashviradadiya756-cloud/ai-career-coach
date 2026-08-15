const Course = require("../models/Course");
const Learning = require("../models/Learning");

// GET ALL COURSES FOR ADMIN
const getAdminCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: courses.length, courses });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load courses" });
  }
};

// CREATE ADMIN COURSE
const createAdminCourse = async (req, res) => {
  try {
    const { title, type, category, level, provider, duration, url, description, skills } = req.body;
    if (!title || !url) {
      return res.status(400).json({ success: false, message: "Title and URL are required" });
    }

    const newCourse = await Course.create({
      title: title.trim(),
      type: type || "Video Course",
      category: category ? category.trim() : "Development",
      level: level || "Beginner",
      provider: provider ? provider.trim() : "Online Resource",
      duration: duration ? duration.trim() : "Self-Paced",
      url: url.trim(),
      description: description ? description.trim() : "",
      skills: Array.isArray(skills) ? skills : [],
      isPublished: true,
      addedBy: req.user?._id,
    });

    return res.status(201).json({ success: true, message: "Course published successfully", course: newCourse });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create course" });
  }
};

// UPDATE ADMIN COURSE
const updateAdminCourse = async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Course not found" });
    return res.status(200).json({ success: true, message: "Course updated successfully", course: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update course" });
  }
};

// DELETE ADMIN COURSE
const deleteAdminCourse = async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Course not found" });
    return res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete course" });
  }
};

// GET USER GENERATED LEARNINGS
const getAdminUserLearnings = async (req, res) => {
  try {
    const learnings = await Learning.find()
      .populate("user", "name username email")
      .populate("skillGap")
      .sort({ createdAt: -1 });

    const formatted = learnings.map((item) => {
      const userName = item.user?.name || item.user?.username || "Unknown User";
      const initials = userName
        .split(" ")
        .map((w) => w.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();

      return {
        _id: item._id,
        user: userName,
        email: item.user?.email || "No email",
        initials,
        targetRole: item.targetRole || item.skillGap?.targetRole || "General IT",
        missingSkills: Array.isArray(item.skillGap?.missingSkills) ? item.skillGap.missingSkills : [],
        recommendations: Array.isArray(item.recommendations) ? item.recommendations : [],
        totalRecommendations: Array.isArray(item.recommendations) ? item.recommendations.length : 0,
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent",
      };
    });

    return res.status(200).json({ success: true, count: formatted.length, learnings: formatted });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load user learnings" });
  }
};

module.exports = {
  getAdminCourses,
  createAdminCourse,
  updateAdminCourse,
  deleteAdminCourse,
  getAdminUserLearnings,
};