const Resume = require("../models/Resume");
const SkillGap = require("../models/SkillGap");

const analyzeSkillGap =
  require("../utils/geminiSkillGap");

// =====================================================
// ANALYZE SKILL GAP
// =====================================================

const analyzeSkillGapController = async (
  req,
  res
) => {
  try {
    console.log(
      "================================"
    );

    console.log(
      "SKILL GAP REQUEST RECEIVED"
    );

    console.log(
      "================================"
    );

    console.log(
      "BODY:",
      req.body
    );

    console.log(
      "USER:",
      req.user?._id
    );

    const { targetRole } =
      req.body || {};

    // =================================================
    // VALIDATE
    // =================================================

    if (
      typeof targetRole !== "string" ||
      !targetRole.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Target role is required.",
      });
    }

    const cleanTargetRole =
      targetRole.trim();

    // =================================================
    // FIND RESUME
    // =================================================

    const resume =
      await Resume.findOne({
        user: req.user._id,
      }).sort({
        createdAt: -1,
      });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message:
          "Please upload your resume first.",
      });
    }

    console.log(
      "RESUME FOUND:",
      resume._id
    );

    // =================================================
    // CHECK RESUME TEXT
    // =================================================

    if (
      !resume.resumeText ||
      !resume.resumeText.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Resume text is missing. Please upload your resume again.",
      });
    }

    // =================================================
    // GEMINI
    // =================================================

    console.log(
      "STARTING GEMINI ANALYSIS..."
    );

    const analysis =
      await analyzeSkillGap(
        resume.resumeText,
        cleanTargetRole
      );

    // =================================================
    // FINAL NORMALIZATION
    // =================================================

    const currentSkills =
      Array.isArray(
        analysis.currentSkills
      )
        ? analysis.currentSkills.map(
            String
          )
        : [];

    const missingSkills =
      Array.isArray(
        analysis.missingSkills
      )
        ? analysis.missingSkills.map(
            String
          )
        : [];

    const recommendedCourses =
      Array.isArray(
        analysis.recommendedCourses
      )
        ? analysis.recommendedCourses.map(
            String
          )
        : [];

    const readinessScore = Math.min(
      100,
      Math.max(
        0,
        Number(
          analysis.readinessScore
        ) || 0
      )
    );

    // =================================================
    // ROADMAP
    // =================================================

    const roadmap =
      Array.isArray(analysis.roadmap)
        ? analysis.roadmap
            .map((item) => {
              if (
                !item ||
                typeof item !== "object" ||
                Array.isArray(item)
              ) {
                return null;
              }

              return {
                phase: String(
                  item.phase || ""
                ).trim(),

                duration: String(
                  item.duration || ""
                ).trim(),

                actionItems:
                  Array.isArray(
                    item.actionItems
                  )
                    ? item.actionItems
                        .map((action) =>
                          String(
                            action
                          ).trim()
                        )
                        .filter(Boolean)
                    : [],
              };
            })
            .filter(Boolean)
        : [];

    console.log(
      "================================"
    );

    console.log(
      "FINAL SKILL GAP DATA"
    );

    console.log(
      JSON.stringify(
        {
          currentSkills,
          missingSkills,
          readinessScore,
          recommendedCourses,
          roadmap,
        },
        null,
        2
      )
    );

    console.log(
      "================================"
    );

    // =================================================
    // SAVE
    // =================================================

    const skillGap =
      await SkillGap.create({
        user: req.user._id,

        resume: resume._id,

        targetRole:
          cleanTargetRole,

        currentSkills,

        missingSkills,

        readinessScore,

        recommendedCourses,

        roadmap,
      });

    console.log(
      "SKILL GAP SAVED:",
      skillGap._id
    );

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      message:
        "Skill Gap Analysis Completed",

      skillGap,
    });
  } catch (error) {
    console.error(
      "================================"
    );

    console.error(
      "SKILL GAP ERROR"
    );

    console.error(error);

    console.error(
      "================================"
    );

    // =================================================
    // GEMINI ERROR
    // =================================================

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
        "Skill Gap Analysis Failed.",
    });
  }
};

// =====================================================
// GET LATEST SKILL GAP
// =====================================================

const getLatestSkillGap = async (
  req,
  res
) => {
  try {
    console.log(
      "GET LATEST SKILL GAP"
    );

    const skillGap =
      await SkillGap.findOne({
        user: req.user._id,
      }).sort({
        createdAt: -1,
      });

    if (!skillGap) {
      return res.status(200).json({
        success: true,
        skillGap: null,
        message:
          "No Skill Gap Analysis found.",
      });
    }

    return res.status(200).json({
      success: true,
      skillGap,
    });
  } catch (error) {
    console.error(
      "GET LATEST SKILL GAP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to get Skill Gap.",
    });
  }
};

module.exports = {
  analyzeSkillGap,
  getLatestSkillGap,
};