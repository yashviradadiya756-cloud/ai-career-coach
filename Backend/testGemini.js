require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const PRIMARY_MODEL =
  process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

const FALLBACK_MODEL =
  process.env.GEMINI_FALLBACK_MODEL || "gemini-3.6-flash";

console.log("=================================");
console.log("GEMINI DIRECT TEST");
console.log("=================================");

console.log("API KEY:", GEMINI_API_KEY ? "LOADED" : "MISSING");
console.log("PRIMARY:", PRIMARY_MODEL);
console.log("FALLBACK:", FALLBACK_MODEL);

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY missing");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

async function testModel(model) {
  console.log("---------------------------------");
  console.log("Testing model:", model);
  console.log("---------------------------------");

  const start = Date.now();

  try {
    const response = await Promise.race([
      ai.models.generateContent({
        model,
        contents: "Reply with exactly: GEMINI TEST SUCCESS",
      }),

      new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                `Gemini timeout after 30 seconds`
              )
            ),
          30000
        )
      ),
    ]);

    const time = Date.now() - start;

    console.log("SUCCESS");
    console.log("TIME:", `${time} ms`);
    console.log(
      "RESPONSE:",
      response?.text || response
    );

    return true;
  } catch (error) {
    const time = Date.now() - start;

    console.error("FAILED");
    console.error("TIME:", `${time} ms`);
    console.error(
      "ERROR:",
      error?.message || error
    );

    return false;
  }
}

async function main() {
  const primarySuccess = await testModel(
    PRIMARY_MODEL
  );

  if (!primarySuccess) {
    console.log(
      "Primary failed. Testing fallback..."
    );

    await testModel(FALLBACK_MODEL);
  }

  console.log("=================================");
  console.log("GEMINI TEST FINISHED");
  console.log("=================================");
}

main();