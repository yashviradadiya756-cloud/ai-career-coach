const fs = require("fs");
const pdfParse = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");

console.log("🔥 resumeAnalyzer.js LOADED");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const analyzeResume = async (filePath) => {
  try {
    console.log("=================================");
    console.log("🔥 AI RESUME ANALYSIS STARTED");
    console.log("=================================");

    // Check PDF
    if (!fs.existsSync(filePath)) {
      throw new Error("Resume PDF file not found");
    }

    console.log("🔥 Resume file:", filePath);

    // Read PDF
    const dataBuffer = fs.readFileSync(filePath);

    console.log("🔥 PDF loaded");

    const pdfData = await pdfParse(dataBuffer);

    const resumeText = pdfData.text?.trim();

    if (!resumeText) {
      throw new Error("Could not extract text from resume PDF");
    }

    console.log("🔥 Resume text extracted");
    console.log("🔥 Text length:", resumeText.length);

    const prompt = `
You are an expert ATS resume analyzer and career coach.

Analyze this resume carefully.

Return ONLY valid JSON.

Required format:

{
  "atsScore": 0,
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "suggestions": []
}

Rules:

- atsScore must be an integer from 0 to 100.
- strengths must contain 3 to 6 strings.
- weaknesses must contain 3 to 6 strings.
- missingSkills must contain 2 to 6 strings.
- suggestions must contain 3 to 6 strings.
- Every array item must be a simple string.
- Do not return objects inside arrays.
- Do not use markdown.
- Do not use code fences.
- Do not add explanations.

Resume:

${resumeText}
`;

    console.log("🔥 Sending resume to Gemini...");

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
        });
    console.log("🔥 Gemini response received");

    let result = response.text;

    if (!result) {
      throw new Error("Empty response received from Gemini");
    }

    result = result
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    console.log("🔥 Gemini cleaned response:");
    console.log(result);

    let analysis;

    try {
      analysis = JSON.parse(result);
    } catch (error) {
      console.error("🔥 GEMINI JSON PARSE ERROR");
      console.error(error);
      console.error("RAW RESPONSE:", result);

      throw new Error("Gemini returned invalid JSON");
    }

    const normalized = {
      atsScore: Number(analysis.atsScore) || 0,

      strengths: Array.isArray(analysis.strengths)
        ? analysis.strengths.map((item) => String(item))
        : [],

      weaknesses: Array.isArray(analysis.weaknesses)
        ? analysis.weaknesses.map((item) => String(item))
        : [],

      missingSkills: Array.isArray(analysis.missingSkills)
        ? analysis.missingSkills.map((item) => String(item))
        : [],

      suggestions: Array.isArray(analysis.suggestions)
        ? analysis.suggestions.map((item) => String(item))
        : [],

      resumeText,
    };

    normalized.atsScore = Math.max(
      0,
      Math.min(100, normalized.atsScore)
    );

    console.log("=================================");
    console.log("🔥 AI ANALYSIS SUCCESS");
    console.log("ATS Score:", normalized.atsScore);
    console.log("Strengths:", normalized.strengths.length);
    console.log("Weaknesses:", normalized.weaknesses.length);
    console.log("Missing Skills:", normalized.missingSkills.length);
    console.log("Suggestions:", normalized.suggestions.length);
    console.log("=================================");

    return normalized;
  } catch (error) {
    console.error("=================================");
    console.error("🔥 AI RESUME ANALYSIS FAILED");
    console.error("=================================");
    console.error(error);

    throw error;
  }
};

module.exports = analyzeResume;