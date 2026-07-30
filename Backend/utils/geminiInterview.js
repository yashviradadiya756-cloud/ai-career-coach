const ai = require("../config/gemini");

async function generateInterviewQuestions(targetRole) {
  try {
    const prompt = `
You are an AI Technical Interviewer.

Generate 10 interview questions for:

${targetRole}

Return ONLY JSON.

{
  "questions":[
    {
      "question":""
    }
  ]
}
`;

    const result = await model.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt
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

module.exports = generateInterviewQuestions;