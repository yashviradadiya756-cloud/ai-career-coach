const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

// =====================================================
// ENVIRONMENT
// =====================================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const PRIMARY_MODEL =
  process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

const FALLBACK_MODEL =
  process.env.GEMINI_FALLBACK_MODEL || "gemini-3.6-flash";

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

console.log(
  "PRIMARY MODEL:",
  PRIMARY_MODEL
);

console.log(
  "FALLBACK MODEL:",
  FALLBACK_MODEL
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
// GEMINI CLIENT
// =====================================================

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

// =====================================================
// GENERATE CONTENT
// =====================================================

const generateContent = async (
  prompt,
  options = {}
) => {
  const requestedModel =
    options.model || PRIMARY_MODEL;

  console.log("=================================");
  console.log("GEMINI REQUEST");
  console.log("=================================");
  console.log(
    "MODEL:",
    requestedModel
  );

  try {
    const response =
      await ai.models.generateContent({
        model: requestedModel,
        contents: prompt,
      });

    console.log(
      "GEMINI REQUEST SUCCESS"
    );

    return response;

  } catch (primaryError) {

    console.error(
      "================================="
    );

    console.error(
      "PRIMARY GEMINI ERROR"
    );

    console.error(
      primaryError?.message ||
      primaryError
    );

    console.error(
      "================================="
    );

    // =================================================
    // FALLBACK
    // =================================================

    if (
      requestedModel !== FALLBACK_MODEL
    ) {

      console.log(
        "Trying fallback model:",
        FALLBACK_MODEL
      );

      try {

        const fallbackResponse =
          await ai.models.generateContent({
            model: FALLBACK_MODEL,
            contents: prompt,
          });

        console.log(
          "FALLBACK GEMINI REQUEST SUCCESS"
        );

        return fallbackResponse;

      } catch (fallbackError) {

        console.error(
          "================================="
        );

        console.error(
          "FALLBACK GEMINI ERROR"
        );

        console.error(
          fallbackError?.message ||
          fallbackError
        );

        console.error(
          "================================="
        );

        throw fallbackError;
      }
    }

    throw primaryError;
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  ai,
  generateContent,
  PRIMARY_MODEL,
  FALLBACK_MODEL,
};