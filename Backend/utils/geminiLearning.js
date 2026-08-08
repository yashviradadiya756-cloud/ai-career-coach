const { generateContent } = require("../config/gemini");

async function generateLearningRecommendations(
  missingSkills,
  targetRole
) {
  try {
    // Make sure missingSkills is always an array
    const skills = Array.isArray(missingSkills)
      ? missingSkills
      : [];

    if (skills.length === 0) {
      throw new Error("No missing skills available.");
    }

    const prompt = `
You are an AI Career Coach.

Target Role:
${targetRole}

Missing Skills:
${skills.join(", ")}

For EACH missing skill, recommend exactly ONE useful learning resource.

Return ONLY valid JSON.
Do not use markdown.
Do not use \`\`\`.
Do not add explanations.

Required JSON format:

{
  "recommendations": [
    {
      "skill": "Express.js",
      "course": "Express.js Course",
      "platform": "YouTube",
      "duration": "10 hours",
      "level": "Beginner",
      "url": "https://example.com"
    }
  ]
}

Rules:

1. Create exactly one recommendation for every missing skill.
2. The "skill" must match the missing skill.
3. Use real and useful learning platforms.
4. Keep course names relevant to the skill.
5. Return ONLY JSON.
`;

    console.log("================================");
    console.log("LEARNING AI REQUEST");
    console.log("Target Role:", targetRole);
    console.log("Missing Skills:", skills);
    console.log("================================");

    const response = await generateContent(prompt);

    if (!response || !response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    let text = response.text.trim();

    console.log("Gemini Learning Raw Response:");
    console.log(text);

    // Remove markdown code fences safely
    text = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let data;

    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("Gemini JSON Parse Error:");
      console.error(text);

      throw new Error(
        "Gemini returned invalid JSON for learning recommendations."
      );
    }

    if (
      !data ||
      !Array.isArray(data.recommendations)
    ) {
      throw new Error(
        "Gemini returned invalid learning recommendation format."
      );
    }

    // Keep only valid recommendation objects
    const recommendations = data.recommendations
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        skill: item.skill || "",
        course: item.course || "",
        platform: item.platform || "",
        duration: item.duration || "",
        level: item.level || "",
        url: item.url || "",
      }));

    console.log(
      "Learning Recommendations:",
      recommendations.length
    );

    return {
      recommendations,
    };
  } catch (error) {
    console.error("Learning AI Error:", error);
    throw error;
  }
}

module.exports = generateLearningRecommendations;