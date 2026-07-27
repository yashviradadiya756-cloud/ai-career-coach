const Progress = require("../models/Progress");
const Resume = require("../models/Resume");
const Interview = require("../models/Interview");
const Roadmap = require("../models/Roadmap");
const Learning = require("../models/Learning");

const updateProgressController = async (req, res) => {
  try {
    const userId = req.user._id;

    const resume = await Resume.findOne({ user: userId }).sort({ createdAt: -1 });
    const interview = await Interview.findOne({ user: userId }).sort({ createdAt: -1 });
    const roadmap = await Roadmap.findOne({ user: userId }).sort({ createdAt: -1 });
    const learning = await Learning.findOne({ user: userId }).sort({ createdAt: -1 });

    const resumeScore = resume?.atsScore || 0;
    const interviewScore = interview?.totalScore || 0;

    const roadmapCompleted = roadmap
      ? Math.min(100, roadmap.phases.length * 20)
      : 0;

    const learningCompleted = learning
      ? Math.min(100, learning.recommendations.length * 10)
      : 0;

    const overallProgress = Math.round(
      (resumeScore +
        interviewScore +
        roadmapCompleted +
        learningCompleted) / 4
    );

    const progress = await Progress.findOneAndUpdate(
      { user: userId },
      {
        resumeScore,
        interviewScore,
        roadmapCompleted,
        learningCompleted,
        overallProgress,
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Progress Updated Successfully",
      progress,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProgressController = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user._id,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "No progress found.",
      });
    }

    res.status(200).json({
      success: true,
      progress,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  updateProgressController,
  getProgressController,
};