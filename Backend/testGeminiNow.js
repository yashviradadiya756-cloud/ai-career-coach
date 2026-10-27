require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const key = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const fallback = process.env.GEMINI_FALLBACK_MODEL || "gemini-1.5-flash";

console.log("===========================================");
console.log("GEMINI API KEY:", key ? key.substring(0, 20) + "..." : "MISSING");
console.log("MODEL:", model);
console.log("FALLBACK:", fallback);
console.log("===========================================");

if (!key) {
  console.error("NO API KEY FOUND IN .env");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: key });

async function testModel(modelName) {
  console.log("\nTesting model:", modelName);
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: "Say hello in one word",
    });
    console.log("✅ SUCCESS");
    console.log("response.text:", response.text);
    return true;
  } catch (err) {
    console.error("❌ FAILED");
    console.error("Status:", err?.status);
    console.error("Message:", err?.message);
    if (err?.errorDetails) {
      console.error("Details:", JSON.stringify(err.errorDetails, null, 2));
    }
    return false;
  }
}

async function run() {
  const ok1 = await testModel(model);
  if (!ok1) {
    await testModel(fallback);
  }
  // Also try known good models
  console.log("\n--- Trying known working models ---");
  await testModel("gemini-2.0-flash");
  await testModel("gemini-1.5-flash");
  await testModel("gemini-1.5-pro");
}

run();
