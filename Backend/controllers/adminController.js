const User = require("../models/User");
const Resume = require("../models/Resume");
const Roadmap = require("../models/Roadmap");

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
  getAdminPayments,
  getAdminFeedback,
};