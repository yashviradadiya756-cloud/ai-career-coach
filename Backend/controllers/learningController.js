const Learning = require("../models/Learning");
const SkillGap = require("../models/SkillGap");

const generateLearningRecommendations =
  require("../utils/geminiLearning");

// =====================================================
// GET LATEST LEARNING PLAN
// GET /api/learning
// =====================================================

const getLearningController = async (
  req,
  res
) => {
  try {
    console.log("=================================");
    console.log("GET LATEST LEARNING");
    console.log(
      "USER:",
      req.user?._id
    );
    console.log("=================================");

    const learning =
      await Learning.findOne({
        user: req.user._id,
      })
        .populate("skillGap")
        .sort({
          createdAt: -1,
        });

    // -------------------------------------------------
    // NO LEARNING PLAN YET
    // -------------------------------------------------

    if (!learning) {
      return res.status(200).json({
        success: true,
        learning: null,
        message:
          "No learning plan generated yet.",
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
        error?.message ||
        "Failed to load learning plan.",
    });
  }
};

// =====================================================
// GENERATE LEARNING PLAN
// POST /api/learning/generate
// =====================================================

const generateLearningController =
  async (req, res) => {
    try {
      console.log("=================================");
      console.log(
        "GENERATE LEARNING REQUEST"
      );
      console.log(
        "USER:",
        req.user?._id
      );
      console.log("=================================");

      // =================================================
      // FIND LATEST SKILL GAP
      // =================================================

      const skillGap =
        await SkillGap.findOne({
          user: req.user._id,
        }).sort({
          createdAt: -1,
        });

      // =================================================
      // IMPORTANT
      // =================================================

      if (!skillGap) {
        return res.status(400).json({
          success: false,
          message:
            "Please complete Skill Gap Analysis first.",
        });
      }

      console.log(
        "SKILL GAP FOUND:",
        skillGap._id
      );

      console.log(
        "TARGET ROLE:",
        skillGap.targetRole
      );

      console.log(
        "MISSING SKILLS:",
        skillGap.missingSkills
      );

      // =================================================
      // VALIDATE SKILL GAP
      // =================================================

      if (
        !skillGap.targetRole ||
        !skillGap.targetRole.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Skill Gap target role is missing.",
        });
      }

      const missingSkills =
        Array.isArray(
          skillGap.missingSkills
        )
          ? skillGap.missingSkills
              .map((skill) =>
                String(skill).trim()
              )
              .filter(Boolean)
          : [];

      if (
        missingSkills.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "No missing skills found. Skill Gap Analysis does not contain any learning gaps.",
        });
      }

      // =================================================
      // GENERATE WITH GEMINI
      // =================================================

      console.log(
        "STARTING LEARNING AI..."
      );

      const aiResult =
        await generateLearningRecommendations(
          missingSkills,
          skillGap.targetRole
        );

      const recommendations =
        Array.isArray(
          aiResult?.recommendations
        )
          ? aiResult.recommendations
          : [];

      if (
        recommendations.length === 0
      ) {
        return res.status(500).json({
          success: false,
          message:
            "AI could not generate learning recommendations.",
        });
      }

      // =================================================
      // DELETE OLD LEARNING PLAN
      // =================================================

      await Learning.deleteMany({
        user: req.user._id,
      });

      console.log(
        "OLD LEARNING PLANS REMOVED"
      );

      // =================================================
      // SAVE NEW LEARNING PLAN
      // =================================================

      const learning =
        await Learning.create({
          user: req.user._id,

          skillGap:
            skillGap._id,

          targetRole:
            skillGap.targetRole,

          recommendations,
        });

      console.log("=================================");
      console.log(
        "LEARNING PLAN SAVED"
      );
      console.log(
        "LEARNING ID:",
        learning._id
      );
      console.log("=================================");

      // =================================================
      // RESPONSE
      // =================================================

      return res.status(200).json({
        success: true,

        message:
          "Learning Plan Generated Successfully.",

        learning,
      });
    } catch (error) {
      console.error("=================================");
      console.error(
        "GENERATE LEARNING ERROR"
      );
      console.error(
        error?.message || error
      );
      console.error("=================================");

      const errorMessage =
        error?.message || "";

      if (
        errorMessage.includes(
          "NOT_FOUND"
        ) ||
        errorMessage.includes(
          "model"
        )
      ) {
        return res.status(503).json({
          success: false,
          message:
            "Gemini AI model is unavailable. Please check the configured Gemini model.",
        });
      }

      if (
        errorMessage.includes("503") ||
        errorMessage.includes(
          "UNAVAILABLE"
        )
      ) {
        return res.status(503).json({
          success: false,
          message:
            "AI service is temporarily busy. Please try again.",
        });
      }

      return res.status(500).json({
        success: false,
        message:
          errorMessage ||
          "Learning Plan Generation Failed.",
      });
    }
  };

module.exports = {
  generateLearningController,
  getLearningController,
};