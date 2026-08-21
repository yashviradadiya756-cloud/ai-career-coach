const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

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
  GEMINI_API_KEY ? GEMINI_API_KEY.length : 0
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

if (!GEMINI_API_KEY) {
  throw new Error(
    "GEMINI_API_KEY is not configured"
  );
}

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

const withTimeout = (
  promise,
  timeoutMs = 30000
) => {
  return Promise.race([
    promise,

    new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            `Gemini request timed out after ${
              timeoutMs / 1000
            } seconds`
          )
        );
      }, timeoutMs);
    }),
  ]);
};

const generateContent = async (prompt) => {

  let primaryError = null;

  console.log("=================================");
  console.log("GEMINI REQUEST STARTED");
  console.log("=================================");

  console.log(
    "Primary Model:",
    PRIMARY_MODEL
  );

  console.log(
    "Fallback Model:",
    FALLBACK_MODEL
  );

  console.log(
    "Prompt Length:",
    prompt?.length || 0
  );

  // PRIMARY
  try {

    console.log(
      "Trying PRIMARY MODEL:",
      PRIMARY_MODEL
    );

    const response = await withTimeout(
      ai.models.generateContent({
        model: PRIMARY_MODEL,
        contents: prompt,
      }),
      30000
    );

    console.log(
      "PRIMARY MODEL SUCCESS"
    );

    return response;

  } catch (error) {

    primaryError = error;

    console.error(
      "PRIMARY MODEL FAILED:",
      error?.message || error
    );
  }

  // FALLBACK
  try {

    console.log(
      "Trying FALLBACK MODEL:",
      FALLBACK_MODEL
    );

    const response = await withTimeout(
      ai.models.generateContent({
        model: FALLBACK_MODEL,
        contents: prompt,
      }),
      30000
    );

    console.log(
      "FALLBACK MODEL SUCCESS"
    );

    return response;

  } catch (fallbackError) {

    console.error(
      "FALLBACK MODEL FAILED:",
      fallbackError?.message || fallbackError
    );

    throw new Error(
      `Gemini failed. Primary: ${
        primaryError?.message || "unknown error"
      }. Fallback: ${
        fallbackError?.message || "unknown error"
      }`
    );
  }
};

module.exports = {
  ai,
  generateContent,
  PRIMARY_MODEL,
  FALLBACK_MODEL,
};