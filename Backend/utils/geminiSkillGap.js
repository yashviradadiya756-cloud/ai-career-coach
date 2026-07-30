const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const analyzeSkillGap = async (skills, targetRole) => {
  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });


    const prompt = `
You are an AI career coach.

Analyze the skill gap for this user.

Current Skills:
${skills.join(", ")}

Target Role:
${targetRole}

Return ONLY JSON format:

{
  "missingSkills": [],
  "recommendedSkills": [],
  "learningPath": []
}
`;


    const geminiResponse = await model.generateContent(prompt);


    const text = geminiResponse.response.text();


    console.log("Gemini Response:");
    console.log(text);


    const match = text.match(/\{[\s\S]*\}/);


    if (!match) {
      throw new Error("Invalid Gemini JSON response");
    }


    const parsedResult = JSON.parse(match[0]);


    return parsedResult;


  } catch (error) {

    console.log("Gemini Skill Gap Error:");
    console.log(error.message);

    throw error;
  }
};


module.exports = analyzeSkillGap;