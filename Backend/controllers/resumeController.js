const fs = require("fs");
const path = require("path");

const pdfParse = require("pdf-parse");

const Resume = require("../models/Resume");

const {
  generateContent,
  PRIMARY_MODEL,
  FALLBACK_MODEL,
} = require("../services/geminiService");

// =====================================================
// UPLOAD + ANALYZE RESUME
// =====================================================

const uploadResume = async (req, res) => {

  let savedResume = null;

  try {

    console.log("=================================");
    console.log("RESUME UPLOAD STARTED");
    console.log("=================================");

    // =================================================
    // CHECK FILE
    // =================================================

    if (!req.file) {

      console.log(
        "NO FILE RECEIVED"
      );

      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

    console.log(
      "FILE NAME:",
      req.file.originalname
    );

    console.log(
      "FILE MIME:",
      req.file.mimetype
    );

    console.log(
      "FILE PATH:",
      req.file.path
    );

    // =================================================
    // PDF VALIDATION
    // =================================================

    const isPDF =
      req.file.mimetype === "application/pdf" ||
      path
        .extname(req.file.originalname)
        .toLowerCase() === ".pdf";

    if (!isPDF) {

      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

    // =================================================
    // READ PDF
    // =================================================

    const pdfBuffer =
      fs.readFileSync(req.file.path);

    console.log(
      "PDF BUFFER SIZE:",
      pdfBuffer.length
    );

    // =================================================
    // EXTRACT TEXT
    // =================================================

    let resumeText = "";

    try {

      const pdfData =
        await pdfParse(pdfBuffer);

      resumeText =
        pdfData.text || "";

      console.log(
        "PDF TEXT LENGTH:",
        resumeText.length
      );

    } catch (pdfError) {

      console.error(
        "PDF PARSE ERROR:",
        pdfError?.message
      );

      resumeText = "";
    }

    // =================================================
    // CREATE DATABASE RECORD
    // =================================================

    savedResume =
      await Resume.create({

        user: req.user._id,

        fileName:
          req.file.originalname,

        filePath:
          req.file.path,

        resumeText,

        analysisStatus:
          "processing",

        atsScore: 0,

        strengths: [],

        weaknesses: [],

        missingSkills: [],

        suggestions: [],
      });

    console.log(
      "RESUME SAVED:",
      savedResume._id
    );

    // =================================================
    // CHECK EXTRACTED TEXT
    // =================================================

    if (!resumeText.trim()) {

      savedResume.analysisStatus =
        "failed";

      await savedResume.save();

      return res.status(500).json({
        success: false,
        message:
          "Resume uploaded but PDF text could not be extracted",
        resume: savedResume,
      });
    }

    // =================================================
    // AI PROMPT
    // =================================================

    const prompt = `
You are an expert ATS resume analyzer.

Analyze the following resume carefully.

Return ONLY valid JSON.

Do not use markdown.
Do not use code fences.
Do not add explanations outside JSON.

Required JSON structure:

{
  "atsScore": 0,
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "suggestions": []
}

Rules:

1. atsScore must be an integer from 0 to 100.
2. strengths must be an array of strings.
3. weaknesses must be an array of strings.
4. missingSkills must be an array of strings.
5. suggestions must be an array of strings.
6. Do not return objects inside these arrays.
7. Keep the suggestions practical and career-focused.

Resume:

${resumeText}
`;

    // =================================================
    // GEMINI
    // =================================================

    console.log(
      "STARTING AI ANALYSIS"
    );

    console.log(
      "PRIMARY MODEL:",
      PRIMARY_MODEL
    );

    console.log(
      "FALLBACK MODEL:",
      FALLBACK_MODEL
    );

    const aiResponse =
      await generateContent(
        prompt
      );

    // =================================================
    // GET RESPONSE TEXT
    // =================================================

    let responseText = "";

    if (
      aiResponse &&
      typeof aiResponse.text === "string"
    ) {

      responseText =
        aiResponse.text;

    } else if (
      aiResponse &&
      typeof aiResponse.text === "function"
    ) {

      responseText =
        aiResponse.text();

    } else if (
      aiResponse?.candidates?.[0]?.content
        ?.parts?.[0]?.text
    ) {

      responseText =
        aiResponse
          .candidates[0]
          .content
          .parts[0]
          .text;

    } else {

      throw new Error(
        "Gemini returned an empty response"
      );
    }

    console.log(
      "AI RESPONSE:",
      responseText
    );

    // =================================================
    // CLEAN JSON
    // =================================================

    responseText =
      responseText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    // =================================================
    // PARSE JSON
    // =================================================

    let analysis;

    try {

      analysis =
        JSON.parse(responseText);

    } catch (jsonError) {

      console.error(
        "AI JSON PARSE ERROR:",
        jsonError.message
      );

      console.error(
        "RAW AI RESPONSE:",
        responseText
      );

      throw new Error(
        "AI returned invalid JSON"
      );
    }

    // =================================================
    // NORMALIZE DATA
    // =================================================

    const atsScore =
      Number(analysis.atsScore) || 0;

    const strengths =
      Array.isArray(
        analysis.strengths
      )
        ? analysis.strengths
            .map(String)
            .filter(Boolean)
        : [];

    const weaknesses =
      Array.isArray(
        analysis.weaknesses
      )
        ? analysis.weaknesses
            .map(String)
            .filter(Boolean)
        : [];

    const missingSkills =
      Array.isArray(
        analysis.missingSkills
      )
        ? analysis.missingSkills
            .map(String)
            .filter(Boolean)
        : [];

    const suggestions =
      Array.isArray(
        analysis.suggestions
      )
        ? analysis.suggestions
            .map(String)
            .filter(Boolean)
        : [];

    // =================================================
    // UPDATE RESUME
    // =================================================

    savedResume.atsScore =
      Math.min(
        100,
        Math.max(0, atsScore)
      );

    savedResume.strengths =
      strengths;

    savedResume.weaknesses =
      weaknesses;

    savedResume.missingSkills =
      missingSkills;

    savedResume.suggestions =
      suggestions;

    savedResume.analysisStatus =
      "completed";

    await savedResume.save();

    // =================================================
    // SUCCESS
    // =================================================

    console.log(
      "================================="
    );

    console.log(
      "RESUME ANALYSIS SUCCESS"
    );

    console.log(
      "ATS SCORE:",
      savedResume.atsScore
    );

    console.log(
      "================================="
    );

    return res.status(200).json({
      success: true,

      message:
        "Resume uploaded and analyzed successfully",

      resume: savedResume,
    });

  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "RESUME ANALYSIS ERROR"
    );

    console.error(
      error?.message ||
      error
    );

    console.error(
      "================================="
    );

    // =================================================
    // UPDATE FAILED RECORD
    // =================================================

    if (savedResume) {

      try {

        savedResume.analysisStatus =
          "failed";

        await savedResume.save();

      } catch (dbError) {

        console.error(
          "FAILED TO UPDATE RESUME STATUS:",
          dbError.message
        );
      }
    }

    return res.status(500).json({

      success: false,

      message:
        "Resume analysis failed",

      error:
        error?.message ||
        "Unknown error",

      resume:
        savedResume || null,
    });
  }
};

// =====================================================
// GET LATEST RESUME
// =====================================================

const getLatestResume = async (
  req,
  res
) => {

  try {

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

        message:
          "No resume found",
      });
    }

    return res.status(200).json({

      success: true,

      resume,
    });

  } catch (error) {

    console.error(
      "GET LATEST RESUME ERROR:",
      error.message
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to get latest resume",

      error:
        error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  uploadResume,
  getLatestResume,
};