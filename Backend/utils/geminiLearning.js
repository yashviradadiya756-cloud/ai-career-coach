const ai = require("../config/gemini");

async function generateLearningRecommendations(missingSkills, targetRole) {
  try {
    const prompt = `
You are an AI Career Coach.

Target Role:
${targetRole}

Missing Skills:
${Array.isArray(missingSkills)
  ? missingSkills.join(", ")
  : String(missingSkills)}

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

    const response = await ai.models.generateContent({
  model: "gemini-3.6-flash",
  contents: prompt,
});

    let text = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);

  } catch (error) {
    console.log("Learning AI Error:", error);
    throw error;
  }
}

module.exports = generateLearningRecommendations;