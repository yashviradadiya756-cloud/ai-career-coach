require("dotenv").config();

console.log("Key:", process.env.GEMINI_API_KEY);

const { GoogleGenAI } = require("@google/genai");

try {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  console.log("Client created successfully");
} catch (err) {
  console.error(err);
}