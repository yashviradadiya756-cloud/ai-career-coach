const Resume = require("../models/Resume");
const SkillGap = require("../models/SkillGap");
const analyzeSkillGap = require("../utils/geminiSkillGap");

const analyzeSkillGapController = async (req, res) => {
  try {
    const { targetRole } = req.body;

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message: "Target role is required",
      });
    }

    const resume = await Resume.findOne({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Please upload your resume first.",
      });
    }

    const analysis = await analyzeSkillGap(
      resume.resumeText,
      targetRole
    );

    const skillGap = await SkillGap.create({
      user: req.user._id,
      resume: resume._id,
      targetRole,

      currentSkills: analysis.currentSkills,
      missingSkills: analysis.missingSkills,
      recommendedCourses: analysis.recommendedCourses,
      roadmap: analysis.roadmap,
    });

    res.status(200).json({
      success: true,
      message: "Skill Gap Analysis Completed",
      skillGap,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  analyzeSkillGapController,
};