const { generateContent } = require("../config/gemini");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const {
  generateContent,
} = require("./geminiClient");

// =====================================================
// EXTRACT JSON
// =====================================================

const extractJson = (text) => {
  if (!text) {
    throw new Error(
      "Gemini returned empty response."
    );
  }

  let cleanText =
    text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

  try {
    return JSON.parse(
      cleanText
    );
  } catch (error) {
    // Continue
  }

  const start =
    cleanText.indexOf("{");

  const end =
    cleanText.lastIndexOf("}");

  if (
    start === -1 ||
    end === -1
  ) {
    throw new Error(
      "Gemini returned invalid JSON."
    );
  }

  return JSON.parse(
    cleanText.substring(
      start,
      end + 1
    )
  );
};

// =====================================================
// GENERATE ROADMAP
// =====================================================

const generateRoadmap = async ({
  targetRole,
  currentSkills = [],
  missingSkills = [],
}) => {
  try {
    console.log(
      "================================"
    );

    console.log(
      "ROADMAP AI GENERATION"
    );

    console.log(
      "TARGET ROLE:",
      targetRole
    );

    console.log(
      "================================"
    );

    const prompt = `
You are an expert AI Career Coach.

Create a personalized career learning roadmap.

Target Role:
${targetRole}

Current Skills:
${currentSkills.join(", ")}

Missing Skills:
${missingSkills.join(", ")}

Return ONLY valid JSON.

Use exactly this structure:

{
  "targetRole": "${targetRole}",
  "roadmap": [
    {
      "phase": "Phase 1: Foundations",
      "duration": "Month 1",
      "actionItems": [
        "Action 1",
        "Action 2",
        "Action 3"
      ]
    },
    {
      "phase": "Phase 2: Intermediate",
      "duration": "Month 2",
      "actionItems": [
        "Action 1",
        "Action 2"
      ]
    }
  ]
}

STRICT RULES:

roadmap MUST be an array.

Every roadmap item MUST be an object.

Every object MUST contain:

phase: string
duration: string
actionItems: array of strings

Never return roadmap as strings.
Never return actionItems as a string.
Do not return Markdown.
Do not use code fences.
`;

    const response =
      await generateContent(
        prompt
      );

    const parsed =
      extractJson(
        response.text
      );

    const roadmap =
      Array.isArray(
        parsed.roadmap
      )
        ? parsed.roadmap
            .map((item) => {
              if (
                !item ||
                typeof item !==
                  "object" ||
                Array.isArray(item)
              ) {
                return null;
              }

              return {
                phase: String(
                  item.phase || ""
                ),

                duration: String(
                  item.duration || ""
                ),

                actionItems:
                  Array.isArray(
                    item.actionItems
                  )
                    ? item.actionItems.map(
                        String
                      )
                    : [],
              };
            })
            .filter(Boolean)
        : [];

    return {
      targetRole,
      roadmap,
    };
  } catch (error) {
    console.error(
      "ROADMAP GEMINI ERROR:",
      error
    );

    throw error;
  }
};

module.exports =
  generateRoadmap;
