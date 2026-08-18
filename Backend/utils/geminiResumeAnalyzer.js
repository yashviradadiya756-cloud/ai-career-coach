const { GoogleGenAI } = require("@google/genai");
const { generateAI } = require("./geminiHelper");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const analyzeResume = async (resumeText) => {
  try {
    const prompt = `
    You are an AI Resume Analyzer.

    Analyze this resume:

    ${resumeText}

    Return ONLY valid JSON format:

    {
      "atsScore": 0,
      "strengths": [],
      "weaknesses": [],
      "missingSkills": [],
      "suggestions": []
    }

    Do not use markdown.
    Do not use code fences.
    Return JSON only.
    `;

    console.log("Calling Gemini Resume Analyzer...");

    // Automatic retry + model fallback
    const result = await generateAI(ai, prompt);

    console.log("Gemini model used:", result.model);

    // Get actual Gemini response
    let responseText = result.text;

    if (!responseText) {
      throw new Error("Gemini returned an empty response");
    }

    console.log("Gemini Resume Response:");
    console.log(responseText);

    // Remove markdown/code fences if Gemini adds them
    responseText = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Convert JSON string to JavaScript object
    const analysis = JSON.parse(responseText);

    return analysis;

  } catch (error) {
    console.log("Gemini Resume Analyzer Error:");
    console.log(error.message);

    throw error;
  }
};

module.exports = analyzeResume;