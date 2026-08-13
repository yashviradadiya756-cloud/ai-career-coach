const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// =====================================================
// ANALYZE SKILL GAP WITH GEMINI
// =====================================================

const analyzeSkillGap = async (
  resumeText,
  targetRole
) => {
  try {
    console.log("================================");
    console.log("GEMINI SKILL GAP ANALYSIS");
    console.log("TARGET ROLE:", targetRole);
    console.log("================================");

    const prompt = `
You are an expert AI Career Coach.

Analyze the user's resume against the target career role.

========================
RESUME
========================

${resumeText}

========================
TARGET ROLE
========================

${targetRole}

========================
TASK
========================

Identify:

1. Current skills the candidate already has.
2. Skills missing for the target role.
3. Readiness score from 0 to 100.
4. Recommended courses or learning resources.
5. A structured learning roadmap.

========================
IMPORTANT OUTPUT RULES
========================

Return ONLY valid JSON.

Do NOT return Markdown.

Do NOT use code fences.

Do NOT write explanations before or after JSON.

The JSON MUST exactly follow this structure:

{
  "currentSkills": [
    "skill 1",
    "skill 2"
  ],

  "missingSkills": [
    "skill 1",
    "skill 2"
  ],

  "readinessScore": 70,

  "recommendedCourses": [
    "Course 1",
    "Course 2"
  ],

  "roadmap": [
    {
      "phase": "Phase 1: Foundations",
      "duration": "Month 1",
      "actionItems": [
        "Action item 1",
        "Action item 2",
        "Action item 3"
      ]
    },
    {
      "phase": "Phase 2: Intermediate Skills",
      "duration": "Month 2",
      "actionItems": [
        "Action item 1",
        "Action item 2"
      ]
    }
  ]
}

========================
STRICT RULES
========================

currentSkills:
- MUST be an array of strings.

missingSkills:
- MUST be an array of strings.

readinessScore:
- MUST be a number between 0 and 100.

recommendedCourses:
- MUST be an array of strings.

roadmap:
- MUST be an array of objects.

Every roadmap object MUST contain:
- phase: string
- duration: string
- actionItems: array of strings

Never return roadmap as an array of strings.

Never return roadmap as a single string.

Never return actionItems as a single string.
`;

    // ==========================================
    // GEMINI REQUEST
    // ==========================================

    const response = await ai.models.generateContent({
      // Keep your currently working Gemini model here
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const text = response.text;

    console.log("================================");
    console.log("GEMINI RAW RESPONSE");
    console.log("================================");

    console.log(text);

    if (!text) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    // ==========================================
    // CLEAN GEMINI RESPONSE
    // ==========================================

    const cleanText = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const match = cleanText.match(
      /\{[\s\S]*\}/
    );

    if (!match) {
      throw new Error(
        "Gemini returned invalid JSON."
      );
    }

    // ==========================================
    // PARSE JSON
    // ==========================================

    const parsedResult = JSON.parse(
      match[0]
    );

    // ==========================================
    // NORMALIZE RESULT
    // ==========================================

    const normalizedResult = {
      currentSkills:
        Array.isArray(
          parsedResult.currentSkills
        )
          ? parsedResult.currentSkills.map(
              String
            )
          : [],

      missingSkills:
        Array.isArray(
          parsedResult.missingSkills
        )
          ? parsedResult.missingSkills.map(
              String
            )
          : [],

      readinessScore:
        Math.min(
          100,
          Math.max(
            0,
            Number(
              parsedResult.readinessScore
            ) || 0
          )
        ),

      recommendedCourses:
        Array.isArray(
          parsedResult.recommendedCourses
        )
          ? parsedResult.recommendedCourses.map(
              String
            )
          : [],

      roadmap:
        Array.isArray(parsedResult.roadmap)
          ? parsedResult.roadmap
              .map((item) => {
                // ----------------------------
                // Expected object format
                // ----------------------------

                if (
                  item &&
                  typeof item === "object" &&
                  !Array.isArray(item)
                ) {
                  return {
                    phase:
                      String(
                        item.phase || ""
                      ),

                    duration:
                      String(
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
                }

                // ----------------------------
                // If Gemini accidentally sends
                // a string, ignore it instead
                // of crashing MongoDB
                // ----------------------------

                return null;
              })
              .filter(Boolean)
          : [],
    };

    console.log("================================");
    console.log("NORMALIZED SKILL GAP");
    console.log("================================");

    console.log(
      JSON.stringify(
        normalizedResult,
        null,
        2
      )
    );

    return normalizedResult;
  } catch (error) {
    console.error("================================");
    console.error(
      "GEMINI SKILL GAP ERROR"
    );
    console.error(error);
    console.error("================================");

    throw error;
  }
};

module.exports = analyzeSkillGap;