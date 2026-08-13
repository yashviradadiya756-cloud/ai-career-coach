const Resume = require("../models/Resume");
const SkillGap = require("../models/SkillGap");

const analyzeSkillGap = require("../utils/geminiSkillGap");

// =====================================================
// ANALYZE SKILL GAP
// =====================================================

const analyzeSkillGapController = async (
  req,
  res
) => {
  try {
    console.log("================================");
    console.log("SKILL GAP REQUEST RECEIVED");
    console.log("================================");

    console.log("BODY:", req.body);
    console.log("USER:", req.user?._id);

    const { targetRole } = req.body;

    // ==========================================
    // VALIDATE TARGET ROLE
    // ==========================================

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

    console.log(
      "TARGET ROLE:",
      cleanTargetRole
    );

    // ==========================================
    // FIND LATEST RESUME
    // ==========================================

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

    // ==========================================
    // CHECK RESUME TEXT
    // ==========================================

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

    // ==========================================
    // AI ANALYSIS
    // ==========================================

    console.log("================================");
    console.log(
      "STARTING GEMINI ANALYSIS"
    );
    console.log("================================");

    const analysis =
      await analyzeSkillGap(
        resume.resumeText,
        cleanTargetRole
      );

    console.log("================================");
    console.log("AI RESULT");
    console.log(
      JSON.stringify(
        analysis,
        null,
        2
      )
    );
    console.log("================================");

    // ==========================================
    // NORMALIZE ROADMAP
    // ==========================================

    const roadmap =
      Array.isArray(analysis.roadmap)
        ? analysis.roadmap
            .map((item) => {
              if (
                !item ||
                typeof item !==
                  "object" ||
                Array.isArray(item)
              ) {
                return null;
              }

              return {
                phase:
                  String(
                    item.phase || ""
                  ),

                duration:
                  String(
                    item.duration || ""
                  ),

                actionItems:
                  Array.isArray(
                    item.actionItems
                  )
                    ? item.actionItems.map(
                        String
                      )
                    : [],
              };
            })
            .filter(Boolean)
        : [];

    // ==========================================
    // CREATE DATABASE RECORD
    // ==========================================

    const skillGap =
      await SkillGap.create({
        user: req.user._id,

        resume: resume._id,

        targetRole: cleanTargetRole,

        currentSkills:
          Array.isArray(
            analysis.currentSkills
          )
            ? analysis.currentSkills
            : [],

        missingSkills:
          Array.isArray(
            analysis.missingSkills
          )
            ? analysis.missingSkills
            : [],

        readinessScore:
          Number(
            analysis.readinessScore
          ) || 0,

        recommendedCourses:
          Array.isArray(
            analysis.recommendedCourses
          )
            ? analysis.recommendedCourses
            : [],

        roadmap,
      });

    console.log("================================");
    console.log(
      "SKILL GAP SAVED SUCCESSFULLY"
    );
    console.log(
      "SKILL GAP ID:",
      skillGap._id
    );
    console.log("================================");

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      message:
        "Skill Gap Analysis Completed",

      skillGap,
    });
  } catch (error) {
    console.error("================================");
    console.error(
      "SKILL GAP ERROR"
    );
    console.error(error);
    console.error("================================");

    if (
      error.message &&
      error.message.includes("503")
    ) {
      return res.status(503).json({
        success: false,
        message:
          "AI service is temporarily busy. Please try again in a few moments.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
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
    console.log("================================");
    console.log(
      "GET LATEST SKILL GAP"
    );
    console.log(
      "USER:",
      req.user._id
    );
    console.log("================================");

    const skillGap =
      await SkillGap.findOne({
        user: req.user._id,
      }).sort({
        createdAt: -1,
      });

    // ==========================================
    // NO RESULT
    // ==========================================

    if (!skillGap) {
      return res.status(200).json({
        success: true,

        skillGap: null,

        message:
          "No Skill Gap Analysis found.",
      });
    }

    // ==========================================
    // RESULT
    // ==========================================

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
        error.message ||
        "Failed to get Skill Gap.",
    });
  }
};

module.exports = {
  analyzeSkillGapController,
  getLatestSkillGap,
};