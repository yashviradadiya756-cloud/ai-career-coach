const Roadmap = require("../models/Roadmap");
const generateRoadmap = require("../utils/geminiRoadmapGenerator");

// ======================================================
// GENERATE ROADMAP
// ======================================================

const generateRoadmapController = async (req, res) => {
  try {
    console.log("====================================");
    console.log("🚀 GENERATE ROADMAP STARTED");
    console.log("User:", req.user?._id);
    console.log("Body:", req.body);

    const { targetRole } = req.body;

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message: "Target role is required",
      });
    }

    // ==================================================
    // 1. GENERATE ROADMAP USING GEMINI
    // ==================================================

    console.log("🤖 Generating roadmap for:", targetRole);

    const generatedRoadmap = await generateRoadmap(targetRole);

    console.log("✅ Gemini roadmap generated");
    console.log(
      "Generated roadmap:",
      JSON.stringify(generatedRoadmap, null, 2)
    );

    if (!generatedRoadmap) {
      return res.status(500).json({
        success: false,
        message: "AI failed to generate roadmap",
      });
    }

    // ==================================================
    // 2. PREPARE DATA
    // ==================================================

    const roadmapData = {
      targetRole: targetRole,

      roadmapTitle:
        generatedRoadmap.roadmapTitle ||
        `AI Roadmap for ${targetRole}`,

      phases: Array.isArray(generatedRoadmap.phases)
        ? generatedRoadmap.phases.map((phase) => ({
            title: phase.title || "",
            duration: phase.duration || "",
            topics: Array.isArray(phase.topics)
              ? phase.topics
              : [],
            projects: Array.isArray(phase.projects)
              ? phase.projects
              : [],
            resources: Array.isArray(phase.resources)
              ? phase.resources
              : [],
            completed: Boolean(phase.completed),
          }))
        : [],
    };

    console.log(
      "💾 Data going to MongoDB:",
      JSON.stringify(roadmapData, null, 2)
    );

    // ==================================================
    // 3. SAVE / UPDATE ROADMAP
    // ==================================================
    //
    // IMPORTANT:
    // One user = one current roadmap.
    //
    // If roadmap already exists:
    // UPDATE it.
    //
    // If roadmap does not exist:
    // CREATE it.
    //
    // ==================================================

    const roadmap = await Roadmap.findOneAndUpdate(
      {
        user: req.user._id,
      },
      {
        $set: roadmapData,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    console.log("====================================");
    console.log("✅ ROADMAP SAVED TO MONGODB");
    console.log("Roadmap ID:", roadmap._id);
    console.log("User ID:", roadmap.user);
    console.log("Target Role:", roadmap.targetRole);
    console.log("Phases:", roadmap.phases.length);
    console.log("====================================");

    // ==================================================
    // 4. RETURN SAVED ROADMAP
    // ==================================================

    return res.status(200).json({
      success: true,
      message: "Roadmap generated and saved successfully",
      roadmap,
    });

  } catch (error) {
    console.error("====================================");
    console.error("❌ GENERATE ROADMAP ERROR");
    console.error(error);
    console.error("====================================");

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate roadmap",
    });
  }
};


// ======================================================
// GET SAVED ROADMAP
// ======================================================

const getRoadmapController = async (req, res) => {
  try {
    console.log("====================================");
    console.log("📥 GET ROADMAP");
    console.log("User:", req.user?._id);

    const roadmap = await Roadmap.findOne({
      user: req.user._id,
    });

    // No roadmap yet
    if (!roadmap) {
      console.log("ℹ️ No roadmap found for user");

      return res.status(200).json({
        success: true,
        roadmap: null,
      });
    }

    console.log("✅ Roadmap found");
    console.log("Roadmap ID:", roadmap._id);
    console.log("Target Role:", roadmap.targetRole);
    console.log("Phases:", roadmap.phases.length);

    return res.status(200).json({
      success: true,
      roadmap,
    });

  } catch (error) {
    console.error("❌ GET ROADMAP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get roadmap",
    });
  }
};


module.exports = {
  generateRoadmapController,
  getRoadmapController,
};