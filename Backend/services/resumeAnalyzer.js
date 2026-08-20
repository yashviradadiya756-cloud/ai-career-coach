const fs = require("fs");
const pdfParse = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// =====================================================
// ANALYZE RESUME
// =====================================================

const analyzeResume = async (filePath) => {
  try {
    console.log("=================================");
    console.log("AI RESUME ANALYSIS STARTED");
    console.log("=================================");

    // -----------------------------------------------
    // CHECK FILE
    // -----------------------------------------------

    if (!fs.existsSync(filePath)) {
      throw new Error("Resume PDF file not found");
    }

    console.log("Resume file:", filePath);

    // -----------------------------------------------
    // READ PDF
    // -----------------------------------------------

    const dataBuffer = fs.readFileSync(filePath);

    const pdfData = await pdfParse(dataBuffer);

    const resumeText = pdfData.text?.trim();

    if (!resumeText) {
      throw new Error("Could not extract text from resume PDF");
    }

    console.log("Resume text extracted");
    console.log("Text length:", resumeText.length);

    // -----------------------------------------------
    // GEMINI PROMPT
    // -----------------------------------------------

    const prompt = `
You are an expert ATS resume analyzer and career coach.

Analyze the following resume carefully.

Return ONLY valid JSON.
Do not use markdown.
Do not use code fences.
Do not add any explanation outside JSON.

Required JSON structure:

{
  "atsScore": 0,
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "suggestions": []
}

Rules:

1. atsScore must be an integer between 0 and 100.
2. strengths must contain 3 to 6 useful points.
3. weaknesses must contain 3 to 6 useful points.
4. missingSkills must contain relevant technical or professional skills that would improve the candidate's profile.
5. suggestions must contain 3 to 6 actionable resume improvement suggestions.
6. Keep every array item as a simple string.
7. Do not return objects inside arrays.
8. Do not return markdown.
9. Do not return comments.

Resume:

${resumeText}
`;

    console.log("Sending resume to Gemini...");

    // -----------------------------------------------
    // GEMINI REQUEST
    // -----------------------------------------------

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let result = response.text;

    console.log("Gemini response received");

    if (!result) {
      throw new Error("Empty response received from Gemini");
    }

    // -----------------------------------------------
    // CLEAN RESPONSE
    // -----------------------------------------------

    result = result
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    console.log("Cleaned Gemini response:");
    console.log(result);

    // -----------------------------------------------
    // PARSE JSON
    // -----------------------------------------------

    let analysis;

    try {
      analysis = JSON.parse(result);
    } catch (jsonError) {
      console.error("GEMINI JSON PARSE ERROR:", jsonError);
      console.error("RAW RESPONSE:", result);

      throw new Error("Gemini returned invalid JSON");
    }

    // -----------------------------------------------
    // NORMALIZE DATA
    // -----------------------------------------------

    const normalized = {
      atsScore: Number(analysis.atsScore) || 0,

      strengths: Array.isArray(analysis.strengths)
        ? analysis.strengths.map(String)
        : [],

      weaknesses: Array.isArray(analysis.weaknesses)
        ? analysis.weaknesses.map(String)
        : [],

      missingSkills: Array.isArray(analysis.missingSkills)
        ? analysis.missingSkills.map(String)
        : [],

      suggestions: Array.isArray(analysis.suggestions)
        ? analysis.suggestions.map(String)
        : [],

      resumeText,
    };

    // Keep score between 0 and 100
    normalized.atsScore = Math.max(
      0,
      Math.min(100, normalized.atsScore)
    );

    console.log("=================================");
    console.log("AI ANALYSIS SUCCESS");
    console.log("ATS Score:", normalized.atsScore);
    console.log("Strengths:", normalized.strengths.length);
    console.log("Weaknesses:", normalized.weaknesses.length);
    console.log("Missing Skills:", normalized.missingSkills.length);
    console.log("Suggestions:", normalized.suggestions.length);
    console.log("=================================");

    return normalized;
  } catch (error) {
    console.error("=================================");
    console.error("AI RESUME ANALYSIS FAILED");
    console.error("=================================");
    console.error(error);

    throw error;
  }
};

module.exports = analyzeResume;