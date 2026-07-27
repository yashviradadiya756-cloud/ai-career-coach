require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateInterview = async (resumeText) => {
  const prompt = `
You are an experienced technical interviewer.

Based on the following resume, generate a mock interview.

Return ONLY valid JSON.

{
  "role": "",
  "questions": [
    {
      "question": "",
      "difficulty": "",
      "answer": ""
    }
  ]
}

Resume:
${resumeText}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
  });

  return JSON.parse(response.text);
};

module.exports = { generateInterview };