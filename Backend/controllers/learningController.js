const SkillGap = require("../models/SkillGap");
const Learning = require("../models/Learning");

const generateLearningRecommendations = require("../utils/geminiLearning");

// ============================================
// GENERATE LEARNING RECOMMENDATIONS
// ============================================

const generateLearningController = async (req, res) => {
  try {
    let { targetRole } = req.body;

    // Find latest Skill Gap for logged-in user
    let skillGap;

    if (targetRole) {
      skillGap = await SkillGap.findOne({
        user: req.user._id,
        targetRole,
      }).sort({ createdAt: -1 });
    } else {
      skillGap = await SkillGap.findOne({
        user: req.user._id,
      }).sort({ createdAt: -1 });

      if (skillGap) {
        targetRole = skillGap.targetRole;
      }
    }

    if (!skillGap) {
      return res.status(404).json({
        success: false,
        message: "Please complete Skill Gap Analysis first.",
      });
    }

    console.log("================================");
    console.log("LEARNING GENERATION");
    console.log("Target Role:", targetRole);
    console.log("Missing Skills:", skillGap.missingSkills);
    console.log("================================");

    // Generate AI recommendations
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

    return res.status(201).json({
      success: true,
      message: "Learning Recommendations Generated Successfully",
      learning,
    });

  } catch (error) {
    console.log("Learning Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============================================
// GET LATEST LEARNING
// ============================================

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

    return res.status(200).json({
      success: true,
      learning,
    });

  } catch (error) {
    console.log("Get Learning Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  generateLearningController,
  getLearningController,
};