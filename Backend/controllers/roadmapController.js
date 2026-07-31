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
    console.log("Target Role:", targetRole);

    const all = await SkillGap.find({
  user: req.user._id,
});

console.log(all);

    // Get latest Skill Gap Analysis
    const skillGap = await SkillGap.findOne({
      user: req.user._id,
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

    console.log("======================");
    console.log("User:", req.user._id.toString());
    console.log("Target Role:", targetRole);
    console.log("SkillGap:", skillGap);
    console.log("Missing Skills:", skillGap.missingSkills);
    console.log("======================");

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

const getRoadmapController = async (req, res) => {
  try {

    const roadmap = await Roadmap.findOne({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found",
      });
    }

    res.json({
      success: true,
      roadmap,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  generateRoadmapController,
  getRoadmapController,
};