require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

async function test() {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "Say hello in one sentence.",
    });

    console.log("Gemini Response:");
    console.log(response.text);

  } catch (error) {
    console.error("Gemini Test Error:");
    console.error(error);
  }
}

test();