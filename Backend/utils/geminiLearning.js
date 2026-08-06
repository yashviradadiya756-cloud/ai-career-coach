const { generateContent } = require("../config/gemini");

async function generateLearningRecommendations(
  missingSkills,
  targetRole
) {
  try {
    const prompt = `
You are an AI Career Coach.

Target Role:
${targetRole}

Missing Skills:
${
  Array.isArray(missingSkills)
    ? missingSkills.join(", ")
    : String(missingSkills)
}

Recommend one high-quality learning resource for each missing skill.

Return ONLY valid JSON.

{
  "recommendations": [
    {
      "skill": "",
      "course": "",
      "platform": "",
      "duration": "",
      "level": "",
      "url": ""
    }
  ]
}
`;

    console.log("Generating Learning Recommendations...");
    console.log("Target Role:", targetRole);
    console.log("Missing Skills:", missingSkills);

    const response = await generateContent(prompt);

    let text = response.text;

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("Gemini Learning Response:");
    console.log(text);

    return JSON.parse(text);

  } catch (error) {
    console.log("Learning AI Error:", error);
    throw error;
  }
}

module.exports = generateLearningRecommendations;