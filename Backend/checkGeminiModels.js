
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

async function test() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  // Test the exact primary model first.
  for (const model of [
    "gemini-3.8-flash",
    "gemini-3.5-flash-lite",
  ]) {
    try {
      console.log(`\nTesting: ${model}`);

      const result = await ai.models.generateContent({
        model,
        contents: "Reply with exactly: GEMINI_OK",
      });

      console.log("SUCCESS:", result.text);
    } catch (error) {
      console.log("FAILED:", model);
      console.log(error.message);
    }
  }
}

test().catch(console.error);
