const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function analyzeSkillGap(resumeText, targetRole) {

  const prompt = `...your prompt...`;

  let lastError;

  for (let i = 0; i < 3; i++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      let text = response.text;

      text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(text);

    } catch (err) {
      lastError = err;

      // Retry only on 503
      if (
        err.message &&
        err.message.includes("503")
      ) {
        console.log(`Retry ${i + 1}/3...`);
        await sleep(3000);
      } else {
        throw err;
      }
    }
  }

  throw lastError;
}

module.exports = analyzeSkillGap;