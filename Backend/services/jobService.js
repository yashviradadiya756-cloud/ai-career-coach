require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateJobs = async (resumeText) => {
  const prompt = `
You are an expert Career Coach.

Based on the resume below, recommend the top 10 suitable jobs.

Return ONLY valid JSON.

{
  "jobs":[
    {
      "title":"",
      "companyType":"",
      "experience":"",
      "salary":"",
      "skills":[
        ""
      ],
      "description":""
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

module.exports = { generateJobs };