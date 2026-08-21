const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

// =====================================================
// GEMINI CONFIG
// =====================================================

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY;

const PRIMARY_MODEL =
  process.env.GEMINI_MODEL ||
  "gemini-3.5-flash-lite";

const FALLBACK_MODEL =
  process.env.GEMINI_FALLBACK_MODEL ||
  "gemini-3.6-flash";

console.log("=================================");
console.log("GEMINI CONFIG");
console.log("=================================");

console.log(
  "GEMINI_API_KEY EXISTS:",
  !!GEMINI_API_KEY
);

console.log(
  "GEMINI_API_KEY LENGTH:",
  GEMINI_API_KEY
    ? GEMINI_API_KEY.length
    : 0
);

console.log(
  "PRIMARY MODEL:",
  PRIMARY_MODEL
);

console.log(
  "FALLBACK MODEL:",
  FALLBACK_MODEL
);

console.log("=================================");

if (!GEMINI_API_KEY) {
  throw new Error(
    "GEMINI_API_KEY is not configured"
  );
}

// =====================================================
// GEMINI CLIENT
// =====================================================

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

// =====================================================
// JSON EXTRACTOR
// =====================================================

const extractJson = (text) => {
  if (!text) {
    throw new Error(
      "Gemini returned an empty response."
    );
  }

  let cleanText = String(text).trim();

  // Remove markdown code fences
  cleanText = cleanText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // Direct JSON
  try {
    return JSON.parse(cleanText);
  } catch (error) {
    // Continue
  }

  // Find JSON object
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
// NORMALIZE ARRAY OF STRINGS
// =====================================================

const normalizeStringArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item).trim())
    .filter(Boolean);
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
      if (
        !item ||
        typeof item !== "object" ||
        Array.isArray(item)
      ) {
        return null;
      }

      return {
        phase: String(
          item.phase || ""
        ).trim(),

        duration: String(
          item.duration || ""
        ).trim(),

        actionItems:
          normalizeStringArray(
            item.actionItems
          ),
      };
    })
    .filter(
      (item) =>
        item &&
        (item.phase ||
          item.duration ||
          item.actionItems.length > 0)
    );
};

// =====================================================
// GEMINI REQUEST WITH FALLBACK
// =====================================================

const generateWithFallback = async (
  prompt
) => {
  let primaryError = null;

  // ===================================================
  // PRIMARY
  // ===================================================

  try {
    console.log(
      "Trying PRIMARY MODEL:",
      PRIMARY_MODEL
    );

    const response =
      await ai.models.generateContent({
        model: PRIMARY_MODEL,
        contents: prompt,
      });

    console.log(
      "PRIMARY MODEL SUCCESS"
    );

    return response;

  } catch (error) {
    primaryError = error;

    console.error(
      "PRIMARY MODEL FAILED:",
      error?.message || error
    );
  }

  // ===================================================
  // FALLBACK
  // ===================================================

  try {
    console.log(
      "Trying FALLBACK MODEL:",
      FALLBACK_MODEL
    );

    const response =
      await ai.models.generateContent({
        model: FALLBACK_MODEL,
        contents: prompt,
      });

    console.log(
      "FALLBACK MODEL SUCCESS"
    );

    return response;

  } catch (fallbackError) {
    console.error(
      "FALLBACK MODEL FAILED:",
      fallbackError?.message ||
        fallbackError
    );

    throw new Error(
      `Gemini failed. Primary: ${
        primaryError?.message ||
        "unknown error"
      }. Fallback: ${
        fallbackError?.message ||
        "unknown error"
      }`
    );
  }
};

// =====================================================
// ANALYZE SKILL GAP
// =====================================================

const analyzeSkillGap = async (
  resumeText,
  targetRole
) => {
  console.log("=================================");
  console.log("GEMINI SKILL GAP ANALYSIS");
  console.log("=================================");

  console.log(
    "TARGET ROLE:",
    targetRole
  );

  const prompt = `
You are an expert AI Career Coach.

Analyze the user's resume against the target career role.

========================
RESUME
========================

${resumeText || "No resume text available."}

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
4. Recommended courses.
5. A structured learning roadmap.

========================
IMPORTANT
========================

Return ONLY valid JSON.

Do not return Markdown.
Do not use code fences.
Do not write explanations.

Use EXACTLY this structure:

{
  "currentSkills": [
    "JavaScript",
    "React"
  ],

  "missingSkills": [
    "React Native",
    "Mobile App Architecture"
  ],

  "readinessScore": 70,

  "recommendedCourses": [
    "React Native Fundamentals",
    "Mobile App Development"
  ],

  "roadmap": [
    {
      "phase": "Phase 1: Foundations",
      "duration": "Month 1",
      "actionItems": [
        "Learn mobile development fundamentals",
        "Learn React Native",
        "Build a simple mobile application"
      ]
    },
    {
      "phase": "Phase 2: Advanced Skills",
      "duration": "Month 2",
      "actionItems": [
        "Learn navigation",
        "Learn API integration",
        "Build a complete application"
      ]
    }
  ]
}

STRICT RULES:

currentSkills:
- Array of strings only.

missingSkills:
- Array of strings only.

readinessScore:
- Number from 0 to 100.

recommendedCourses:
- Array of strings only.

roadmap:
- Array of objects only.

Every roadmap object MUST contain:

phase:
- string

duration:
- string

actionItems:
- array of strings

NEVER return roadmap as strings.

NEVER return roadmap as a single string.

NEVER return actionItems as a single string.
`;

  try {
    const response =
      await generateWithFallback(
        prompt
      );

    const text =
      response?.text;

    console.log(
      "================================="
    );

    console.log(
      "GEMINI RAW RESPONSE"
    );

    console.log(
      "================================="
    );

    console.log(text);

    const parsed =
      extractJson(text);

    const readinessScore = Math.min(
      100,
      Math.max(
        0,
        Number(
          parsed.readinessScore
        ) || 0
      )
    );

    const normalizedResult = {
      currentSkills:
        normalizeStringArray(
          parsed.currentSkills
        ),

      missingSkills:
        normalizeStringArray(
          parsed.missingSkills
        ),

      readinessScore,

      recommendedCourses:
        normalizeStringArray(
          parsed.recommendedCourses
        ),

      roadmap:
        normalizeRoadmap(
          parsed.roadmap
        ),
    };

    console.log(
      "================================="
    );

    console.log(
      "NORMALIZED SKILL GAP"
    );

    console.log(
      "================================="
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
      "GEMINI SKILL GAP ERROR:",
      error
    );

    throw error;
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = analyzeSkillGap;