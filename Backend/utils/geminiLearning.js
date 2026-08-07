const { generateContent } = require("../config/gemini");

async function generateLearningRecommendations(
  missingSkills,
  targetRole
) {
  try {
    const skills = Array.isArray(missingSkills)
      ? missingSkills.join(", ")
      : String(missingSkills);

    const prompt = `
You are an AI Career Coach.

Target Role:
${targetRole}

Missing Skills:
${skills}

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

Important:
- Return ONLY JSON.
- Do not use markdown.
- Do not add explanations before or after JSON.
- Give one recommendation for each missing skill.
`;

    console.log("================================");
    console.log("LEARNING AI REQUEST");
    console.log("Target Role:", targetRole);
    console.log("Missing Skills:", missingSkills);
    console.log("================================");

    const response = await generateContent(prompt);

    let text = response.text;

    console.log("Gemini Learning Raw Response:");
    console.log(text);

    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const data = JSON.parse(text);

    if (
      !data ||
      !Array.isArray(data.recommendations)
    ) {
      throw new Error(
        "Gemini returned invalid learning recommendation format."
      );
    }

    console.log(
      "Learning Recommendations:",
      data.recommendations.length
    );

    return data;

  } catch (error) {
    console.log("Learning AI Error:", error);
    throw error;
  }
}

module.exports = generateLearningRecommendations;

