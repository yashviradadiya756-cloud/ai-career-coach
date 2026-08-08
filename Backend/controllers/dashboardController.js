const User = require("../models/User");
const Resume = require("../models/Resume");
const Roadmap = require("../models/Roadmap");
const Interview = require("../models/Interview");
const Learning = require("../models/Learning");

const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user._id;

    console.log("=================================");
    console.log("DASHBOARD OVERVIEW");
    console.log("USER ID:", userId);
    console.log("=================================");

    // ==========================================
    // 1. USER
    // ==========================================

    const user = await User.findById(userId).select(
      "name username email"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ==========================================
    // 2. DEFAULT VALUES
    // IMPORTANT FOR NEW USERS
    // ==========================================

    let resumeATS = 0;
    let roadmapProgress = 0;
    let interviewAverage = 0;
    let learningProgress = 0;
    let skillsMatched = 0;
    let totalSkills = 0;

    // ==========================================
    // 3. LATEST RESUME
    // ==========================================

    const latestResume = await Resume.findOne({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    if (latestResume) {
      resumeATS = Number(latestResume.atsScore) || 0;

      if (Array.isArray(latestResume.skills)) {
        totalSkills = latestResume.skills.length;
      }

      if (
        Array.isArray(
          latestResume.matchedSkills
        )
      ) {
        skillsMatched =
          latestResume.matchedSkills.length;
      }
    }

    // ==========================================
    // 4. ROADMAP
    // ==========================================

    const latestRoadmap = await Roadmap.findOne({
      user: userId,
    }).sort({
      createdAt: -1,
    });

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
    }

    // ==========================================
    // 5. INTERVIEWS
    // ==========================================

    const interviews = await Interview.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    const interviewScores = [];

    interviews.forEach((interview) => {
      if (
        Array.isArray(interview.questions) &&
        interview.questions.length > 0
      ) {
        const scores = interview.questions
          .map((question) =>
            Number(question.score)
          )
          .filter(
            (score) =>
              !Number.isNaN(score) &&
              score >= 0
          );

        if (scores.length > 0) {
          const total = scores.reduce(
            (sum, score) => sum + score,
            0
          );

          const average =
            total / scores.length;

          interviewScores.push(
            Math.min(
              100,
              Math.max(0, average)
            )
          );
        }
      }
    });

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

    // ==========================================
    // 6. LEARNING
    // ==========================================

    const latestLearning = await Learning.findOne({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    if (
      latestLearning &&
      Array.isArray(
        latestLearning.recommendations
      ) &&
      latestLearning.recommendations.length > 0
    ) {
      learningProgress = Math.min(
        100,
        latestLearning.recommendations.length * 10
      );
    }

    // ==========================================
    // 7. CAREER SCORE
    // MUST BE DECLARED BEFORE RESPONSE
    // ==========================================

    const careerScore = Math.round(
      (
        resumeATS +
        roadmapProgress +
        interviewAverage
      ) / 3
    );

    // ==========================================
    // 8. OVERALL PROGRESS
    // ==========================================

    const overallProgress = Math.round(
      (
        resumeATS +
        interviewAverage +
        roadmapProgress +
        learningProgress
      ) / 4
    );

    // ==========================================
    // 9. DEBUG
    // ==========================================

    console.log("Resume ATS:", resumeATS);
    console.log(
      "Interview Average:",
      interviewAverage
    );
    console.log(
      "Roadmap Progress:",
      roadmapProgress
    );
    console.log(
      "Learning Progress:",
      learningProgress
    );
    console.log(
      "Skills Matched:",
      skillsMatched
    );
    console.log(
      "Total Skills:",
      totalSkills
    );
    console.log(
      "Career Score:",
      careerScore
    );
    console.log(
      "Overall Progress:",
      overallProgress
    );

    // ==========================================
    // 10. RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      user: {
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
      },

      stats: {
        careerScore: careerScore || 0,

        resumeATS: resumeATS || 0,

        skillsMatched: skillsMatched || 0,

        totalSkills: totalSkills || 0,

        interviewAverage:
          interviewAverage || 0,

        progress:
          overallProgress || 0,
      },
    });

  } catch (error) {
    console.error(
      "DASHBOARD OVERVIEW ERROR:",
      error
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