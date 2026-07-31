const SkillGap = require("../models/SkillGap");
const Learning = require("../models/Learning");

const generateLearningRecommendations = require("../utils/geminiLearning");

const generateLearningController = async (req, res) => {
  try {
    const { targetRole } = req.body;

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message: "Target Role is required",
      });
    }

    // Get latest Skill Gap
    const skillGap = await SkillGap.findOne({
      user: req.user._id,
      targetRole,
    }).sort({ createdAt: -1 });

    if (!skillGap) {
      return res.status(404).json({
        success: false,
        message: "Please complete Skill Gap Analysis first.",
      });
    }

    // Generate AI Learning Recommendations
    console.log("Missing Skills:");
    console.log(skillGap.missingSkills);
    console.log("Type:", typeof skillGap.missingSkills);
    console.log("Is Array:", Array.isArray(skillGap.missingSkills));

    const learningData = await generateLearningRecommendations(
      skillGap.missingSkills,
      targetRole
    );

    // Save in MongoDB
    const learning = await Learning.create({
      user: req.user._id,
      skillGap: skillGap._id,
      targetRole,
      recommendations: learningData.recommendations,
    });

    res.status(201).json({
      success: true,
      message: "Learning Recommendations Generated Successfully",
      learning,
    });

  } catch (error) {
    console.log("Learning Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get latest learning recommendations
const getLearningController = async (req, res) => {
  try {
    const learning = await Learning.findOne({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("skillGap");

    if (!learning) {
      return res.status(404).json({
        success: false,
        message: "No learning recommendations found.",
      });
    }

    res.status(200).json({
      success: true,
      learning,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  generateLearningController,
  getLearningController,
};