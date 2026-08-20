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

console.log("=================================");

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

const generateContent = async (prompt) => {
  console.log("=================================");
  console.log("GEMINI REQUEST START");
  console.log("PRIMARY MODEL:", PRIMARY_MODEL);
  console.log("=================================");

  try {
    const response =
      await ai.models.generateContent({
        model: PRIMARY_MODEL,
        contents: prompt,
      });

    console.log(
      "GEMINI PRIMARY SUCCESS"
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
    // FALLBACK MODEL
    // =================================================

    console.log(
      "TRYING FALLBACK MODEL:",
      FALLBACK_MODEL
    );

    try {

      const fallbackResponse =
        await ai.models.generateContent({
          model: FALLBACK_MODEL,
          contents: prompt,
        });

      console.log(
        "GEMINI FALLBACK SUCCESS"
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
};

// =====================================================
// TEST GEMINI
// =====================================================

const testGemini = async () => {

  console.log(
    "================================="
  );

  console.log(
    "RUNNING GEMINI TEST"
  );

  console.log(
    "MODEL:",
    PRIMARY_MODEL
  );

  console.log(
    "================================="
  );

  try {

    const response =
      await ai.models.generateContent({
        model: PRIMARY_MODEL,
        contents:
          "Reply with exactly: GEMINI TEST SUCCESS",
      });

    console.log(
      "GEMINI TEST RESPONSE:"
    );

    console.log(
      response?.text ||
      response
    );

    console.log(
      "================================="
    );

    return response;

  } catch (error) {

    console.error(
      "GEMINI TEST FAILED:"
    );

    console.error(
      error?.message ||
      error
    );

    console.error(
      "================================="
    );

    return null;
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  ai,
  generateContent,
  testGemini,
  PRIMARY_MODEL,
  FALLBACK_MODEL,
};