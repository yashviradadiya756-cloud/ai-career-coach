const Roadmap = require("../models/Roadmap");

// =====================================================
// GENERATE ROADMAP
// =====================================================

const generateRoadmapController = async (req, res) => {
  try {
    console.log("======================================");
    console.log("ROADMAP GENERATION START");
    console.log("======================================");

    console.log("USER:", req.user?._id);
    console.log("BODY:", req.body);

    // ---------------------------------------------------
    // CHECK USER
    // ---------------------------------------------------

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // ---------------------------------------------------
    // CHECK TARGET ROLE
    // ---------------------------------------------------

    const targetRole = req.body?.targetRole;

    if (
      typeof targetRole !== "string" ||
      !targetRole.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Target role is required",
      });
    }

    const cleanRole = targetRole.trim();

    console.log("TARGET ROLE:", cleanRole);

    // ---------------------------------------------------
    // GEMINI
    // ---------------------------------------------------

    console.log("Calling Gemini...");

    /*
      IMPORTANT:

      Use your existing geminiHelper here.

      The helper should return parsed JSON.
    */

    const { generateAI } = require("../utils/geminiHelper");

    const prompt = `
You are an expert career roadmap generator.

Create a detailed learning roadmap for this target role:

${cleanRole}

The roadmap must focus specifically on the target role.

Return ONLY valid JSON.

Use exactly this structure:

{
  "roadmapTitle": "string",
  "phases": [
    {
      "title": "string",
      "duration": "string",
      "topics": ["string"],
      "projects": ["string"],
      "resources": ["string"]
    }
  ]
}

Requirements:

- Create 5 to 6 learning phases.
- Focus specifically on ${cleanRole}.
- Every phase must contain useful topics.
- Every phase must contain practical projects.
- Every phase must contain useful learning resources.
- Duration should be realistic.
- Topics must be specific to the target role.
- Projects must be practical and portfolio-friendly.
- Resources should be useful learning resources.
- Do not generate unrelated AI/ML topics unless the target role requires them.
- Do not use markdown.
- Do not use code fences.
- Return JSON only.
`;

    const aiResult = await generateAI(prompt);

    console.log("RAW AI RESULT:");
    console.log(aiResult);

    // ---------------------------------------------------
    // PARSE AI RESULT
    // ---------------------------------------------------

    let aiRoadmap;

    if (typeof aiResult === "string") {
      aiRoadmap = JSON.parse(
        aiResult
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim()
      );
    } else {
      aiRoadmap = aiResult;
    }

    console.log("PARSED AI ROADMAP:");
    console.log(
      JSON.stringify(
        aiRoadmap,
        null,
        2
      )
    );

    // ---------------------------------------------------
    // VALIDATE AI RESPONSE
    // ---------------------------------------------------

    if (
      !aiRoadmap ||
      !Array.isArray(aiRoadmap.phases)
    ) {
      return res.status(500).json({
        success: false,
        message:
          "AI roadmap does not contain valid phases",
      });
    }

    // ---------------------------------------------------
    // NORMALIZE PHASES
    // ---------------------------------------------------

    const phases = aiRoadmap.phases
      .map((phase) => {
        if (
          !phase ||
          typeof phase !== "object"
        ) {
          return null;
        }

        const topics =
          Array.isArray(phase.topics)
            ? phase.topics
                .map((item) =>
                  String(item).trim()
                )
                .filter(Boolean)
            : [];

        const projects =
          Array.isArray(phase.projects)
            ? phase.projects
                .map((item) =>
                  String(item).trim()
                )
                .filter(Boolean)
            : [];

        const resources =
          Array.isArray(phase.resources)
            ? phase.resources
                .map((item) =>
                  String(item).trim()
                )
                .filter(Boolean)
            : [];

        return {
          title:
            String(
              phase.title ||
                "Learning Phase"
            ).trim(),

          duration:
            String(
              phase.duration ||
                "Flexible"
            ).trim(),

          topics,

          projects,

          resources,

          completed: false,
        };
      })
      .filter(Boolean);

    // ---------------------------------------------------
    // CHECK PHASES
    // ---------------------------------------------------

    if (phases.length === 0) {
      return res.status(500).json({
        success: false,
        message:
          "AI generated roadmap contains no phases",
      });
    }

    console.log("NORMALIZED PHASES:");

    console.log(
      JSON.stringify(
        phases,
        null,
        2
      )
    );

    // ---------------------------------------------------
    // DELETE OLD ROADMAP
    // ---------------------------------------------------

    console.log(
      "Removing previous roadmap..."
    );

    await Roadmap.deleteMany({
      user: req.user._id,
    });

    // ---------------------------------------------------
    // CREATE ROADMAP
    // ---------------------------------------------------

    console.log(
      "Saving roadmap to MongoDB..."
    );

    const roadmap =
      await Roadmap.create({
        user: req.user._id,

        targetRole: cleanRole,

        roadmapTitle:
          aiRoadmap.roadmapTitle ||
          `${cleanRole} Career Roadmap`,

        phases,
      });

    console.log(
      "ROADMAP SAVED:"
    );

    console.log(
      roadmap._id
    );

    console.log(
      "======================================"
    );

    console.log(
      "ROADMAP GENERATION SUCCESS"
    );

    console.log(
      "======================================"
    );

    // ---------------------------------------------------
    // RESPONSE
    // ---------------------------------------------------

    return res.status(201).json({
      success: true,

      message:
        "Roadmap generated successfully",

      roadmap,
    });
  } catch (error) {
    console.error(
      "======================================"
    );

    console.error(
      "ROADMAP GENERATION ERROR"
    );

    console.error(error);

    console.error(
      "======================================"
    );

    const message =
      error?.message ||
      "Failed to generate roadmap";

    // ---------------------------------------------------
    // GEMINI 503
    // ---------------------------------------------------

    if (
      message.includes("503") ||
      message.includes("UNAVAILABLE") ||
      message.includes("high demand")
    ) {
      return res.status(503).json({
        success: false,
        message:
          "AI service is temporarily busy. Please try again.",
      });
    }

    // ---------------------------------------------------
    // GEMINI MODEL ERROR
    // ---------------------------------------------------

    if (
      message.includes("NOT_FOUND") ||
      message.toLowerCase().includes("model")
    ) {
      return res.status(503).json({
        success: false,
        message:
          "Gemini AI model is unavailable. Please check the configured model.",
      });
    }

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

// =====================================================
// GET ROADMAP
// =====================================================

const getRoadmapController = async (
  req,
  res
) => {
  try {
    console.log(
      "======================================"
    );

    console.log(
      "GET ROADMAP"
    );

    console.log(
      "USER:",
      req.user?._id
    );

    console.log(
      "======================================"
    );

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const roadmap =
      await Roadmap.findOne({
        user: req.user._id,
      }).sort({
        createdAt: -1,
      });

    if (!roadmap) {
      console.log(
        "NO ROADMAP FOUND"
      );

      return res.status(200).json({
        success: true,
        roadmap: null,
        message:
          "No roadmap found",
      });
    }

    console.log(
      "ROADMAP FOUND:",
      roadmap._id
    );

    return res.status(200).json({
      success: true,
      roadmap,
    });
  } catch (error) {
    console.error(
      "GET ROADMAP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to get roadmap",
    });
  }
};

