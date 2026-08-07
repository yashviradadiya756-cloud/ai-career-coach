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

    let roadmapProgress = 0;

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
    // INTERVIEWS
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


    let interviewAverage = 0;

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
    // LEARNING
    // ==========================================

    const latestLearning = await Learning.findOne({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    let learningProgress = 0;

    if (
      latestLearning &&
      Array.isArray(
        latestLearning.recommendations
      ) &&
      latestLearning.recommendations.length > 0
    ) {

      /*
       * Each learning recommendation
       * contributes 10%.
       *
       * Example:
       * 5 recommendations = 50%
       * 10 recommendations = 100%
       */

      learningProgress = Math.min(
        100,
        latestLearning.recommendations.length * 10
      );
    }


    // ==========================================
    // SKILLS
    // ==========================================

    let skillsMatched = 0;
    let totalSkills = 0;

    if (latestResume) {

      if (
        Array.isArray(latestResume.skills)
      ) {
        totalSkills =
          latestResume.skills.length;
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
    // OVERALL PROGRESS
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
    // CAREER SCORE
    // ==========================================

    const careerScore = Math.round(
      (
        resumeATS +
        roadmapProgress +
        interviewAverage
      ) / 3
    );


    // ==========================================
    // DEBUG
    // ==========================================

    console.log(
      "Resume ATS:",
      resumeATS
    );

    console.log(
      "Interview:",
      interviewAverage
    );

    console.log(
      "Roadmap:",
      roadmapProgress
    );

    console.log(
      "Learning:",
      learningProgress
    );

    console.log(
      "Overall Progress:",
      overallProgress
    );

    console.log(
      "Career Score:",
      careerScore
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

        // IMPORTANT
        // This is now OVERALL progress
        progress: overallProgress,
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