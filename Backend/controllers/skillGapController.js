const Resume = require("../models/Resume");
const SkillGap = require("../models/SkillGap");

const analyzeSkillGap = require("../utils/geminiSkillGap");

/* =====================================================
   ANALYZE SKILL GAP
===================================================== */

const analyzeSkillGapController = async (
  req,
  res
) => {
  try {
    const { targetRole } = req.body;

    console.log("================================");
    console.log("SKILL GAP ANALYSIS STARTED");
    console.log(
      "USER:",
      req.user._id.toString()
    );
    console.log(
      "TARGET ROLE:",
      targetRole
    );
    console.log("================================");

    if (
      !targetRole ||
      !targetRole.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Target role is required",
      });
    }

    /* =================================================
       GET LATEST RESUME
    ================================================= */

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
      "Resume ID:",
      resume._id
    );

    console.log(
      "Resume User:",
      resume.user.toString()
    );

    /* =================================================
       GEMINI
    ================================================= */

    const analysis =
      await analyzeSkillGap(
        resume.resumeText,
        targetRole.trim()
      );

    console.log(
      "================================"
    );

    console.log(
      "SKILL GAP ANALYSIS:"
    );

    console.log(
      JSON.stringify(
        analysis,
        null,
        2
      )
    );

    console.log(
      "================================"
    );

    /* =================================================
       SAVE SKILL GAP
    ================================================= */

    const skillGap =
      await SkillGap.create({
        user: req.user._id,

        resume: resume._id,

        targetRole:
          targetRole.trim(),

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

        roadmap:
          Array.isArray(
            analysis.roadmap
          )
            ? analysis.roadmap
            : [],
      });

    console.log(
      "================================"
    );

    console.log(
      "SKILL GAP SAVED:",
      skillGap._id
    );

    console.log(
      "================================"
    );

    return res.status(200).json({
      success: true,

      message:
        "Skill Gap Analysis Completed",

      skillGap,
    });

  } catch (error) {
    console.error(
      "SKILL GAP ERROR:",
      error
    );

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
        "Skill Gap Analysis Failed",
    });
  }
};

/* =====================================================
   GET LATEST SKILL GAP
===================================================== */

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
      "USER ID:",
      req.user._id.toString()
    );

    /* =================================================
       GET LATEST FOR CURRENT USER ONLY
    ================================================= */

    const skillGap =
      await SkillGap.findOne({
        user: req.user._id,
      }).sort({
        createdAt: -1,
      });

    console.log(
      "FOUND SKILL GAP:",
      skillGap
        ? skillGap._id
        : "NONE"
    );

    /* =================================================
       NOT FOUND
    ================================================= */

    if (!skillGap) {
      return res.status(404).json({
        success: false,

        message:
          "Skill Gap not found",
      });
    }

    /* =================================================
       SUCCESS
    ================================================= */

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
        "Failed to get Skill Gap",
    });
  }
};

module.exports = {
  analyzeSkillGapController,
  getLatestSkillGap,
};