// =====================================================
// UPDATE PHASE COMPLETION
// =====================================================

const updatePhaseCompletionController =
  async (req, res) => {
    try {
      const { phaseId } =
        req.params;

      const { completed } =
        req.body;

      console.log(
        "UPDATE PHASE:"
      );

      console.log(
        "PHASE ID:",
        phaseId
      );

      console.log(
        "COMPLETED:",
        completed
      );

      if (!req.user?._id) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required",
        });
      }

      if (!phaseId) {
        return res.status(400).json({
          success: false,
          message:
            "Phase ID is required",
        });
      }

      const roadmap =
        await Roadmap.findOne({
          user: req.user._id,
        });

      if (!roadmap) {
        return res.status(404).json({
          success: false,
          message:
            "Roadmap not found",
        });
      }

      const phase =
        roadmap.phases.id(
          phaseId
        );

      if (!phase) {
        return res.status(404).json({
          success: false,
          message:
            "Phase not found",
        });
      }

      phase.completed =
        Boolean(completed);

      await roadmap.save();

      return res.status(200).json({
        success: true,
        message:
          "Phase updated successfully",
        roadmap,
      });
    } catch (error) {
      console.error(
        "PHASE UPDATE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error?.message ||
          "Failed to update phase",
      });
    }
  };

module.exports = {
  generateRoadmapController,
  getRoadmapController,
  updatePhaseCompletionController,
};