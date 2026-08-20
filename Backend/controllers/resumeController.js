const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

const Resume = require("../models/Resume");

const {
  ai,
  generateContent,
  PRIMARY_MODEL,
  FALLBACK_MODEL,
} = require("../config/gemini");

// =====================================================
// UPLOAD RESUME
// =====================================================

const uploadResume = async (req, res) => {

  console.log("====================================");
  console.log("RESUME UPLOAD CONTROLLER START");
  console.log("====================================");

  try {

    // =================================================
    // AUTH CHECK
    // =================================================

    if (!req.user) {
      console.error(
        "RESUME ERROR: USER NOT AUTHENTICATED"
      );

      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // =================================================
    // FILE CHECK
    // =================================================

    if (!req.file) {

      console.error(
        "RESUME ERROR: NO FILE RECEIVED"
      );

      return res.status(400).json({
        success: false,
        message: "Please upload a resume PDF",
      });
    }

    console.log(
      "USER ID:",
      req.user._id
    );

    console.log(
      "FILE NAME:",
      req.file.originalname
    );

    console.log(
      "FILE PATH:",
      req.file.path
    );

    console.log(
      "FILE SIZE:",
      req.file.size
    );

    // =================================================
    // READ PDF
    // =================================================

    console.log(
      "READING PDF..."
    );

    const fileBuffer =
      fs.readFileSync(req.file.path);

    console.log(
      "PDF BUFFER SIZE:",
      fileBuffer.length
    );

    // =================================================
    // PARSE PDF
    // =================================================

    console.log(
      "PARSING PDF..."
    );

    const pdfData =
      await pdfParse(fileBuffer);

    const resumeText =
      pdfData.text?.trim() || "";

    console.log(
      "PDF TEXT LENGTH:",
      resumeText.length
    );

    if (!resumeText) {

      console.error(
        "PDF TEXT EMPTY"
      );

      return res.status(400).json({
        success: false,
        message:
          "Could not extract text from this PDF. Please upload a text-based PDF.",
      });
    }

    console.log(
      "PDF TEXT PREVIEW:"
    );

    console.log(
      resumeText.substring(0, 500)
    );

    // =================================================
    // CREATE RESUME
    // =================================================

    const resume =
      await Resume.create({
        user: req.user._id,
        fileName: req.file.originalname,
        filePath: req.file.path,
        resumeText: resumeText,

        analysisStatus: "processing",

        atsScore: 0,
        strengths: [],
        weaknesses: [],
        missingSkills: [],
        suggestions: [],
      });

    console.log(
      "RESUME SAVED:",
      resume._id
    );

    // =================================================
    // AI PROMPT
    // =================================================

    const prompt = `
You are an expert ATS resume analyzer.

Analyze the following resume.

Return ONLY valid JSON.

Do not use markdown.
Do not use code fences.

Required JSON structure:

{
  "atsScore": 0,
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "suggestions": []
}

Rules:

- atsScore must be a number between 0 and 100.
- strengths must be an array of strings.
- weaknesses must be an array of strings.
- missingSkills must be an array of strings.
- suggestions must be an array of strings.
- Do not return any additional fields.

Resume:

${resumeText}
`;

    // =================================================
    // GEMINI TEST LOG
    // =================================================

    console.log(
      "===================================="
    );

    console.log(
      "STARTING RESUME AI ANALYSIS"
    );

    console.log(
      "PRIMARY MODEL:",
      PRIMARY_MODEL
    );

    console.log(
      "FALLBACK MODEL:",
      FALLBACK_MODEL
    );

    console.log(
      "AI OBJECT EXISTS:",
      !!ai
    );

    console.log(
      "GENERATE CONTENT EXISTS:",
      typeof generateContent
    );

    console.log(
      "===================================="
    );

    // =================================================
    // CALL GEMINI
    // =================================================

    let response;

    try {

      response =
        await generateContent(prompt);

    } catch (aiError) {

      console.error(
        "===================================="
      );

      console.error(
        "RESUME GEMINI ANALYSIS FAILED"
      );

      console.error(
        aiError?.message ||
        aiError
      );

      console.error(
        "===================================="
      );

      await Resume.findByIdAndUpdate(
        resume._id,
        {
          analysisStatus: "failed",
          analysisError:
            aiError?.message ||
            String(aiError),
        }
      );

      return res.status(500).json({
        success: false,
        message:
          "Resume analysis failed",
        error:
          aiError?.message ||
          String(aiError),
        resume,
      });
    }

    // =================================================
    // GET RESPONSE TEXT
    // =================================================

    console.log(
      "GEMINI RESPONSE RECEIVED"
    );

    let aiText =
      response?.text || "";

    console.log(
      "AI RESPONSE LENGTH:",
      aiText.length
    );

    console.log(
      "AI RESPONSE:"
    );

    console.log(aiText);

    // =================================================
    // CLEAN JSON
    // =================================================

    aiText =
      aiText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    // =================================================
    // PARSE JSON
    // =================================================

    let analysis;

    try {

      analysis =
        JSON.parse(aiText);

    } catch (parseError) {

      console.error(
        "===================================="
      );

      console.error(
        "AI JSON PARSE ERROR"
      );

      console.error(
        parseError.message
      );

      console.error(
        "RAW AI RESPONSE:"
      );

      console.error(
        aiText
      );

      console.error(
        "===================================="
      );

      await Resume.findByIdAndUpdate(
        resume._id,
        {
          analysisStatus: "failed",
          analysisError:
            "Invalid JSON returned by Gemini",
        }
      );

      return res.status(500).json({
        success: false,
        message:
          "Gemini returned invalid analysis data",
        error:
          aiText,
        resume,
      });
    }

    // =================================================
    // NORMALIZE RESULT
    // =================================================

    const atsScore =
      Number(analysis.atsScore) || 0;

    const strengths =
      Array.isArray(analysis.strengths)
        ? analysis.strengths
        : [];

    const weaknesses =
      Array.isArray(analysis.weaknesses)
        ? analysis.weaknesses
        : [];

    const missingSkills =
      Array.isArray(analysis.missingSkills)
        ? analysis.missingSkills
        : [];

    const suggestions =
      Array.isArray(analysis.suggestions)
        ? analysis.suggestions
        : [];

    // =================================================
    // UPDATE RESUME
    // =================================================

    const updatedResume =
      await Resume.findByIdAndUpdate(
        resume._id,
        {
          atsScore,
          strengths,
          weaknesses,
          missingSkills,
          suggestions,
          analysisStatus: "completed",
          analysisError: "",
        },
        {
          new: true,
        }
      );

    console.log(
      "===================================="
    );

    console.log(
      "RESUME ANALYSIS SUCCESS"
    );

    console.log(
      "ATS SCORE:",
      atsScore
    );

    console.log(
      "STRENGTHS:",
      strengths.length
    );

    console.log(
      "WEAKNESSES:",
      weaknesses.length
    );

    console.log(
      "MISSING SKILLS:",
      missingSkills.length
    );

    console.log(
      "SUGGESTIONS:",
      suggestions.length
    );

    console.log(
      "====================================");

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,
      message:
        "Resume uploaded and analyzed successfully",
      resume: updatedResume,
    });

  } catch (error) {

    console.error(
      "===================================="
    );

    console.error(
      "RESUME UPLOAD ERROR"
    );

    console.error(
      error?.message ||
      error
    );

    console.error(
      "===================================="
    );

    return res.status(500).json({
      success: false,
      message:
        "Resume upload failed",
      error:
        error?.message ||
        String(error),
    });
  }
};

// =====================================================
// GET LATEST RESUME
// =====================================================

const getLatestResume = async (req, res) => {

  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const resume =
      await Resume.findOne({
        user: req.user._id,
      })
        .sort({
          createdAt: -1,
        });

    if (!resume) {

      return res.status(404).json({
        success: false,
        message: "No resume found",
      });
    }

    return res.status(200).json({
      success: true,
      resume,
    });

  } catch (error) {

    console.error(
      "GET LATEST RESUME ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch latest resume",
      error:
        error.message,
    });
  }
};

module.exports = {
  uploadResume,
  getLatestResume,
};