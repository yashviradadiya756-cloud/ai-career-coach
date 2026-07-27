const SkillGap = require("../models/SkillGap");
const Roadmap = require("../models/Roadmap");

const generateRoadmap = require("../utils/geminiRoadmap");

const generateRoadmapController = async (req, res) => {
  try {
    const { targetRole } = req.body;

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message: "Target Role is required",
      });
    }

    // Get latest Skill Gap Analysis
    const skillGap = await SkillGap.findOne({
      user: req.user._id,
      targetRole,
    }).sort({ createdAt: -1 });

    if (!skillGap) {
      return res.status(404).json({
        success: false,
        message: "Please complete Skill Gap Analysis first.",
      });
    }

    // Generate AI Roadmap
    const roadmapData = await generateRoadmap(
      skillGap.missingSkills,
      targetRole
    );

    // Save to MongoDB
    const roadmap = await Roadmap.create({
      user: req.user._id,
      skillGap: skillGap._id,
      targetRole,

      roadmapTitle: roadmapData.roadmapTitle,
      phases: roadmapData.phases,
    });

    res.status(201).json({
      success: true,
      message: "Roadmap Generated Successfully",
      roadmap,
    });

  } catch (error) {
    console.log("Roadmap Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  generateRoadmapController,
};