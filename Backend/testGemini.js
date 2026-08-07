const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const { generateContent, GEMINI_MODEL } = require("./config/gemini");

async function test() {
  console.log("Model:", GEMINI_MODEL);

  try {
    const response = await generateContent(
      "Say hello in one short sentence."
    );

    console.log("Gemini Response:");
    console.log(response.text);
  } catch (error) {
    console.error("Gemini Error:");
    console.error(error);
  }
}

test();