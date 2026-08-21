const SkillGap = require("../models/SkillGap");

const analyzeSkillGapAI = require(
  "../services/skillGapService"
);

console.log(
  "🔥🔥🔥 SKILL GAP CONTROLLER LOADED 🔥🔥🔥"
);

// =====================================================
// ANALYZE SKILL GAP
// =====================================================

const analyzeSkillGap = async (
  req,
  res
) => {
  console.log(
    "🔥🔥🔥 ANALYZE SKILL GAP FUNCTION RUNNING 🔥🔥🔥"
  );

  try {
    console.log("=================================");
    console.log("SKILL GAP ANALYSIS STARTED");
    console.log("=================================");

    // -----------------------------------------------
    // USER
    // -----------------------------------------------

    const userId =
      req.user?._id;

    console.log(
      "USER ID:",
      userId
    );

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    // -----------------------------------------------
    // BODY
    // -----------------------------------------------

    console.log(
      "BODY:",
      req.body
    );

    const targetRole =
      String(
        req.body?.targetRole || ""
      ).trim();

    console.log(
      "TARGET ROLE:",
      targetRole
    );

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message:
          "Target role is required",
      });
    }

    // -----------------------------------------------
    // RESUME
    // -----------------------------------------------

    let resumeText = "";

    try {
      const Resume = require(
        "../models/Resume"
      );

      const resume =
        await Resume.findOne({
          user: userId,
        }).sort({
          createdAt: -1,
        });

      if (resume) {
        console.log(
          "RESUME FOUND:",
          resume._id
        );

        resumeText =
          resume.resumeText ||
          resume.text ||
          "";

        console.log(
          "RESUME TEXT LENGTH:",
          resumeText.length
        );
      } else {
        console.log(
          "NO RESUME FOUND"
        );
      }

    } catch (resumeError) {
      console.error(
        "RESUME FETCH ERROR:",
        resumeError.message
      );
    }

    // -----------------------------------------------
    // GEMINI
    // -----------------------------------------------

    console.log(
      "STARTING GEMINI ANALYSIS..."
    );

    const aiResult =
      await analyzeSkillGapAI(
        resumeText,
        targetRole
      );

    console.log(
      "AI RESULT:",
      JSON.stringify(
        aiResult,
        null,
        2
      )
    );

    // -----------------------------------------------
    // SAVE TO MONGODB
    // -----------------------------------------------

    const skillGap =
      await SkillGap.create({
        user: userId,

        targetRole,

        currentSkills:
          aiResult.currentSkills,

        missingSkills:
          aiResult.missingSkills,

        readinessScore:
          aiResult.readinessScore,

        recommendedCourses:
          aiResult.recommendedCourses,

        roadmap:
          aiResult.roadmap,
      });

    console.log(
      "SKILL GAP SAVED:",
      skillGap._id
    );

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Skill Gap Analysis completed successfully",

      skillGap,
    });

  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "SKILL GAP CONTROLLER ERROR"
    );

    console.error(
      error
    );

    console.error(
      "================================="
    );

    return res.status(500).json({
      success: false,

      message:
        "Skill gap analysis failed",

      error:
        error.message,
    });
  }
};

// =====================================================
// GET LATEST
// =====================================================

const getLatestSkillGap = async (
  req,
  res
) => {
  try {
    console.log(
      "🔥🔥🔥 GET LATEST SKILL GAP 🔥🔥🔥"
    );

    const userId =
      req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Unauthorized user",
      });
    }

    const skillGap =
      await SkillGap.findOne({
        user: userId,
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,

      skillGap:
        skillGap || null,
    });

  } catch (error) {
    console.error(
      "GET SKILL GAP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to get latest skill gap",

      error:
        error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  analyzeSkillGap,
  getLatestSkillGap,
};