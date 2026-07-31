const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


const analyzeSkillGap = async (resumeText, targetRole) => {
  try {

    const prompt = `
    You are an AI Career Coach.

    Below is the user's resume.

    Resume:
    ${resumeText}

    Target Role:
    ${targetRole}

    Analyze the resume and return ONLY valid JSON in this format:

    {
      "currentSkills": [],
      "missingSkills": [],
      "readinessScore": 0,
      "recommendedCourses": [],
      "roadmap": []
    }
    `;


    const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });


    const text = response.text;

    console.log("Gemini Response:");
    console.log(text);


    const match = text.match(/\{[\s\S]*\}/);


    if (!match) {
      throw new Error("Invalid Gemini response");
    }


    const parsedResult = JSON.parse(match[0]);

    console.log("Parsed Result:");
    console.log(parsedResult);

    return parsedResult;


  } catch (error) {

    console.log("Skill Gap Error:");
    console.log(error.message);

    throw error;
  }
};


module.exports = analyzeSkillGap;