const {
  GoogleGenAI,
} = require("@google/genai");

require("dotenv").config();

// =====================================================
// API KEY
// =====================================================

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error(
    "GEMINI_API_KEY is missing."
  );
}

// =====================================================
// CLIENT
// =====================================================

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

// =====================================================
// CURRENT MODEL
// =====================================================

const GEMINI_MODEL =
  "gemini-3.6-flash";

// =====================================================
// GENERATE
// =====================================================

const generateContent = async (
  prompt
) => {
  try {
    console.log(
      "Gemini model:",
      GEMINI_MODEL
    );

    const response =
      await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

    return response;
  } catch (error) {
    console.error(
      "Gemini generation error:"
    );

    console.error(
      error.message
    );

    throw error;
  }
};

module.exports = {
  ai,
  GEMINI_MODEL,
  generateContent,
};