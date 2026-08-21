const SkillGap = require("../models/SkillGap");
const analyzeSkillGapAI = require("../services/skillGapService");

console.log("🔥🔥🔥 SKILL GAP CONTROLLER LOADED 🔥🔥🔥");

// =====================================================
// ANALYZE SKILL GAP
// =====================================================

const analyzeSkillGap = async (req, res) => {
  console.log(
    "🔥🔥🔥 ANALYZE SKILL GAP FUNCTION RUNNING 🔥🔥🔥"
  );

  try {
    console.log("=================================");
    console.log("SKILL GAP ANALYSIS STARTED");
    console.log("=================================");

    // =================================================
    // USER
    // =================================================

    const userId = req.user?._id;

    console.log("USER ID:", userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    // =================================================
    // BODY
    // =================================================

    console.log("BODY:", req.body);

    const targetRole = String(
      req.body?.targetRole || ""
    ).trim();

    console.log("TARGET ROLE:", targetRole);

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message: "Target role is required",
      });
    }

    // =================================================
    // GET LATEST RESUME
    // =================================================

    let resumeText = "";

    try {
      const Resume = require("../models/Resume");

      const resume = await Resume.findOne({
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
          "⚠️ NO RESUME FOUND"
        );
      }
    } catch (resumeError) {
      console.error(
        "RESUME FETCH ERROR:",
        resumeError.message
      );
    }

    // =================================================
    // GEMINI / AI ANALYSIS
    // =================================================

    console.log(
      "================================="
    );

    console.log(
      "STARTING GEMINI ANALYSIS..."
    );

    console.log(
      "TARGET ROLE:",
      targetRole
    );

    console.log(
      "RESUME AVAILABLE:",
      resumeText.length > 0
    );

    console.log(
      "================================="
    );

    const aiResult = await analyzeSkillGapAI(
      resumeText,
      targetRole
    );

    console.log(
      "================================="
    );

    console.log(
      "RAW AI RESULT:"
    );

    console.log(
      JSON.stringify(
        aiResult,
        null,
        2
      )
    );

    console.log(
      "================================="
    );

    // =================================================
    // VALIDATE AI RESULT
    // =================================================

    if (!aiResult) {
      return res.status(500).json({
        success: false,
        message:
          "AI did not return a skill gap analysis",
      });
    }

    // =================================================
    // NORMALIZE AI ARRAYS
    // =================================================

    const currentSkills =
      Array.isArray(
        aiResult.currentSkills
      )
        ? aiResult.currentSkills
        : [];

    const missingSkills =
      Array.isArray(
        aiResult.missingSkills
      )
        ? aiResult.missingSkills
        : [];

    const recommendedCourses =
      Array.isArray(
        aiResult.recommendedCourses
      )
        ? aiResult.recommendedCourses
        : [];

    const roadmap =
      Array.isArray(
        aiResult.roadmap
      )
        ? aiResult.roadmap
        : [];

    // =================================================
    // READINESS SCORE
    // =================================================

    let readinessScore =
      Number(
        aiResult.readinessScore
      );

    if (
      Number.isNaN(
        readinessScore
      )
    ) {
      readinessScore = 0;
    }

    readinessScore = Math.min(
      Math.max(
        readinessScore,
        0
      ),
      100
    );

    // =================================================
    // LOG NORMALIZED DATA
    // =================================================

    console.log(
      "================================="
    );

    console.log(
      "NORMALIZED SKILL GAP DATA"
    );

    console.log(
      "CURRENT SKILLS:",
      currentSkills
    );

    console.log(
      "MISSING SKILLS:",
      missingSkills
    );

    console.log(
      "READINESS SCORE:",
      readinessScore
    );

    console.log(
      "RECOMMENDED COURSES:",
      recommendedCourses
    );

    console.log(
      "ROADMAP:",
      roadmap
    );

    console.log(
      "================================="
    );

    // =================================================
    // SAVE TO MONGODB
    // =================================================

    const skillGap =
      await SkillGap.create({
        user: userId,

        targetRole,

        currentSkills,

        missingSkills,

        readinessScore,

        recommendedCourses,

        roadmap,
      });

    console.log(
      "================================="
    );

    console.log(
      "SKILL GAP SAVED SUCCESSFULLY"
    );

    console.log(
      "SKILL GAP ID:",
      skillGap._id
    );

    console.log(
      "================================="
    );

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      message:
        "Skill Gap Analysis completed successfully",

      skillGap: {
        _id: skillGap._id,

        user: skillGap.user,

        targetRole:
          skillGap.targetRole,

        currentSkills:
          skillGap.currentSkills,

        missingSkills:
          skillGap.missingSkills,

        readinessScore:
          skillGap.readinessScore,

        recommendedCourses:
          skillGap.recommendedCourses,

        roadmap:
          skillGap.roadmap,

        createdAt:
          skillGap.createdAt,

        updatedAt:
          skillGap.updatedAt,
      },
    });

  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "❌ SKILL GAP CONTROLLER ERROR"
    );

    console.error(
      error
    );

    console.error(
      "ERROR MESSAGE:",
      error?.message
    );

    console.error(
      "ERROR STACK:",
      error?.stack
    );

    console.error(
      "================================="
    );

    return res.status(500).json({
      success: false,

      message:
        "Skill gap analysis failed",

      error:
        error?.message ||
        String(error),
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
      "================================="
    );

    console.log(
      "🔥 GET LATEST SKILL GAP"
    );

    console.log(
      "================================="
    );

    const userId =
      req.user?._id;

    console.log(
      "USER ID:",
      userId
    );

    if (!userId) {
      return res.status(401).json({
        success: false,

        message:
          "Unauthorized user",
      });
    }

    // =================================================
    // FIND LATEST
    // =================================================

    const skillGap =
      await SkillGap.findOne({
        user: userId,
      }).sort({
        createdAt: -1,
      });

    // =================================================
    // NO DATA
    // =================================================

    if (!skillGap) {
      console.log(
        "NO SKILL GAP FOUND"
      );

      return res.status(200).json({
        success: true,

        skillGap: null,

        message:
          "No skill gap analysis found",
      });
    }

    // =================================================
    // DATA FOUND
    // =================================================

    console.log(
      "SKILL GAP FOUND:",
      skillGap._id
    );

    return res.status(200).json({
      success: true,

      skillGap,
    });

  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "❌ GET SKILL GAP ERROR"
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
        "Failed to get latest skill gap",

      error:
        error?.message ||
        String(error),
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