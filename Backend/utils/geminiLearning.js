const ai = require("../config/gemini");

async function generateLearningRecommendations(missingSkills, targetRole) {
  try {
    const prompt = `
You are an AI Career Coach.

Target Role:
${targetRole}

Missing Skills:
${missingSkills.join(", ")}

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
      model: "gemini-2.5-flash", // Replace with your working Gemini model
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