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

  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = generateRoadmap;