const ai = require("../config/gemini");

async function generateInterviewQuestions(targetRole) {
  try {
    const prompt = `
You are an AI technical interviewer.

Generate 10 interview questions for the following target role:

${targetRole}

Questions should include:
- Technical questions
- Conceptual questions
- Project-related questions
- Problem-solving questions
- Real-world scenario questions

Return ONLY valid JSON.

{
  "questions": [
    {
      "question": "Question here"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    let text = response.text;

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("Invalid Gemini interview response");
    }

    return JSON.parse(match[0]);

  } catch (error) {
    console.log("Gemini Interview Error:", error.message);
    throw error;
  }
}

module.exports = generateInterviewQuestions;