const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


const analyzeResume = async (resumeText) => {
  try {

    const prompt = `
You are an AI Resume Analyzer.

Analyze this resume:

${resumeText}

Return ONLY JSON format:

{
  "atsScore": 0,
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "suggestions": []
}
`;


    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });


    let responseText = response.text;


    console.log("Gemini Resume Response:");
    console.log(responseText);


    responseText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();


    const analysis = JSON.parse(responseText);


    return analysis;


  } catch (error) {

    console.log("Gemini Resume Analyzer Error:");
    console.log(error.message);

    throw error;
  }
};


module.exports = analyzeResume;