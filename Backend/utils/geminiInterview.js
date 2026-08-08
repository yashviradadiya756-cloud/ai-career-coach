const ai = require("../config/gemini");

// ==========================================
// GENERATE INTERVIEW QUESTIONS
// ==========================================

async function generateInterviewQuestions(targetRole) {
  try {
    if (!targetRole || !targetRole.trim()) {
      throw new Error("Target role is required");
    }

    console.log("=================================");
    console.log("GEMINI INTERVIEW GENERATION");
    console.log("Target Role:", targetRole);
    console.log("=================================");

    const prompt = `
You are an AI Technical Interviewer.

Generate exactly 10 interview questions for the following role:

${targetRole}

Questions should be relevant to the target role.

Mix the questions between:
- Technical knowledge
- Practical problem solving
- Real-world scenarios
- Project experience
- Role-specific concepts

Return ONLY valid JSON.

Do not use markdown.
Do not use code fences.
Do not add explanations.

Required format:

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

    // Check Gemini client
    if (!ai) {
      throw new Error("Gemini AI client is not initialized");
    }

    if (!ai.models) {
      throw new Error(
        "Gemini AI models API is not available. Check @google/genai configuration."
      );
    }

    console.log("Calling Gemini API...");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    let text = response.text;

    console.log("Gemini raw response:");
    console.log(text);

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    // Remove markdown code fences if Gemini adds them
    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let parsedData;

    try {
      parsedData = JSON.parse(text);
    } catch (parseError) {
      console.error("❌ JSON Parse Error");
      console.error("Gemini Response:", text);

      throw new Error(
        "Gemini returned invalid JSON"
      );
    }

    // Validate response
    if (
      !parsedData ||
      !Array.isArray(parsedData.questions)
    ) {
      throw new Error(
        "Gemini response does not contain questions array"
      );
    }

    // Keep only valid questions
    const questions = parsedData.questions
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
        "No valid interview questions generated"
      );
    }

    console.log(
      `✅ ${questions.length} interview questions generated`
    );

    return {
      questions,
    };
  } catch (error) {
    console.error(
      "❌ Gemini Interview Error:",
      error
    );

    throw error;
  }
}

module.exports = generateInterviewQuestions;