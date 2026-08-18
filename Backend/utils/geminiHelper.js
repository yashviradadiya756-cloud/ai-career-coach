const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const MODELS = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-2.5-flash",
];

const isTemporaryError = (error) => {
  const code =
    error?.code ||
    error?.status ||
    error?.error?.code ||
    error?.error?.status;

  return (
    code === 503 ||
    code === "503" ||
    code === "UNAVAILABLE" ||
    code === 429 ||
    code === "429" ||
    code === "RESOURCE_EXHAUSTED"
  );
};

const generateAI = async (ai, prompt) => {
  let lastError = null;

  for (const model of MODELS) {
    console.log(`🤖 Trying Gemini model: ${model}`);

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });

        console.log(`✅ Gemini success: ${model}`);

        return {
          success: true,
          model,
          text: response.text,
        };
      } catch (error) {
        lastError = error;

        console.error(
          `❌ ${model} attempt ${attempt + 1} failed:`,
          error?.message || error
        );

        if (!isTemporaryError(error)) {
          throw error;
        }

        if (attempt < 1) {
          const delay = 1000 * Math.pow(2, attempt);

          console.log(
            `⏳ Waiting ${delay}ms before retry...`
          );

          await sleep(delay);
        }
      }
    }

    console.log(
      `⚠️ ${model} unavailable. Switching model...`
    );
  }

  throw lastError || new Error(
    "All Gemini models are temporarily unavailable."
  );
};

module.exports = {
  generateAI,
};