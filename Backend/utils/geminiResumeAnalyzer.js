const ai = require("../config/gemini");

async function analyzeResume(resumeText) {
  try {
    const prompt = `
You are an ATS Resume Analyzer.

Analyze the following resume and return ONLY JSON.

{
  "atsScore": 0,
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "suggestions": []
}

Resume:
${resumeText}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash"  ,
      contents: prompt,
    });

    let text = response.text;

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(text);

  } catch (err) {
    console.log("Gemini Error:", err);
    throw err;
  }
}

module.exports = analyzeResume;