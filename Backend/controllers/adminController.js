const User = require("../models/User");
const Resume = require("../models/Resume");
const Roadmap = require("../models/Roadmap");
const Interview = require("../models/Interview");
const Course = require("../models/Course");
const Learning = require("../models/Learning");

// ==========================================
// ADMIN DASHBOARD
// ==========================================

const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({
      role: "user",
    });

    const totalAdmins = await User.countDocuments({
      role: "admin",
    });

    res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        totalAdmins,
      },
    });

  } catch (error) {

    console.error(
      "Admin dashboard error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard",
    });
  }
};


// ==========================================
// GET USERS
// ==========================================

const getAdminUsers = async (req, res) => {
  try {

    const users = await User.find()
      .select("-password")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {

    console.error(
      "Admin users error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load users",
    });
  }
};


// ==========================================
// DELETE USER
// ==========================================

const deleteAdminUser = async (req, res) => {
  try {

    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin account cannot be deleted",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {

    console.error(
      "Delete user error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};


// ==========================================
// GET ALL RESUMES FOR ADMIN
// ==========================================

const getAdminResumes = async (req, res) => {
  try {
    console.log(
      "========== ADMIN RESUMES =========="
    );

    const resumes = await Resume.find()
      .populate(
        "user",
        "name username email"
      )
      .sort({
        createdAt: -1,
      });

    console.log(
      "TOTAL RESUMES:",
      resumes.length
    );

    const formattedResumes =
      resumes.map((resume) => {
        const userName =
          resume.user?.name ||
          resume.user?.username ||
          "Unknown User";

        const initials = userName
          .split(" ")
          .map((word) =>
            word.charAt(0)
          )
          .join("")
          .substring(0, 2)
          .toUpperCase();

        return {
          _id: resume._id,

          fileName:
            resume.fileName,

          filePath:
            resume.filePath,

          user: userName,

          email:
            resume.user?.email ||
            "No email",

          initials,

          date: resume.createdAt
            ? new Date(
                resume.createdAt
              ).toLocaleDateString()
            : "Unknown date",

          atsScore:
            resume.atsScore || 0,

          strengths:
            Array.isArray(
              resume.strengths
            )
              ? resume.strengths
              : [],

          weaknesses:
            Array.isArray(
              resume.weaknesses
            )
              ? resume.weaknesses
              : [],

          missingSkills:
            Array.isArray(
              resume.missingSkills
            )
              ? resume.missingSkills
              : [],

          suggestions:
            Array.isArray(
              resume.suggestions
            )
              ? resume.suggestions
              : [],

          resumeText:
            resume.resumeText || "",
        };
      });

    return res.status(200).json({
      success: true,

      total: formattedResumes.length,

      resumes: formattedResumes,
    });

  } catch (error) {
    console.error(
      "ADMIN RESUMES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load resumes",
    });
  }
};

// ==========================================
// ROADMAPS
// ==========================================

const getAdminRoadmaps = async (req, res) => {
  try {
    console.log("========== ADMIN ROADMAPS ==========");

    /*
     * IMPORTANT:
     * Change this import/model name only if your actual
     * roadmap model has a different filename.
     */
    
    const Roadmap = require("../models/Roadmap");

    const roadmaps = await Roadmap.find()
      .populate(
        "user",
        "name username email"
      )
      .sort({
        createdAt: -1,
      });

    console.log(
      "TOTAL ROADMAPS:",
      roadmaps.length
    );

    const formattedRoadmaps = roadmaps.map((roadmap) => {
      const userName =
        roadmap.user?.name ||
        roadmap.user?.username ||
        "Unknown User";

      const initials = userName
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();

      return {
        _id: roadmap._id,

        user: userName,

        email:
          roadmap.user?.email ||
          "No email",

        initials,

        date: roadmap.createdAt
          ? new Date(
              roadmap.createdAt
            ).toLocaleDateString()
          : "Unknown date",

        ...roadmap.toObject(),
      };
    });

    return res.status(200).json({
      success: true,

      total: formattedRoadmaps.length,

      roadmaps: formattedRoadmaps,
    });

  } catch (error) {
    console.error(
      "ADMIN ROADMAPS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to load roadmaps",

      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// ==========================================
// GET ALL SKILL GAP ANALYSES FOR ADMIN
// ==========================================

const getAdminSkillGaps = async (req, res) => {
  try {
    console.log("========== ADMIN SKILL GAP ==========");

    const SkillGap = require("../models/SkillGap");

    const skillGaps = await SkillGap.find()
      .populate(
        "user",
        "name username email"
      )
      .sort({
        createdAt: -1,
      });

    console.log(
      "TOTAL SKILL GAP ANALYSES:",
      skillGaps.length
    );

    const formattedSkillGaps = skillGaps.map(
      (skillGap) => {

        const userName =
          skillGap.user?.name ||
          skillGap.user?.username ||
          "Unknown User";

        const initials = userName
          .split(" ")
          .map((word) => word.charAt(0))
          .join("")
          .substring(0, 2)
          .toUpperCase();

        // Convert mongoose document to plain object
        const skillGapData =
          skillGap.toObject();

        return {
          // First spread the original data
          ...skillGapData,

          // Then OVERRIDE these fields
          // so React gets strings instead of objects
          _id: skillGap._id,

          user: userName,

          email:
            skillGap.user?.email ||
            "No email",

          initials,

          date: skillGap.createdAt
            ? new Date(
                skillGap.createdAt
              ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "Unknown date",
        };
      }
    );

    console.log(
      "FORMATTED SKILL GAPS:",
      formattedSkillGaps.length
    );

    return res.status(200).json({
      success: true,

      total:
        formattedSkillGaps.length,

      skillGaps:
        formattedSkillGaps,
    });

  } catch (error) {

    console.error(
      "ADMIN SKILL GAP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to load skill gap analyses",

      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};


// ==========================================
// GET ALL INTERVIEWS FOR ADMIN
// ==========================================

const getAdminInterviews = async (req, res) => {
  try {
    console.log("=================================");
    console.log("ADMIN INTERVIEW API");
    console.log("Admin:", req.user?._id);
    console.log("=================================");

    const interviews = await Interview.find({})
      .populate(
        "user",
        "name username email"
      )
      .sort({
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });

  } catch (error) {
    console.error(
      "ADMIN INTERVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to load interviews",
    });
  }
};

// ==========================================
// ADMIN: GET ALL COURSES
// GET /api/admin/courses
// ==========================================
const getAdminCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Get admin courses error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};
// ==========================================
// ADMIN: CREATE COURSE
// POST /api/admin/courses
// ==========================================
const createAdminCourse = async (req, res) => {
  try {
    const {
      title,
      type,
      category,
      level,
      provider,
      duration,
      url,
      description,
      skills,
    } = req.body;
    if (!title || !url) {
      return res.status(400).json({
        success: false,
        message: "Course title and URL are required",
      });
    }
    const newCourse = await Course.create({
      title: title.trim(),
      type: type || "Video Course",
      category: category ? category.trim() : "Web Development",
      level: level || "Beginner",
      provider: provider ? provider.trim() : "Online",
      duration: duration ? duration.trim() : "Self-Paced",
      url: url.trim(),
      description: description ? description.trim() : "",
      skills: Array.isArray(skills) ? skills : [],
      addedBy: req.user?._id,
    });
    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("Create course error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};
// ==========================================
// ADMIN: UPDATE COURSE
// PUT /api/admin/courses/:id
// ==========================================
const updateAdminCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Course.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updated,
    });
  } catch (error) {
    console.error("Update course error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
    });
  }
};
// ==========================================
// ADMIN: DELETE COURSE
// DELETE /api/admin/courses/:id
// ==========================================
const deleteAdminCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Course.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};
// ==========================================
// ADMIN: GET USER LEARNING PLANS & INSIGHTS
// GET /api/admin/user-learnings
// ==========================================
const getAdminUserLearnings = async (req, res) => {
  try {
    const learnings = await LearningProgress.find()
      .populate("user", "name username email")
      .populate("course")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      learnings,
    });
  } catch (error) {
    console.error("Get user learnings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user learnings",
    });
  }
};

// ==========================================
// PAYMENTS
// ==========================================

const getAdminPayments = async (req, res) => {
  try {

    res.status(200).json({
      success: true,
      payments: [],
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to load payments",
    });
  }
};


// ==========================================
// FEEDBACK
// ==========================================

const getAdminFeedback = async (req, res) => {
  try {

    res.status(200).json({
      success: true,
      feedback: [],
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to load feedback",
    });
  }
};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  getAdminDashboard,
  getAdminUsers,
  deleteAdminUser,
  getAdminResumes,
  getAdminRoadmaps,
  getAdminSkillGaps,
  getAdminInterviews,
  getAdminCourses,
  createAdminCourse,
  updateAdminCourse,
  deleteAdminCourse,
  getAdminUserLearnings,
  getAdminPayments,
  getAdminFeedback,
};