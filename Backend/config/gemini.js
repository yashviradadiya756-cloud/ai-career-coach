const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const PRIMARY_MODEL =
  process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

const FALLBACK_MODEL =
  process.env.GEMINI_FALLBACK_MODEL || "gemini-3.6-flash";

console.log("================================");
console.log("GEMINI CONFIG");
console.log("Primary Model:", PRIMARY_MODEL);
console.log("Fallback Model:", FALLBACK_MODEL);
console.log("================================");

const generateContent = async (contents, options = {}) => {
  try {
    console.log(
      `Trying primary model: ${PRIMARY_MODEL}`
    );

    const response = await ai.models.generateContent({
      model: PRIMARY_MODEL,
      contents,
      ...options,
    });

    console.log(
      `Primary Gemini model succeeded: ${PRIMARY_MODEL}`
    );

    return response;

  } catch (primaryError) {

    console.log(
      `Primary Gemini model failed (${PRIMARY_MODEL})`
    );

    console.log(
      primaryError?.message || primaryError
    );

    // Try fallback for temporary Gemini errors
    if (
      primaryError?.status === 503 ||
      primaryError?.status === 429 ||
      primaryError?.status === 500
    ) {

      console.log(
        `Trying fallback model: ${FALLBACK_MODEL}`
      );

      try {

        const response = await ai.models.generateContent({
          model: FALLBACK_MODEL,
          contents,
          ...options,
        });

        console.log(
          `Fallback Gemini model succeeded: ${FALLBACK_MODEL}`
        );

        return response;

      } catch (fallbackError) {

        console.log(
          `Fallback Gemini model also failed: ${FALLBACK_MODEL}`
        );

        console.log(
          fallbackError?.message || fallbackError
        );

        throw fallbackError;
      }
    }

    throw primaryError;
  }
};

module.exports = {
  ai,
  generateContent,
  PRIMARY_MODEL,
  FALLBACK_MODEL,
};