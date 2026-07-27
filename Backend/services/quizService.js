require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateQuiz = async (resumeText) => {
  const prompt = `
You are an expert technical interviewer.

Based on the resume below, generate a technical quiz.

Return ONLY valid JSON.

{
  "title": "",
  "questions": [
    {
      "question": "",
      "options": [
        "",
        "",
        "",
        ""
      ],
      "correctAnswer": ""
    }
  ]
}

Generate exactly 10 multiple-choice questions.

Resume:
${resumeText}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
  });

  return JSON.parse(response.text);
};

module.exports = { generateQuiz };