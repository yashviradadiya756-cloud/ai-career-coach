require("dotenv").config();

const {
  ai,
  PRIMARY_MODEL,
  FALLBACK_MODEL,
} = require("./config/gemini");

async function testGemini() {

  console.log(
    "================================="
  );

  console.log(
    "GEMINI TEST"
  );

  console.log(
    "PRIMARY:",
    PRIMARY_MODEL
  );

  console.log(
    "FALLBACK:",
    FALLBACK_MODEL
  );

  console.log(
    "================================="
  );

  try {

    const response =
      await ai.models.generateContent({
        model:
          PRIMARY_MODEL,
        contents:
          "Reply with exactly: GEMINI TEST SUCCESS",
      });

    console.log(
      "PRIMARY SUCCESS:"
    );

    console.log(
      response.text
    );

  } catch (error) {

    console.error(
      "PRIMARY FAILED:"
    );

    console.error(
      error?.message ||
      error
    );

    console.log(
      "Trying fallback..."
    );

    try {

      const response =
        await ai.models.generateContent({
          model:
            FALLBACK_MODEL,
          contents:
            "Reply with exactly: FALLBACK TEST SUCCESS",
        });

      console.log(
        "FALLBACK SUCCESS:"
      );

      console.log(
        response.text
      );

    } catch (fallbackError) {

      console.error(
        "FALLBACK FAILED:"
      );

      console.error(
        fallbackError?.message ||
        fallbackError
      );
    }
  }
}

testGemini();