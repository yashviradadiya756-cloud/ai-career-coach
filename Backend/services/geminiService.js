require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const analyzeResume = async (resumeText) => {
  try {
    const prompt = `
You are an expert AI Career Coach.

Analyze the following resume.

Return ONLY valid JSON.

{
  "score": 0,
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "careerSuggestions": []
}

Resume:

${resumeText}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return response.text;

 } catch (error) {
  console.log("========== GEMINI ERROR ==========");

  console.log("Message:", error.message);

  console.log("Stack:", error.stack);

  console.log("Full Error:", error);

  throw error;
}
};

module.exports = { analyzeResume };