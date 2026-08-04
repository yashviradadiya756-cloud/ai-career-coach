const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateRoadmap = async (targetRole) => {
  try {
    console.log("🤖 Gemini Roadmap Generator");
    console.log("Target Role:", targetRole);

    const prompt = `
You are an expert career roadmap generator.

Create a detailed learning roadmap for this target role:

${targetRole}

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
- Each phase must have useful topics.
- Each phase must have practical projects.
- Each phase must have learning resources.
- Duration should be realistic.
- Projects should be relevant to the target role.
- Do not use markdown.
- Do not use code fences.
- Return JSON only.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text;

    console.log("RAW GEMINI RESPONSE:");
    console.log(text);

    // Remove markdown code fences if Gemini adds them
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const roadmap = JSON.parse(text);

    console.log("✅ Roadmap JSON parsed successfully");

    return roadmap;
  } catch (error) {
    console.error("❌ Gemini Roadmap Generator Error:");
    console.error(error);

    throw new Error(
      error.message || "Failed to generate roadmap"
    );
  }
};

module.exports = generateRoadmap;