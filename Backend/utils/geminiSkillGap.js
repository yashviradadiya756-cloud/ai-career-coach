const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


const analyzeSkillGap = async (skills, targetRole) => {
  try {

    const prompt = `
You are an AI career coach.

Analyze the skill gap for this user.

Current Skills:
${skills.join(", ")}

Target Role:
${targetRole}

Return ONLY JSON:

{
  "missingSkills": [],
  "recommendedSkills": [],
  "learningPath": []
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

    return parsedResult;


  } catch (error) {

    console.log("Skill Gap Error:");
    console.log(error.message);

    throw error;
  }
};


module.exports = analyzeSkillGap;