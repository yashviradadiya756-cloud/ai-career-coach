const SkillGap = require("../models/SkillGap");
const Learning = require("../models/Learning");

const generateLearningRecommendations = require("../utils/geminiLearning");

// ======================================================
// GENERATE LEARNING RECOMMENDATIONS
// ======================================================

const generateLearningController = async (req, res) => {
  try {
    console.log("================================");
    console.log("🔥 LEARNING GENERATION STARTED");
    console.log("USER:", req.user._id);
    console.log("BODY:", req.body);
    console.log("================================");

    // --------------------------------------------------
    // Find latest Skill Gap
    // --------------------------------------------------

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

    console.log("Skill Gap found:", skillGap._id);
    console.log("Target Role:", skillGap.targetRole);
    console.log("Missing Skills:", skillGap.missingSkills);

    // --------------------------------------------------
    // Validate target role
    // --------------------------------------------------

    const targetRole =
      skillGap.targetRole?.trim();

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message:
          "Target role is missing from Skill Gap Analysis.",
      });
    }

    // --------------------------------------------------
    // Validate missing skills
    // --------------------------------------------------

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

    // --------------------------------------------------
    // Generate AI recommendations
    // --------------------------------------------------

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

    console.log(
      "Generated recommendations:",
      learningData.recommendations.length
    );

    // --------------------------------------------------
    // Delete previous learning plan
    // --------------------------------------------------

    await Learning.deleteMany({
      user: req.user._id,
    });

    // --------------------------------------------------
    // Save new learning plan
    // --------------------------------------------------

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

    // --------------------------------------------------
    // Response
    // --------------------------------------------------

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

// ======================================================
// GET LATEST LEARNING
// ======================================================

const getLearningController = async (req, res) => {
  try {
    console.log("================================");
    console.log("GET LEARNING");
    console.log("USER:", req.user._id);
    console.log("================================");

    const learning = await Learning.findOne({
      user: req.user._id,
    })
      .sort({
        createdAt: -1,
      })
      .populate("skillGap");

    // No learning plan yet
    if (!learning) {
      return res.status(200).json({
        success: true,
        exists: false,
        message:
          "No learning recommendations found.",
        learning: null,
      });
    }

    return res.status(200).json({
      success: true,
      exists: true,
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
        "Failed to load learning recommendations.",
    });
  }
};

module.exports = {
  generateLearningController,
  getLearningController,
};
