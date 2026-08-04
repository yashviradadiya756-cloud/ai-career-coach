const SkillGap = require("../models/SkillGap");
const Roadmap = require("../models/Roadmap");

const generateRoadmap = require("../utils/geminiRoadmap");


// ======================================================
// GENERATE ROADMAP
// ======================================================

const generateRoadmapController = async (req, res) => {
  try {
    const { targetRole } = req.body;

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message: "Target Role is required",
      });
    }

    const skillGap = await SkillGap.findOne({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    if (!skillGap) {
      return res.status(404).json({
        success: false,
        message: "Please complete Skill Gap Analysis first.",
      });
    }

    const roadmapData = await generateRoadmap(
      skillGap.missingSkills,
      targetRole
    );

    const roadmap = await Roadmap.create({
      user: req.user._id,
      skillGap: skillGap._id,
      targetRole: targetRole,

      roadmapTitle: roadmapData.roadmapTitle,
      phases: roadmapData.phases,
    });

    return res.status(201).json({
      success: true,
      message: "Roadmap Generated Successfully",
      roadmap,
    });

  } catch (error) {
    console.error("Roadmap Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// GET LATEST ROADMAP
// ======================================================

const getRoadmapController = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    if (!roadmap) {
      return res.status(200).json({
        success: true,
        roadmap: null,
      });
    }

    console.log("ROADMAP FOUND:", roadmap);

    return res.status(200).json({
      success: true,
      roadmap,
    });

  } catch (error) {
    console.error("GET ROADMAP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get roadmap",
    });
  }
};


// ======================================================
// UPDATE ROADMAP PHASE
// ======================================================

const updateRoadmapPhaseController = async (req, res) => {
  try {
    const { phaseIndex } = req.params;
    const { completed } = req.body;

    const index = Number(phaseIndex);

    if (Number.isNaN(index)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phase index",
      });
    }

    const roadmap = await Roadmap.findOne({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found",
      });
    }

    if (
      !roadmap.phases ||
      index < 0 ||
      index >= roadmap.phases.length
    ) {
      return res.status(404).json({
        success: false,
        message: "Roadmap phase not found",
      });
    }

    roadmap.phases[index].completed =
      completed === true;

    await roadmap.save();

    // Calculate progress
    const totalPhases = roadmap.phases.length;

    const completedPhases =
      roadmap.phases.filter(
        (phase) => phase.completed === true
      ).length;

    const progress =
      totalPhases > 0
        ? Math.round(
            (completedPhases / totalPhases) * 100
          )
        : 0;

    return res.status(200).json({
      success: true,
      message: "Roadmap phase updated",
      progress,
      roadmap,
    });

  } catch (error) {
    console.error(
      "Update Roadmap Phase Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  generateRoadmapController,
  getRoadmapController,
  updateRoadmapPhaseController,
};