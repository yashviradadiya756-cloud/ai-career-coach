require("dotenv").config();

const {
  generateContent,
  PRIMARY_MODEL,
} = require("./config/gemini");

async function test() {
  console.log("=================================");
  console.log("GEMINI TEST");
  console.log("=================================");

  console.log(
    "API KEY EXISTS:",
    !!process.env.GEMINI_API_KEY
  );

  console.log(
    "Primary Model:",
    PRIMARY_MODEL
  );

  try {
    const response =
      await generateContent(
        "Say hello in one short sentence."
      );

    console.log("=================================");
    console.log("GEMINI RESPONSE");
    console.log("=================================");

    console.log(response.text);
  } catch (error) {
    console.error(
      "❌ GEMINI TEST ERROR:"
    );

    console.error(error);
  }
}

test();