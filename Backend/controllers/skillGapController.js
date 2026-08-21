const SkillGap = require("../models/SkillGap");

const analyzeSkillGap = async (req, res) => {
  try {
    console.log("=================================");
    console.log("SKILL GAP ANALYSIS STARTED");
    console.log("=================================");

    console.log("User:", req.user?._id);
    console.log("Body:", req.body);

    const targetRole = req.body?.targetRole;

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message: "targetRole is required",
      });
    }

    console.log(
      "Target Role:",
      targetRole
    );

    // TEMPORARY TEST RESPONSE
    // We are testing route + middleware first.
    return res.status(200).json({
      success: true,
      message: "Skill gap route is working",
      targetRole,
      userId: req.user._id,
    });

  } catch (error) {
    console.error(
      "SKILL GAP ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Skill gap analysis failed",
      error: error.message,
    });
  }
};

const getLatestSkillGap = async (req, res) => {
  try {
    console.log(
      "GET LATEST SKILL GAP"
    );

    const skillGap = await SkillGap.findOne({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      skillGap: skillGap || null,
    });

  } catch (error) {
    console.error(
      "GET SKILL GAP ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get latest skill gap",
      error: error.message,
    });
  }
};

module.exports = {
  analyzeSkillGap,
  getLatestSkillGap,
};