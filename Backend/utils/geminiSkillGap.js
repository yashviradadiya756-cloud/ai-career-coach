const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function analyzeSkillGap(resumeText, targetRole) {
  const prompt = `
You are an AI Career Coach.

Analyze the following resume for the target role.

Resume:
${resumeText}

Target Role:
${targetRole}

Return ONLY valid JSON.

Expected format:

{
  "readinessScore": 78,
  "currentSkills": [
    "React",
    "Node.js",
    "Express.js",
    "MongoDB"
  ],
  "missingSkills": [
    "Docker",
    "AWS",
    "System Design"
  ],
  "recommendedCourses": [
    "Docker Masterclass",
    "AWS Cloud Practitioner",
    "System Design Basics"
  ],
  "roadmap": [
    "Strengthen JavaScript",
    "Learn Docker",
    "Learn AWS",
    "Build Full Stack Projects",
    "Practice Interviews"
  ]
}

Rules:
1. Return ONLY JSON.
2. No markdown.
3. No explanation.
4. No extra text.
5. readinessScore must be a number between 0 and 100.
`;

  let lastError;

  for (let i = 0; i < 3; i++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      let text = "";

      if (typeof response.text === "function") {
        text = response.text();
      } else {
        text = response.text || "";
      }

      console.log("========== GEMINI RESPONSE ==========");
      console.log(text);
      console.log("=====================================");

      text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const match = text.match(/\{[\s\S]*\}/);

      if (!match) {
        throw new Error("Gemini did not return JSON.");
      }

      const result = JSON.parse(match[0]);

      return {
        readinessScore: result.readinessScore || 0,
        currentSkills: result.currentSkills || [],
        missingSkills: result.missingSkills || [],
        recommendedCourses: result.recommendedCourses || [],
        roadmap: result.roadmap || [],
      };
    } catch (err) {
      console.log("Gemini Error:");
      console.log(err);

      lastError = err;

      if (
        err.message &&
        (err.message.includes("503") ||
          err.message.includes("UNAVAILABLE"))
      ) {
        console.log(`Retry ${i + 1}/3...`);
        await sleep(3000);
        continue;
      }

      throw err;
    }
  }

  throw lastError;
}

module.exports = analyzeSkillGap;