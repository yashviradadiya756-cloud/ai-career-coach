const ai = require("../config/gemini");

async function askAICoach(question, context = "") {
  try {
    const prompt = `
You are CareerPilot AI Career Coach.

Your job is to help students and job seekers with:

- Career guidance
- Resume improvement
- Skill development
- Learning roadmaps
- Interview preparation
- Projects
- Placement preparation
- Job preparation

User question:
${question}

Additional user context:
${context || "No additional context available."}

Give a helpful, practical and easy-to-understand answer.

Rules:
1. Do not return JSON.
2. Give a normal conversational response.
3. Use headings and bullet points when useful.
4. Give actionable steps.
5. Keep the answer concise but useful.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.log("AI Coach Gemini Error:");
    console.log(error.message);

    throw error;
  }
}

module.exports = askAICoach;