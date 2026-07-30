const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "Say Hello",
    });

    console.log(response.text);
  } catch (err) {
    console.log("Status:", err.status);
    console.log(err);
  }
}

test();