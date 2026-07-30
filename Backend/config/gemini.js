require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

console.log(
  "Gemini Key:",
  process.env.GEMINI_API_KEY?.substring(0, 12)
);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

module.exports = ai;