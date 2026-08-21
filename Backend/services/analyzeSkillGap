const SkillGap = require("../models/SkillGap");
const Resume = require("../models/Resume");

const {
  generateContent,
} = require("../utils/gemini");

// =====================================================
// ANALYZE SKILL GAP
// =====================================================

const analyzeSkillGap = async (req, res) => {

  console.log("======================================");
  console.log("SKILL GAP ANALYSIS STARTED");
  console.log("======================================");

  try {

    const userId = req.user._id;

    const targetRole =
      req.body?.targetRole?.trim();

    console.log(
      "USER ID:",
      userId
    );

    console.log(
      "TARGET ROLE:",
      targetRole
    );

    // =================================================
    // VALIDATE ROLE
    // =================================================

    if (!targetRole) {

      console.log(
        "ERROR: TARGET ROLE MISSING"
      );

      return res.status(400).json({
        success: false,
        message: "Target role is required",
      });
    }

    // =================================================
    // GET LATEST RESUME
    // =================================================

    console.log(
      "STEP 1: FINDING LATEST RESUME"
    );

    const resume =
      await Resume.findOne({
        user: userId,
      }).sort({
        createdAt: -1,
      });

    if (!resume) {

      console.log(
        "ERROR: RESUME NOT FOUND"
      );

      return res.status(404).json({
        success: false,
        message:
          "Please upload a resume first",
      });
    }

    console.log(
      "RESUME FOUND:",
      resume._id
    );

    console.log(
      "RESUME TEXT LENGTH:",
      resume.resumeText?.length || 0
    );

    // =================================================
    // VALIDATE RESUME TEXT
    // =================================================

    if (
      !resume.resumeText ||
      resume.resumeText.trim().length < 20
    ) {

      console.log(
        "ERROR: RESUME TEXT EMPTY"
      );

      return res.status(400).json({
        success: false,
        message:
          "Resume text is empty. Please upload your resume again.",
      });
    }

    // =================================================
    // LIMIT RESUME TEXT
    // =================================================

    const resumeText =
      resume.resumeText
        .substring(0, 12000);

    console.log(
      "RESUME TEXT USED:",
      resumeText.length
    );

    // =================================================
    // GEMINI PROMPT
    // =================================================

    const prompt = `
You are an expert career advisor and skill-gap analyst.

Analyze the candidate resume against the target job role.

TARGET ROLE:
${targetRole}

RESUME:
${resumeText}

Return ONLY valid JSON.

Do not use markdown.
Do not use code fences.

Use exactly this structure:

{
  "targetRole": "${targetRole}",
  "currentSkills": [],
  "missingSkills": [],
  "skillMatchPercentage": 0,
  "strengths": [],
  "weaknesses": [],
  "recommendations": [],
  "roadmap": []
}

Rules:

1. currentSkills must contain skills found in the resume.
2. missingSkills must contain useful skills needed for the target role.
3. skillMatchPercentage must be a number from 0 to 100.
4. strengths must contain short statements.
5. weaknesses must contain short statements.
6. recommendations must contain actionable learning recommendations.
7. roadmap must contain short learning steps.
8. All arrays must contain strings only.
9. Do not return objects inside arrays.
10. Return valid JSON only.
`;

    console.log(
      "======================================"
    );

    console.log(
      "STEP 2: CALLING GEMINI"
    );

    console.log(
      "PROMPT LENGTH:",
      prompt.length
    );

    console.log(
      "======================================"
    );

    // =================================================
    // GEMINI
    // =================================================

    const response =
      await generateContent(prompt);

    console.log(
      "STEP 3: GEMINI RESPONSE RECEIVED"
    );

    // =================================================
    // GET TEXT
    // =================================================

    let text = "";

    if (response?.text) {
      text =
        typeof response.text === "function"
          ? response.text()
          : response.text;
    }

    if (
      !text &&
      response?.candidates?.[0]?.content?.parts
    ) {
      text =
        response.candidates[0]
          .content.parts
          .map(
            (part) => part.text || ""
          )
          .join("");
    }

    console.log(
      "GEMINI TEXT LENGTH:",
      text.length
    );

    console.log(
      "GEMINI RAW RESPONSE:",
      text.substring(0, 1000)
    );

    if (!text) {

      throw new Error(
        "Gemini returned an empty response"
      );
    }

    // =================================================
    // CLEAN JSON
    // =================================================

    let cleanedText = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Find JSON object
    const start =
      cleanedText.indexOf("{");

    const end =
      cleanedText.lastIndexOf("}");

    if (
      start !== -1 &&
      end !== -1
    ) {
      cleanedText =
        cleanedText.substring(
          start,
          end + 1
        );
    }

    console.log(
      "CLEANED JSON LENGTH:",
      cleanedText.length
    );

    // =================================================
    // PARSE
    // =================================================

    let analysis;

    try {

      analysis =
        JSON.parse(cleanedText);

    } catch (jsonError) {

      console.error(
        "JSON PARSE ERROR:",
        jsonError.message
      );

      console.error(
        "INVALID GEMINI RESPONSE:",
        cleanedText
      );

      throw new Error(
        "Gemini returned invalid JSON"
      );
    }

    // =================================================
    // NORMALIZE ARRAYS
    // =================================================

    const toStringArray = (
      value
    ) => {

      if (!Array.isArray(value)) {
        return [];
      }

      return value
        .map((item) => {

          if (
            typeof item === "string"
          ) {
            return item;
          }

          if (
            typeof item === "object" &&
            item !== null
          ) {

            return (
              item.name ||
              item.title ||
              item.skill ||
              item.description ||
              JSON.stringify(item)
            );
          }

          return String(item);

        })
        .filter(Boolean);
    };

    analysis.currentSkills =
      toStringArray(
        analysis.currentSkills
      );

    analysis.missingSkills =
      toStringArray(
        analysis.missingSkills
      );

    analysis.strengths =
      toStringArray(
        analysis.strengths
      );

    analysis.weaknesses =
      toStringArray(
        analysis.weaknesses
      );

    analysis.recommendations =
      toStringArray(
        analysis.recommendations
      );

    analysis.roadmap =
      toStringArray(
        analysis.roadmap
      );

    // =================================================
    // MATCH PERCENTAGE
    // =================================================

    let match =
      Number(
        analysis.skillMatchPercentage
      );

    if (
      Number.isNaN(match)
    ) {
      match = 0;
    }

    match =
      Math.max(
        0,
        Math.min(
          100,
          match
        )
      );

    analysis.skillMatchPercentage =
      match;

    analysis.targetRole =
      targetRole;

    // =================================================
    // SAVE
    // =================================================

    console.log(
      "STEP 4: SAVING SKILL GAP"
    );

    const skillGap =
      await SkillGap.create({
        user: userId,
        targetRole,
        currentSkills:
          analysis.currentSkills,
        missingSkills:
          analysis.missingSkills,
        skillMatchPercentage:
          analysis.skillMatchPercentage,
        strengths:
          analysis.strengths,
        weaknesses:
          analysis.weaknesses,
        recommendations:
          analysis.recommendations,
        roadmap:
          analysis.roadmap,
      });

    console.log(
      "SKILL GAP SAVED:",
      skillGap._id
    );

    // =================================================
    // SUCCESS
    // =================================================

    console.log(
      "======================================"
    );

    console.log(
      "SKILL GAP ANALYSIS SUCCESS"
    );

    console.log(
      "======================================"
    );

    return res.status(200).json({
      success: true,
      message:
        "Skill gap analysis completed",
      skillGap,
    });

  } catch (error) {

    console.error(
      "======================================"
    );

    console.error(
      "SKILL GAP ANALYSIS ERROR"
    );

    console.error(
      error?.message || error
    );

    console.error(
      error?.stack || ""
    );

    console.error(
      "======================================"
    );

    return res.status(500).json({
      success: false,
      message:
        "Skill gap analysis failed",
      error:
        error?.message ||
        "Unknown error",
    });
  }
};

// =====================================================
// GET LATEST
// =====================================================

const getLatestSkillGap = async (
  req,
  res
) => {

  try {

    const skillGap =
      await SkillGap.findOne({
        user: req.user._id,
      }).sort({
        createdAt: -1,
      });

    if (!skillGap) {

      return res.status(404).json({
        success: false,
        message:
          "No skill gap analysis found",
      });
    }

    return res.status(200).json({
      success: true,
      skillGap,
    });

  } catch (error) {

    console.error(
      "GET SKILL GAP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch skill gap",
      error:
        error.message,
    });
  }
};

module.exports = {
  analyzeSkillGap,
  getLatestSkillGap,
};