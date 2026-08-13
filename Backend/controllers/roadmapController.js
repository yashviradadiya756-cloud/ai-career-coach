const { GoogleGenAI } = require("@google/genai");

const Roadmap = require("../models/Roadmap");

// =====================================================
// GEMINI
// =====================================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

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

    const targetRole = req.body?.targetRole;

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

    if (!targetRole || !targetRole.trim()) {
      return res.status(400).json({
        success: false,
        message: "Target role is required",
      });
    }

    const cleanRole = targetRole.trim();

    console.log("TARGET ROLE:", cleanRole);

    // ---------------------------------------------------
    // PROMPT
    // ---------------------------------------------------

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
      "resources": ["string"],
      "completed": false
    }
  ]
}

Requirements:

- Create 5 to 6 learning phases.
- The roadmap must be suitable for a Full Stack Developer career when the target role is Full Stack Developer.
- Include frontend development.
- Include backend development.
- Include databases.
- Include APIs.
- Include authentication.
- Include Git/GitHub.
- Include deployment.
- Include practical projects.
- Every phase must have useful topics.
- Every phase must have practical projects.
- Every phase must have learning resources.
- Duration should be realistic.
- Do not generate AI/ML topics unless the target role explicitly requires them.
- Do not use markdown.
- Do not use code fences.
- Return JSON only.
`;

    // ---------------------------------------------------
    // GEMINI REQUEST
    // ---------------------------------------------------

    console.log("Calling Gemini...");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    let text = response.text;

    console.log("RAW GEMINI RESPONSE:");
    console.log(text);

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    // ---------------------------------------------------
    // CLEAN RESPONSE
    // ---------------------------------------------------

    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // ---------------------------------------------------
    // PARSE JSON
    // ---------------------------------------------------

    let aiRoadmap;

    try {
      aiRoadmap = JSON.parse(text);
    } catch (parseError) {
      console.error("GEMINI JSON PARSE ERROR:");
      console.error(parseError);
      console.error("TEXT:", text);

      return res.status(500).json({
        success: false,
        message: "AI returned invalid roadmap data",
      });
    }

    console.log("PARSED AI ROADMAP:");
    console.log(JSON.stringify(aiRoadmap, null, 2));

    // ---------------------------------------------------
    // VALIDATE PHASES
    // ---------------------------------------------------

    if (
      !aiRoadmap ||
      !Array.isArray(aiRoadmap.phases)
    ) {
      return res.status(500).json({
        success: false,
        message: "AI roadmap does not contain valid phases",
      });
    }

    // ---------------------------------------------------
    // NORMALIZE PHASES
    // ---------------------------------------------------

    const phases = aiRoadmap.phases.map((phase) => ({
      title:
        phase.title ||
        "Learning Phase",

      duration:
        phase.duration ||
        "Flexible",

      topics:
        Array.isArray(phase.topics)
          ? phase.topics
          : [],

      projects:
        Array.isArray(phase.projects)
          ? phase.projects
          : [],

      resources:
        Array.isArray(phase.resources)
          ? phase.resources
          : [],

      completed: false,
    }));

    // ---------------------------------------------------
    // DELETE OLD ROADMAP
    // ---------------------------------------------------

    console.log("Removing previous roadmap...");

    await Roadmap.deleteMany({
      user: req.user._id,
    });

    // ---------------------------------------------------
    // SAVE NEW ROADMAP
    // ---------------------------------------------------

    console.log("Saving new roadmap to MongoDB...");

    const roadmap = await Roadmap.create({
      user: req.user._id,

      targetRole: cleanRole,

      roadmapTitle:
        aiRoadmap.roadmapTitle ||
        `${cleanRole} Career Roadmap`,

      phases,
    });

    console.log("ROADMAP SAVED:");
    console.log(roadmap._id);

    console.log("======================================");
    console.log("ROADMAP GENERATION SUCCESS");
    console.log("======================================");

    // ---------------------------------------------------
    // RESPONSE
    // ---------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Roadmap generated successfully",
      roadmap,
    });
  } catch (error) {
    console.error("======================================");
    console.error("ROADMAP GENERATION ERROR");
    console.error(error);
    console.error("======================================");

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate roadmap",
    });
  }
};

// =====================================================
// GET ROADMAP
// =====================================================

const getRoadmapController = async (req, res) => {
  try {
    console.log("======================================");
    console.log("GET ROADMAP");
    console.log("USER:", req.user?._id);
    console.log("======================================");

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const roadmap = await Roadmap.findOne({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    // ---------------------------------------------------
    // NO ROADMAP
    // ---------------------------------------------------

    if (!roadmap) {
      console.log("NO ROADMAP FOUND FOR USER");

      return res.status(200).json({
        success: true,
        roadmap: null,
        message: "No roadmap found",
      });
    }

    // ---------------------------------------------------
    // ROADMAP FOUND
    // ---------------------------------------------------

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
        error.message ||
        "Failed to get roadmap",
    });
  }
};

// =====================================================
// UPDATE PHASE COMPLETION
// =====================================================

const updatePhaseCompletionController = async (
  req,
  res
) => {
  try {
    const { phaseId } = req.params;
    const { completed } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!phaseId) {
      return res.status(400).json({
        success: false,
        message: "Phase ID is required",
      });
    }

    const roadmap = await Roadmap.findOne({
      user: req.user._id,
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found",
      });
    }

    const phase = roadmap.phases.id(phaseId);

    if (!phase) {
      return res.status(404).json({
        success: false,
        message: "Phase not found",
      });
    }

    phase.completed = Boolean(completed);

    await roadmap.save();

    return res.status(200).json({
      success: true,
      message: "Phase updated successfully",
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
        error.message ||
        "Failed to update phase",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  generateRoadmapController,
  getRoadmapController,
  updatePhaseCompletionController,
};