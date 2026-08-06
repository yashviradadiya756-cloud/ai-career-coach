const { generateContent } = require("../config/gemini");

async function generateLearningRecommendations(
  missingSkills,
  targetRole
) {
  try {
    const skills = Array.isArray(missingSkills)
      ? missingSkills
      : [];

    if (skills.length === 0) {
      throw new Error("No missing skills provided");
    }

    const prompt = `
You are an AI Career Coach.

Target Role:
${targetRole}

Missing Skills:
${skills.join(", ")}

Recommend one high-quality learning resource for EACH missing skill.

Return ONLY valid JSON.
Do not use markdown.
Do not use code fences.

Expected format:

{
  "recommendations": [
    {
      "skill": "Express.js",
      "course": "Course name",
      "platform": "Platform name",
      "duration": "4 weeks",
      "level": "Beginner",
      "url": "https://example.com"
    }
  ]
}

Rules:
- Create exactly one recommendation for each missing skill.
- Use real learning platforms where possible.
- Keep URLs valid.
- Keep course names specific.
- Return JSON only.
`;

    const response = await generateContent(prompt);

    let text = response.text;

    console.log("===== GEMINI RAW LEARNING RESPONSE =====");
    console.log(text);

    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(text);

    return result;

  } catch (error) {
    console.error("Learning AI Error:", error);
    throw error;
  }
}

module.exports = generateLearningRecommendations;