const CoachChat = require("../models/CoachChat");
const SkillGap = require("../models/SkillGap");
const Resume = require("../models/Resume");
const Roadmap = require("../models/Roadmap");
const Interview = require("../models/Interview");

const getCoachDashboardController = async (req, res) => {
  try {

    const userId = req.user._id;

    // =========================
    // SKILL GAP
    // =========================

    const skillGap = await SkillGap.findOne({
      user: userId,
    }).sort({ createdAt: -1 });


    // =========================
    // RESUME
    // =========================

    const resume = await Resume.findOne({
      user: userId,
    }).sort({ createdAt: -1 });


    // =========================
    // ROADMAP
    // =========================

    const roadmap = await Roadmap.findOne({
      user: userId,
    }).sort({ createdAt: -1 });


    // =========================
    // INTERVIEW
    // =========================

    const interview = await Interview.findOne({
      user: userId,
    }).sort({ createdAt: -1 });


    // =========================
    // CALCULATE SCORES
    // =========================

    const careerScore =
      skillGap?.readinessScore || 0;


    const resumeScore =
      resume?.atsScore || 0;


    let roadmapProgress = 0;

    if (roadmap?.phases?.length) {

      const completedPhases =
        roadmap.phases.filter(
          (phase) => phase.completed === true
        ).length;

      roadmapProgress = Math.round(
        (completedPhases / roadmap.phases.length) * 100
      );

    }


    const interviewScore =
      interview?.totalScore || 0;


    res.status(200).json({

      success: true,

      scores: {

        careerScore,

        roadmapProgress,

        resumeScore,

        interviewScore,

      },

    });

  } catch (error) {

    console.log(
      "Coach Dashboard Error:",
      error
    );

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }
};

module.exports = {
  askCoachController,
  getCoachHistoryController,
  getCoachDashboardController,
};