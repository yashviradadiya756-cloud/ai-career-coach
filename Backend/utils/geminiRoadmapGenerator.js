const { generateContent } = require("../config/gemini");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateRoadmap = async (targetRole) => {
  try {
    console.log("🤖 Gemini Roadmap Generator");
    console.log("Target Role:", targetRole);

    const prompt = `
    You are a career roadmap generator.

    TARGET ROLE:
    "${targetRole}"

    IMPORTANT:
    The target role is EXACTLY "${targetRole}".

    Generate a roadmap ONLY for "${targetRole}".

    Do not change, reinterpret, replace, or generalize the target role.

    If TARGET ROLE is:
    "Full Stack Developer"

    then the roadmap MUST be about:
    - HTML
    - CSS
    - JavaScript
    - React
    - Node.js
    - Express.js
    - REST APIs
    - MongoDB
    - SQL
    - Authentication
    - Git/GitHub
    - Deployment
    - Full-stack projects

    DO NOT generate:
    - Machine Learning
    - Deep Learning
    - Artificial Intelligence
    - Neural Networks
    - TensorFlow
    - PyTorch
    - Data Science

    unless the TARGET ROLE explicitly asks for those technologies.

    Candidate missing skills:
    ${missingSkills.length > 0
      ? missingSkills.join(", ")
      : "No missing skills available"}

    Create 5 to 6 learning phases.

    Return ONLY valid JSON:

    {
      "roadmapTitle": "${targetRole} Roadmap",
      "phases": [
        {
          "title": "",
          "duration": "",
          "topics": [],
          "projects": [],
          "resources": [],
          "completed": false
        }
      ]
    }
    `;

    const response = await generateContent(prompt);

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