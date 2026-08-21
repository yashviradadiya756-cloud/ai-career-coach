const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

// =====================================================
// ENVIRONMENT
// =====================================================

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY;

const PRIMARY_MODEL =
  process.env.GEMINI_MODEL ||
  "gemini-3.5-flash-lite";

const FALLBACK_MODEL =
  process.env.GEMINI_FALLBACK_MODEL ||
  "gemini-3.6-flash";

// =====================================================
// CONFIG LOG
// =====================================================

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
// VALIDATE
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
// GENERATE CONTENT WITH FALLBACK
// =====================================================

const generateContent = async (
  prompt,
  options = {}
) => {
  const timeout =
    options.timeout || 45000;

  console.log("=================================");
  console.log("GEMINI REQUEST");
  console.log("PRIMARY:", PRIMARY_MODEL);
  console.log("FALLBACK:", FALLBACK_MODEL);
  console.log("=================================");

  // ===================================================
  // PRIMARY
  // ===================================================

  try {
    console.log(
      "Trying primary model:",
      PRIMARY_MODEL
    );

    const response = await Promise.race([
      ai.models.generateContent({
        model: PRIMARY_MODEL,
        contents: prompt,
      }),

      new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                `Gemini primary timeout after ${timeout}ms`
              )
            ),
          timeout
        )
      ),
    ]);

    console.log(
      "PRIMARY MODEL SUCCESS:",
      PRIMARY_MODEL
    );

    return response;
  } catch (primaryError) {
    console.error(
      "PRIMARY MODEL FAILED:",
      primaryError?.message ||
        primaryError
    );

    // ===============================================
    // FALLBACK
    // ===============================================

    try {
      console.log(
        "Trying fallback model:",
        FALLBACK_MODEL
      );

      const response = await Promise.race([
        ai.models.generateContent({
          model: FALLBACK_MODEL,
          contents: prompt,
        }),

        new Promise((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  `Gemini fallback timeout after ${timeout}ms`
                )
              ),
            timeout
          )
        ),
      ]);

      console.log(
        "FALLBACK MODEL SUCCESS:",
        FALLBACK_MODEL
      );

      return response;
    } catch (fallbackError) {
      console.error(
        "FALLBACK MODEL FAILED:",
        fallbackError?.message ||
          fallbackError
      );

      const error = new Error(
        "Both Gemini models failed"
      );

      error.primaryError =
        primaryError?.message ||
        String(primaryError);

      error.fallbackError =
        fallbackError?.message ||
        String(fallbackError);

      throw error;
    }
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  ai,
  generateContent,
  PRIMARY_MODEL,
  FALLBACK_MODEL,
};