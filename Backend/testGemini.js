require("dotenv").config();

const ai = require("./config/gemini");

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Say hello",
    });

    console.log(response.text);
  } catch (err) {
    console.error("FULL ERROR:");
    console.error(err);
  }
}

test();