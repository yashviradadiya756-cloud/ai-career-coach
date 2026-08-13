const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

// =====================================================
// GEMINI CLIENT
// =====================================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error(
    "GEMINI_API_KEY is not configured."
  );
}

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

// =====================================================
// CURRENT GEMINI MODEL
// =====================================================

const MODEL = "gemini-3.6-flash";

// =====================================================
// HELPER - EXTRACT JSON
// =====================================================

const extractJson = (text) => {
  if (!text) {
    throw new Error(
      "Gemini returned an empty response."
    );
  }

  let cleanText = text.trim();

  // Remove markdown fences
  cleanText = cleanText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // Try direct JSON parse first
  try {
    return JSON.parse(cleanText);
  } catch (error) {
    // Continue below
  }

  // Try extracting JSON object
  const start = cleanText.indexOf("{");
  const end = cleanText.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error(
      "Gemini returned invalid JSON."
    );
  }

  const jsonText = cleanText.substring(
    start,
    end + 1
  );

  return JSON.parse(jsonText);
};

// =====================================================
// NORMALIZE ROADMAP
// =====================================================

const normalizeRoadmap = (roadmap) => {
  if (!Array.isArray(roadmap)) {
    return [];
  }

  return roadmap
    .map((item) => {
      // -----------------------------------------------
      // Correct format
      // -----------------------------------------------

      if (
        item &&
        typeof item === "object" &&
        !Array.isArray(item)
      ) {
        return {
          phase: String(
            item.phase || ""
          ).trim(),

          duration: String(
            item.duration || ""
          ).trim(),

          actionItems:
            Array.isArray(item.actionItems)
              ? item.actionItems
                  .map((action) =>
                    String(action).trim()
                  )
                  .filter(Boolean)
              : [],
        };
      }

      // -----------------------------------------------
      // Ignore invalid string roadmap entries
      // -----------------------------------------------

      return null;
    })
    .filter(Boolean);
};

// =====================================================
// ANALYZE SKILL GAP
// =====================================================

const analyzeSkillGap = async (
  resumeText,
  targetRole
) => {
  try {
    console.log(
      "================================"
    );

    console.log(
      "GEMINI SKILL GAP ANALYSIS"
    );

    console.log(
      "MODEL:",
      MODEL
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
OUTPUT
========================

Return ONLY valid JSON.

Do not return Markdown.
Do not use code fences.
Do not write explanations before or after JSON.

Use EXACTLY this structure:

{
  "currentSkills": [
    "React",
    "JavaScript"
  ],

  "missingSkills": [
    "SEO",
    "Google Analytics"
  ],

  "readinessScore": 70,

  "recommendedCourses": [
    "Google Digital Marketing Course",
    "Google Analytics Course"
  ],

  "roadmap": [
    {
      "phase": "Phase 1: Foundations",
      "duration": "Month 1",
      "actionItems": [
        "Learn marketing fundamentals",
        "Learn buyer personas",
        "Learn conversion funnels"
      ]
    },
    {
      "phase": "Phase 2: Intermediate Skills",
      "duration": "Month 2",
      "actionItems": [
        "Learn SEO",
        "Learn Google Analytics"
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
- MUST be an array of OBJECTS.

Every roadmap object MUST contain:

phase:
- string

duration:
- string

actionItems:
- array of strings

NEVER return roadmap as an array of strings.

NEVER return roadmap as a single string.

NEVER return actionItems as a single string.
`;

    // =================================================
    // GEMINI REQUEST
    // =================================================

    const response =
      await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
      });

    const text = response.text;

    console.log(
      "================================"
    );

    console.log(
      "GEMINI RAW RESPONSE"
    );

    console.log(
      "================================"
    );

    console.log(text);

    // =================================================
    // PARSE
    // =================================================

    const parsedResult =
      extractJson(text);

    // =================================================
    // NORMALIZE
    // =================================================

    const readinessScore = Math.min(
      100,
      Math.max(
        0,
        Number(
          parsedResult.readinessScore
        ) || 0
      )
    );

    const normalizedResult = {
      currentSkills:
        Array.isArray(
          parsedResult.currentSkills
        )
          ? parsedResult.currentSkills
              .map((item) =>
                String(item).trim()
              )
              .filter(Boolean)
          : [],

      missingSkills:
        Array.isArray(
          parsedResult.missingSkills
        )
          ? parsedResult.missingSkills
              .map((item) =>
                String(item).trim()
              )
              .filter(Boolean)
          : [],

      readinessScore,

      recommendedCourses:
        Array.isArray(
          parsedResult.recommendedCourses
        )
          ? parsedResult.recommendedCourses
              .map((item) =>
                String(item).trim()
              )
              .filter(Boolean)
          : [],

      roadmap: normalizeRoadmap(
        parsedResult.roadmap
      ),
    };

    console.log(
      "================================"
    );

    console.log(
      "NORMALIZED SKILL GAP"
    );

    console.log(
      "================================"
    );

    console.log(
      JSON.stringify(
        normalizedResult,
        null,
        2
      )
    );

    return normalizedResult;
  } catch (error) {
    console.error(
      "================================"
    );

    console.error(
      "GEMINI SKILL GAP ERROR"
    );

    console.error(error);

    console.error(
      "================================"
    );

    throw error;
  }
};

module.exports = analyzeSkillGap;