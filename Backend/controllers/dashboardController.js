const User = require("../models/User");
const Resume = require("../models/Resume");
const Roadmap = require("../models/Roadmap");
const Interview = require("../models/Interview");
const Learning = require("../models/Learning");

// =====================================================
// GET DASHBOARD OVERVIEW
// =====================================================

const getDashboardOverview = async (req, res) => {
  try {
    // -------------------------------------------------
    // 1. CHECK AUTHENTICATED USER
    // -------------------------------------------------

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const userId = req.user._id;

    console.log("=================================");
    console.log("DASHBOARD OVERVIEW");
    console.log("USER ID:", userId);
    console.log("=================================");

    // -------------------------------------------------
    // 2. GET USER
    // -------------------------------------------------

    const user = await User.findById(userId).select(
      "name username email phone"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -------------------------------------------------
    // 3. DEFAULT VALUES
    // IMPORTANT:
    // These are declared BEFORE being used.
    // -------------------------------------------------

    let resumeATS = 0;

    let roadmapProgress = 0;

    let interviewAverage = 0;

    let learningProgress = 0;

    let skillsMatched = 0;

    let totalSkills = 0;

    // -------------------------------------------------
    // 4. RESUME
    // -------------------------------------------------

    const latestResume = await Resume.findOne({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (latestResume) {
      resumeATS = Number(latestResume.atsScore) || 0;

      resumeATS = Math.min(
        100,
        Math.max(0, resumeATS)
      );

      if (Array.isArray(latestResume.skills)) {
        totalSkills = latestResume.skills.length;
      }

      if (Array.isArray(latestResume.matchedSkills)) {
        skillsMatched =
          latestResume.matchedSkills.length;
      }
    }

    // -------------------------------------------------
    // 5. ROADMAP
    // -------------------------------------------------

    const latestRoadmap = await Roadmap.findOne({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (
      latestRoadmap &&
      Array.isArray(latestRoadmap.phases) &&
      latestRoadmap.phases.length > 0
    ) {
      const totalPhases =
        latestRoadmap.phases.length;

      const completedPhases =
        latestRoadmap.phases.filter(
          (phase) => phase.completed === true
        ).length;

      roadmapProgress = Math.round(
        (completedPhases / totalPhases) * 100
      );

      roadmapProgress = Math.min(
        100,
        Math.max(0, roadmapProgress)
      );
    }

    // -------------------------------------------------
    // 6. INTERVIEW
    // -------------------------------------------------

    const interviews = await Interview.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    const interviewScores = [];

    if (Array.isArray(interviews)) {
      interviews.forEach((interview) => {
        if (
          Array.isArray(interview.questions) &&
          interview.questions.length > 0
        ) {
          interview.questions.forEach(
            (question) => {
              const score = Number(
                question.score
              );

              if (
                !Number.isNaN(score) &&
                score >= 0
              ) {
                interviewScores.push(
                  Math.min(
                    100,
                    Math.max(0, score)
                  )
                );
              }
            }
          );
        }
      });
    }

    if (interviewScores.length > 0) {
      const total =
        interviewScores.reduce(
          (sum, score) => sum + score,
          0
        );

      interviewAverage = Math.round(
        total / interviewScores.length
      );
    }

    // -------------------------------------------------
    // 7. LEARNING
    // -------------------------------------------------

    const latestLearning = await Learning.findOne({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (
      latestLearning &&
      Array.isArray(
        latestLearning.recommendations
      )
    ) {
      learningProgress = Math.min(
        100,
        latestLearning.recommendations.length * 10
      );
    }

    // -------------------------------------------------
    // 8. CALCULATE CAREER SCORE
    // IMPORTANT:
    // Calculate AFTER all variables are initialized.
    // -------------------------------------------------

    const careerScore = Math.round(
      (
        resumeATS +
        roadmapProgress +
        interviewAverage
      ) / 3
    );

    // -------------------------------------------------
    // 9. OVERALL PROGRESS
    // -------------------------------------------------

    const overallProgress = Math.round(
      (
        resumeATS +
        roadmapProgress +
        interviewAverage +
        learningProgress
      ) / 4
    );

    // -------------------------------------------------
    // 10. DEBUG
    // -------------------------------------------------

    console.log("Dashboard values:");
    console.log("Name:", user.name);
    console.log("Username:", user.username);
    console.log("Resume ATS:", resumeATS);
    console.log("Roadmap:", roadmapProgress);
    console.log("Interview:", interviewAverage);
    console.log("Learning:", learningProgress);
    console.log("Career Score:", careerScore);
    console.log(
      "Overall Progress:",
      overallProgress
    );

    // -------------------------------------------------
    // 11. SEND RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      user: {
        _id: user._id,
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
      },

      stats: {
        careerScore: careerScore || 0,

        resumeATS: resumeATS || 0,

        skillsMatched: skillsMatched || 0,

        totalSkills: totalSkills || 0,

        interviewAverage:
          interviewAverage || 0,

        progress: overallProgress || 0,
      },
    });
  } catch (error) {
    // -------------------------------------------------
    // IMPORTANT:
    // THIS WILL SHOW THE REAL ERROR IN RENDER LOGS
    // -------------------------------------------------

    console.error(
      "================================="
    );

    console.error(
      "DASHBOARD OVERVIEW ERROR:"
    );

    console.error(error);

    console.error(
      "ERROR MESSAGE:",
      error.message
    );

    console.error(
      "ERROR STACK:",
      error.stack
    );

    console.error(
      "================================="
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to load dashboard",
    });
  }
};

module.exports = {
  getDashboardOverview,
};