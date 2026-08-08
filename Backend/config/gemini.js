const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

// ==========================================
// ENVIRONMENT
// ==========================================

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

// ==========================================
// VALIDATE API KEY
// ==========================================

if (!GEMINI_API_KEY) {
  console.error(
    "❌ GEMINI_API_KEY is missing"
  );

  throw new Error(
    "GEMINI_API_KEY is not configured"
  );
}

// ==========================================
// GEMINI CLIENT
// ==========================================

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

console.log(
  "AI CLIENT CREATED:",
  !!ai
);

console.log(
  "AI MODELS AVAILABLE:",
  !!ai.models
);

console.log("=================================");

// ==========================================
// MODELS
// ==========================================

const PRIMARY_MODEL =
  "gemini-3.5-flash-lite";

const FALLBACK_MODEL =
  "gemini-3.6-flash";

// ==========================================
// GENERATE CONTENT
// ==========================================

const generateContent = async (
  prompt
) => {
  if (!ai) {
    throw new Error(
      "Gemini AI client is not initialized"
    );
  }

  if (!ai.models) {
    throw new Error(
      "Gemini AI models API is not available. Check @google/genai configuration."
    );
  }

  // ========================================
  // PRIMARY MODEL
  // ========================================

  try {
    console.log(
      "Trying primary model:",
      PRIMARY_MODEL
    );

    const response =
      await ai.models.generateContent({
        model: PRIMARY_MODEL,
        contents: prompt,
      });

    console.log(
      "Primary Gemini model succeeded:",
      PRIMARY_MODEL
    );

    return response;
  } catch (primaryError) {
    console.error(
      "Primary Gemini error:"
    );

    console.error(
      primaryError.message
    );

    // ======================================
    // FALLBACK MODEL
    // ======================================

    try {
      console.log(
        "Trying fallback model:",
        FALLBACK_MODEL
      );

      const response =
        await ai.models.generateContent({
          model: FALLBACK_MODEL,
          contents: prompt,
        });

      console.log(
        "Fallback Gemini model succeeded:",
        FALLBACK_MODEL
      );

      return response;
    } catch (fallbackError) {
      console.error(
        "Fallback Gemini error:"
      );

      console.error(
        fallbackError.message
      );

      throw new Error(
        `Gemini generation failed: ${
          fallbackError.message
        }`
      );
    }
  }
};

module.exports = {
  ai,
  generateContent,
  PRIMARY_MODEL,
  FALLBACK_MODEL,
};