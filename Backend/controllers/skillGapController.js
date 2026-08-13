const Resume = require("../models/Resume");
const SkillGap = require("../models/SkillGap");

const analyzeSkillGap = require("../utils/geminiSkillGap");

// =====================================================
// ANALYZE SKILL GAP
// =====================================================

const analyzeSkillGapController = async (req, res) => {
  try {
    const { targetRole } = req.body;

    console.log("================================");
    console.log("SKILL GAP ANALYSIS START");
    console.log("USER:", req.user._id);
    console.log("TARGET ROLE:", targetRole);
    console.log("================================");

    if (!targetRole || !targetRole.trim()) {
      return res.status(400).json({
        success: false,
        message: "Target role is required",
      });
    }

    // ===============================
    // GET LATEST RESUME
    // ===============================

    const resume = await Resume.findOne({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Please upload your resume first.",
      });
    }

    console.log(
      "Logged User:",
      req.user._id.toString()
    );

    console.log(
      "Resume User:",
      resume.user.toString()
    );

    // ===============================
    // AI ANALYSIS
    // ===============================

    const analysis = await analyzeSkillGap(
      resume.resumeText,
      targetRole.trim()
    );

    console.log("================================");
    console.log("SKILL GAP AI RESULT");
    console.log(
      JSON.stringify(analysis, null, 2)
    );
    console.log("================================");

    // ===============================
    // SAVE
    // ===============================

    const skillGap = await SkillGap.create({
      user: req.user._id,

      resume: resume._id,

      targetRole: targetRole.trim(),

      currentSkills:
        analysis.currentSkills || [],

      missingSkills:
        analysis.missingSkills || [],

      readinessScore:
        Number(analysis.readinessScore) || 0,

      recommendedCourses:
        analysis.recommendedCourses || [],

      roadmap:
        analysis.roadmap || [],
    });

    console.log("================================");
    console.log("SKILL GAP SAVED");
    console.log("ID:", skillGap._id);
    console.log("================================");

    return res.status(200).json({
      success: true,
      message: "Skill Gap Analysis Completed",
      skillGap,
    });

  } catch (error) {
    console.error("================================");
    console.error("SKILL GAP ERROR");
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
        "Skill Gap Analysis Failed",
    });
  }
};

// =====================================================
// GET LATEST SKILL GAP
// =====================================================

const getLatestSkillGap = async (req, res) => {
  try {
    console.log("================================");
    console.log("GET LATEST SKILL GAP");
    console.log("USER:", req.user._id);
    console.log("================================");

    const skillGap = await SkillGap.findOne({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    // No analysis yet
    if (!skillGap) {
      console.log(
        "No Skill Gap found for user"
      );

      return res.status(200).json({
        success: true,
        skillGap: null,
        message: "No Skill Gap Analysis found",
      });
    }

    console.log(
      "Skill Gap Found:",
      skillGap._id
    );

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