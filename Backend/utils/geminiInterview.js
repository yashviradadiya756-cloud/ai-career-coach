const { generateContent } = require("../config/gemini");

// ==========================================
// GENERATE INTERVIEW QUESTIONS
// ==========================================

async function generateInterviewQuestions(targetRole) {
  try {
    console.log(
      "Generating interview questions for:",
      targetRole
    );

    const prompt = `
You are an AI Technical Interviewer.

Generate exactly 10 interview questions for the following job role:

${targetRole}

The questions should be useful for a technical interview.

Include a mixture of:
- Technical knowledge
- Practical development
- Problem solving
- Real-world scenarios
- Role-specific concepts

Return ONLY valid JSON.

Do not include:
- Markdown
- \`\`\`json
- Explanations
- Extra text

Use exactly this format:

{
  "questions": [
    {
      "question": "Question 1"
    },
    {
      "question": "Question 2"
    },
    {
      "question": "Question 3"
    },
    {
      "question": "Question 4"
    },
    {
      "question": "Question 5"
    },
    {
      "question": "Question 6"
    },
    {
      "question": "Question 7"
    },
    {
      "question": "Question 8"
    },
    {
      "question": "Question 9"
    },
    {
      "question": "Question 10"
    }
  ]
}
`;

    const response = await generateContent(prompt);

    let text = response.text;

    if (!text) {
      throw new Error(
        "Gemini returned an empty response"
      );
    }

    console.log(
      "Raw Gemini Interview Response:"
    );

    console.log(text);

    // Remove markdown if Gemini accidentally returns it
    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Find JSON object if Gemini added extra text
    const startIndex = text.indexOf("{");
    const endIndex = text.lastIndexOf("}");

    if (
      startIndex === -1 ||
      endIndex === -1
    ) {
      throw new Error(
        "Gemini did not return valid JSON"
      );
    }

    text = text.substring(
      startIndex,
      endIndex + 1
    );

    const data = JSON.parse(text);

    // Validate questions
    if (
      !data ||
      !Array.isArray(data.questions)
    ) {
      throw new Error(
        "Invalid interview response format"
      );
    }

    if (data.questions.length === 0) {
      throw new Error(
        "Gemini returned no interview questions"
      );
    }

    // Make sure every question has text
    const questions = data.questions
      .filter(
        (item) =>
          item &&
          typeof item.question === "string" &&
          item.question.trim()
      )
      .map((item) => ({
        question: item.question.trim(),
      }));

    if (questions.length === 0) {
      throw new Error(
        "No valid interview questions found"
      );
    }

    return {
      questions,
    };
  } catch (error) {
    console.error(
      "Gemini Interview Error:",
      error
    );

    throw error;
  }
}

module.exports = generateInterviewQuestions;
