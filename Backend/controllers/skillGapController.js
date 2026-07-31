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
    console.log("Logged User:", req.user._id.toString());
    console.log("Resume User:", resume.user.toString());

    const analysis = await analyzeSkillGap(
    resume.resumeText,
    targetRole
  );

  console.log("================================");
  console.log("Analysis:");
  console.log(JSON.stringify(analysis, null, 2));
  console.log("================================");
    
    const skillGap = await SkillGap.create({
    user: req.user._id,
    resume: resume._id,
    targetRole,

    currentSkills: analysis.currentSkills,
    missingSkills: analysis.missingSkills,
    readinessScore: analysis.readinessScore,
    recommendedCourses: analysis.recommendedCourses,
    roadmap: analysis.roadmap,
  });

  console.log("Saved SkillGap:");
console.log(skillGap);

    res.status(200).json({
      success: true,
      message: "Skill Gap Analysis Completed",
      skillGap,
    });

  } catch (error) {

  console.log(error);

  if (
    error.message &&
    error.message.includes("503")
  ) {
    return res.status(503).json({
      success: false,
      message:
        "AI service is temporarily busy. Please try again in a few moments."
    });
  }

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};

const getLatestSkillGap = async (req, res) => {
  try {

    console.log("================================");
    console.log("Logged User ID:", req.user._id);

    const allSkillGaps = await SkillGap.find();

    console.log(
      "All SkillGap Users:",
      allSkillGaps.map(item => item.user.toString())
    );

    const skillGap = await SkillGap.findOne({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    console.log("Found SkillGap:");
    console.log(skillGap);

    if (!skillGap) {
      return res.status(404).json({
        success: false,
        message: "Skill Gap not found",
      });
    }

    res.json({
      success: true,
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
  getLatestSkillGap,
};