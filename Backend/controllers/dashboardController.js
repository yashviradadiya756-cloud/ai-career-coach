const User = require("../models/User");
const Resume = require("../models/Resume");
const Roadmap = require("../models/Roadmap");
const Interview = require("../models/Interview");

const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user._id;

    console.log("=================================");
    console.log("DASHBOARD OVERVIEW");
    console.log("USER ID:", userId);
    console.log("=================================");

    // ==========================================
    // USER
    // ==========================================

    const user = await User.findById(userId).select(
      "name email"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ==========================================
    // LATEST RESUME
    // ==========================================

    const latestResume = await Resume.findOne({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    const resumeATS = latestResume
      ? Number(latestResume.atsScore) || 0
      : 0;

    // ==========================================
    // ROADMAP
    // ==========================================

    const latestRoadmap = await Roadmap.findOne({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    let progress = 0;

    if (
      latestRoadmap &&
      Array.isArray(latestRoadmap.phases) &&
      latestRoadmap.phases.length > 0
    ) {
      const totalPhases = latestRoadmap.phases.length;

      const completedPhases =
        latestRoadmap.phases.filter(
          (phase) => phase.completed === true
        ).length;

      progress = Math.round(
        (completedPhases / totalPhases) * 100
      );
    }

    // ==========================================
    // INTERVIEWS
    // ==========================================

    const interviews = await Interview.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    const interviewScores = [];

    interviews.forEach((interview) => {
      /*
       * Your Interview model stores:
       *
       * questions[].score
       * totalScore
       */

      if (
        Array.isArray(interview.questions) &&
        interview.questions.length > 0
      ) {
        const scores = interview.questions
          .map((question) => Number(question.score))
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

          /*
           * Assuming each question score is out of 100.
           */
          const average =
            total / scores.length;

          interviewScores.push(
            Math.min(100, Math.max(0, average))
          );
        }
      }
    });

    let interviewAverage = 0;

    if (interviewScores.length > 0) {
      const total = interviewScores.reduce(
        (sum, score) => sum + score,
        0
      );

      interviewAverage = Math.round(
        total / interviewScores.length
      );
    }

    // ==========================================
    // SKILLS
    // ==========================================

    let skillsMatched = 0;
    let totalSkills = 0;

    if (latestResume) {
      /*
       * If your Resume model contains these fields,
       * use them.
       */

      if (Array.isArray(latestResume.skills)) {
        totalSkills = latestResume.skills.length;
      }

      if (
        Array.isArray(latestResume.matchedSkills)
      ) {
        skillsMatched =
          latestResume.matchedSkills.length;
      }
    }

    // ==========================================
    // CAREER SCORE
    // ==========================================

    const careerScore = Math.round(
      (
        resumeATS +
        progress +
        interviewAverage
      ) / 3
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      user: {
        name: user.name,
        email: user.email,
      },

      stats: {
        careerScore,
        resumeATS,
        skillsMatched,
        totalSkills,
        interviewAverage,
        progress,
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