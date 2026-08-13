const User = require("../models/User");
const Resume = require("../models/Resume");

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
// ADMIN RESUMES
// ==========================================

const getAdminResumes = async (req, res) => {
  try {
    const resumes = await Resume.find()
      .populate(
        "user",
        "name username email"
      )
      .sort({
        createdAt: -1,
      });

    const formattedResumes = resumes.map(
      (resume) => ({
        _id: resume._id,

        fileName:
          resume.fileName || "Unnamed Resume",

        filePath:
          resume.filePath || "",

        atsScore:
          typeof resume.atsScore === "number"
            ? resume.atsScore
            : 0,

        strengths:
          Array.isArray(resume.strengths)
            ? resume.strengths
            : [],

        weaknesses:
          Array.isArray(resume.weaknesses)
            ? resume.weaknesses
            : [],

        missingSkills:
          Array.isArray(resume.missingSkills)
            ? resume.missingSkills
            : [],

        suggestions:
          Array.isArray(resume.suggestions)
            ? resume.suggestions
            : [],

        createdAt:
          resume.createdAt,

        user: resume.user
          ? {
              _id: resume.user._id,
              name:
                resume.user.name ||
                resume.user.username ||
                "Unknown User",
              username:
                resume.user.username || "",
              email:
                resume.user.email || "",
            }
          : null,
      })
    );

    res.status(200).json({
      success: true,
      resumes: formattedResumes,
    });
  } catch (error) {
    console.error(
      "Admin resumes error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load resumes",
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
  getAdminPayments,
  getAdminFeedback,
};