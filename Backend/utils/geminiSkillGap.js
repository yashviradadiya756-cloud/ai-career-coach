const ai = require("../config/gemini");

async function analyzeSkillGap(resumeText, targetRole) {
  try {
    const prompt = `
You are an AI Career Coach.

Analyze the following resume for the target role.

Target Role:
${targetRole}

Resume:
${resumeText}

Return ONLY valid JSON.

{
  "currentSkills": [],
  "missingSkills": [],
  "recommendedCourses": [],
  "roadmap": []
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    let text = response.text;

    // Remove markdown if Gemini wraps the JSON
    text = text.replace(/```json/g, "")
               .replace(/```/g, "")
               .trim();

    return JSON.parse(text);

  } catch (error) {
    console.log("Gemini Skill Gap Error:", error);
    throw error;
  }
}

module.exports = analyzeSkillGap;