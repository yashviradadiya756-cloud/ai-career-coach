const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

// =====================================================
// ENVIRONMENT
// =====================================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log("=================================");
console.log("GEMINI CONFIG");
console.log("=================================");

console.log(
  "GEMINI_API_KEY EXISTS:",
  !!GEMINI_API_KEY
);

console.log(
  "GEMINI_API_KEY LENGTH:",
  GEMINI_API_KEY
    ? GEMINI_API_KEY.length
    : 0
);

// =====================================================
// VALIDATE API KEY
// =====================================================

if (!GEMINI_API_KEY) {
  throw new Error(
    "GEMINI_API_KEY is not configured"
  );
}

// =====================================================
// CLIENT
// =====================================================

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

// =====================================================
// MODEL
// =====================================================

const PRIMARY_MODEL = "gemini-3.6-flash";

// =====================================================
// GENERATE CONTENT
// =====================================================

const generateContent = async (prompt) => {
  try {
    console.log("=================================");
    console.log("GEMINI REQUEST");
    console.log("MODEL:", PRIMARY_MODEL);
    console.log("=================================");

    const response =
      await ai.models.generateContent({
        model: PRIMARY_MODEL,
        contents: prompt,
      });

    console.log(
      "Gemini request successful"
    );

    return response;
  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "GEMINI GENERATION ERROR"
    );

    console.error(
      error?.message || error
    );

    console.error(
      "================================="
    );

    throw error;
  }
};

module.exports = {
  ai,
  generateContent,
  PRIMARY_MODEL,
};