require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");
const { generateAI } = require("./geminiHelper");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateInterviewQuestions = async (resumeText) => {
  try {
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

Requirements:
- Generate 5 to 10 questions.
- Questions should be related to the candidate's resume.
- Include technical and practical questions.
- Include different difficulty levels.
- Return valid JSON only.
- Do not use markdown.
- Do not use code fences.

Resume:

${resumeText}
`;

    console.log("Calling Gemini Interview Generator...");

    const result = await generateAI(ai, prompt);

    console.log(
      "Gemini Interview Model:",
      result.model
    );

    let responseText = result.text;

    if (!responseText) {
      throw new Error(
        "Gemini returned an empty interview response"
      );
    }

    console.log("Gemini Interview Response:");
    console.log(responseText);

    responseText = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const interviewData =
      JSON.parse(responseText);

    return interviewData;

  } catch (error) {
    console.error(
      "Gemini Interview Generator Error:",
      error.message
    );

    throw error;
  }
};

module.exports = generateInterviewQuestions;