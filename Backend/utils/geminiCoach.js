const ai = require("../config/gemini");

async function askAICoach(question, context = "") {
  try {
    const prompt = `
You are CareerPilot AI Career Coach.

Help the user with:
- Career guidance
- Resume improvement
- Skill development
- Learning roadmap
- Interview preparation
- Projects
- Placement preparation

User Question:
${question}

User Career Context:
${context}

Give a practical and personalized answer.

Do not return JSON.
Return a normal conversational answer.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return response.text;

  } catch (error) {
    console.log("AI Coach Error:", error.message);
    throw error;
  }
}

module.exports = askAICoach;