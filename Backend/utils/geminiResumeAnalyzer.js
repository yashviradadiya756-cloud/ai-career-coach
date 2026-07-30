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

    console.log("Calling Gemini with model: gemini-flash-latest");

    const result = await model.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt
  });

    console.log("Response:", response);

    console.log("Gemini call successful");

    let text = response.text;

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(text);

  } catch (err) {
  console.error("========== GEMINI ERROR ==========");
  console.error(err);
  console.error("Message:", err.message);
  console.error("Status:", err.status);
  console.error("Stack:", err.stack);

  throw err;
}
}

module.exports = analyzeResume;