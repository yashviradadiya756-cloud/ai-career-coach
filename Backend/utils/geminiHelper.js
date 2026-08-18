const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// =====================================================
// GENERATE AI
// =====================================================

const generateAI = async (prompt) => {
  try {
    console.log(
      "===================================="
    );

    console.log(
      "GEMINI AI REQUEST"
    );

    console.log(
      "===================================="
    );

    const models = [
      "gemini-2.5-flash",
      "gemini-3.5-flash",
      "gemini-3.6-flash",
    ];

    let lastError = null;

    for (const model of models) {
      try {
        console.log(
          `Trying Gemini model: ${model}`
        );

        const response =
          await ai.models.generateContent({
            model,
            contents: prompt,
          });

        const text =
          response?.text;

        if (!text) {
          throw new Error(
            "Gemini returned empty response"
          );
        }

        console.log(
          `Gemini success with model: ${model}`
        );

        console.log(
          "===================================="
        );

        return text
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim();
      } catch (error) {
        lastError = error;

        console.error(
          `Gemini model ${model} failed:`,
          error?.message
        );

        // Try next model
        continue;
      }
    }

    throw lastError ||
      new Error(
        "All Gemini models failed"
      );
  } catch (error) {
    console.error(
      "GEMINI HELPER ERROR:"
    );

    console.error(
      error
    );

    throw error;
  }
};

module.exports = {
  generateAI,
};