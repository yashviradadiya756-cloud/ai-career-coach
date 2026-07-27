const Achievement = require("../models/Achievement");
const Resume = require("../models/Resume");
const SkillGap = require("../models/SkillGap");
const Roadmap = require("../models/Roadmap");
const Interview = require("../models/Interview");
const Learning = require("../models/Learning");

const updateAchievementsController = async (req, res) => {
  try {
    const userId = req.user._id;

    const badges = [];

    const resume = await Resume.findOne({ user: userId });
    if (resume) {
      badges.push({
        title: "Resume Uploaded",
        description: "Uploaded your first resume",
        icon: "📄",
      });
    }

    const skillGap = await SkillGap.findOne({ user: userId });
    if (skillGap) {
      badges.push({
        title: "Skill Explorer",
        description: "Completed Skill Gap Analysis",
        icon: "🧠",
      });
    }

    const roadmap = await Roadmap.findOne({ user: userId });
    if (roadmap) {
      badges.push({
        title: "Career Planner",
        description: "Generated Career Roadmap",
        icon: "🗺️",
      });
    }

    const interview = await Interview.findOne({ user: userId });
    if (interview) {
      badges.push({
        title: "Interview Ready",
        description: "Completed AI Mock Interview",
        icon: "🎤",
      });
    }

    const learning = await Learning.findOne({ user: userId });
    if (learning) {
      badges.push({
        title: "Lifelong Learner",
        description: "Generated Learning Recommendations",
        icon: "📚",
      });
    }

    const achievement = await Achievement.findOneAndUpdate(
      { user: userId },
      { badges },
      {
        new: true,
        upsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Achievements Updated Successfully",
      achievement,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAchievementsController = async (req, res) => {
  try {
    const achievement = await Achievement.findOne({
      user: req.user._id,
    });

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "No achievements found.",
      });
    }

    res.status(200).json({
      success: true,
      achievement,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  updateAchievementsController,
  getAchievementsController,
};