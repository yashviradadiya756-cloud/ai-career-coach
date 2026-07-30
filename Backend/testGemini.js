const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

async function test() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Say hello",
  });

  console.log(response.text);
}

test().catch(console.error);