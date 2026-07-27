const ai = require("../config/gemini");

async function generateRoadmap(skillGap, targetRole) {
  try {
    const prompt = `
You are an AI Career Coach.

Create a learning roadmap.

Target Role:
${targetRole}

Missing Skills:
${skillGap.join(", ")}

Return ONLY valid JSON.

{
  "roadmapTitle": "",
  "phases":[
    {
      "title":"",
      "duration":"",
      "topics":[],
      "projects":[],
      "resources":[]
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash", // Replace with the model that works in your project
      contents: prompt,
    });

    let text = response.text;

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);

  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = generateRoadmap;