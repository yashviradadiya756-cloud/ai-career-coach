const SkillGap = require("../models/SkillGap");
const Learning = require("../models/Learning");

const generateLearningRecommendations = require("../utils/geminiLearning");

// ==========================================
// GENERATE LEARNING RECOMMENDATIONS
// ==========================================

const generateLearningController = async (req, res) => {
  try {
    console.log("=================================");
    console.log("LEARNING GENERATION");
    console.log("USER:", req.user._id);
    console.log("BODY:", req.body);
    console.log("=================================");

    const skillGap = await SkillGap.findOne({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    if (!skillGap) {
      return res.status(404).json({
        success: false,
        message:
          "Please complete Skill Gap Analysis first.",
      });
    }

    const targetRole = skillGap.targetRole;

    console.log("Target Role:", targetRole);
    console.log(
      "Missing Skills:",
      skillGap.missingSkills
    );

    if (
      !Array.isArray(skillGap.missingSkills) ||
      skillGap.missingSkills.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No missing skills found in Skill Gap Analysis.",
      });
    }

    // Generate recommendations using Gemini
    const learningData =
      await generateLearningRecommendations(
        skillGap.missingSkills,
        targetRole
      );

    if (
      !learningData ||
      !Array.isArray(
        learningData.recommendations
      )
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Invalid learning recommendations generated.",
      });
    }

    // Save to MongoDB
    const learning = await Learning.create({
      user: req.user._id,
      skillGap: skillGap._id,
      targetRole,
      recommendations:
        learningData.recommendations,
    });

    console.log(
      "Learning saved:",
      learning._id
    );

    return res.status(201).json({
      success: true,
      message:
        "Learning Recommendations Generated Successfully",
      learning,
    });
  } catch (error) {
    console.error(
      "LEARNING GENERATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate learning recommendations.",
    });
  }
};

// ==========================================
// GET LATEST LEARNING
// ==========================================

const getLearningController = async (req, res) => {
  try {
    console.log(
      "GET LEARNING FOR USER:",
      req.user._id
    );

    const learning = await Learning.findOne({
      user: req.user._id,
    })
      .sort({
        createdAt: -1,
      })
      .populate("skillGap");

    // New user has no learning record yet
    if (!learning) {
      return res.status(200).json({
        success: true,
        learning: null,
        message:
          "No learning recommendations found yet.",
      });
    }

    return res.status(200).json({
      success: true,
      learning,
    });
  } catch (error) {
    console.error(
      "GET LEARNING ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to get learning recommendations.",
    });
  }
};

module.exports = {
  generateLearningController,
  getLearningController,
};