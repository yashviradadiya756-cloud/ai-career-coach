require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateRoadmap = async (resumeText) => {
const prompt = `
You are an expert Career Coach.

Based on the resume below, generate a learning roadmap.

Return ONLY valid JSON.

{
  "careerRole":"",
  "estimatedDuration":"",
  "steps":[
    {
      "title":"",
      "description":"",
      "resources":[]
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

module.exports = { generateRoadmap };