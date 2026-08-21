const SkillGap = require("../models/SkillGap");

console.log(
  "🔥🔥🔥 NEW SKILL GAP CONTROLLER LOADED 🔥🔥🔥"
);

// =====================================================
// ANALYZE SKILL GAP
// =====================================================

const analyzeSkillGap = async (req, res) => {
  console.log(
    "🔥🔥🔥 NEW ANALYZE FUNCTION RUNNING 🔥🔥🔥"
  );

  try {
    console.log("=================================");
    console.log("SKILL GAP ANALYSIS STARTED");
    console.log("=================================");

    console.log(
      "USER ID:",
      req.user?._id
    );

    console.log(
      "BODY:",
      req.body
    );

    const targetRole = String(
      req.body?.targetRole || ""
    ).trim();

    console.log(
      "TARGET ROLE:",
      targetRole
    );

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message: "Target role is required",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "NEW SKILL GAP CONTROLLER WORKING",

      targetRole,

      userId: req.user?._id,
    });

  } catch (error) {
    console.error(
      "SKILL GAP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Skill gap analysis failed",
      error: error.message,
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
  console.log(
    "🔥🔥🔥 NEW GET LATEST FUNCTION RUNNING 🔥🔥🔥"
  );

  try {
    console.log(
      "GET LATEST SKILL GAP"
    );

    console.log(
      "USER ID:",
      req.user?._id
    );

    const skillGap =
      await SkillGap.findOne({
        user: req.user._id,
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
      error: error.message,
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