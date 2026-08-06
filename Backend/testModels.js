require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function test() {
  try {
    const response = await ai.models.list();

    for await (const model of response) {
      console.log(model.name);
    }
  } catch (error) {
    console.error("MODEL LIST ERROR:");
    console.error(error);
  }
}

test();