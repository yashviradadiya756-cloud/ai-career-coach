const ai = require("../config/gemini");

async function evaluateAnswer(question, answer) {
  try {
    const prompt = `
You are an expert technical interviewer.

Question:
${question}

Candidate Answer:
${answer}

Return ONLY JSON.

{
  "score":0,
  "feedback":"",
  "improvement":""
}
`;

   const response = await ai.models.generateContent({
  model: "gemini-3.6-flash",
  contents: prompt,
});

    let text = response.text;

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);

  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = evaluateAnswer;