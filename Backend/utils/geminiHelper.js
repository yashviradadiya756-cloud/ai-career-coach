const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// =====================================================
// GENERATE AI
// =====================================================

const generateAI = async (prompt) => {
  const models = [
    "gemini-3.8-flash",
    "gemini-3.5-flash-lite",
  ];

  let lastError = null;

  for (const model of models) {
    try {
      console.log("====================================");
      console.log("GEMINI AI REQUEST");
      console.log("Trying Gemini model:", model);
      console.log("====================================");

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      const text = response?.text;

      if (!text) {
        throw new Error("Gemini returned an empty response");
      }

      console.log("Gemini success with model:", model);

      return text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
    } catch (error) {
      lastError = error;

      console.error(
        `Gemini model ${model} failed:`,
        error?.message || error
      );
    }
  }

  throw lastError || new Error("All Gemini models failed");
};

module.exports = {
  generateAI,
};
