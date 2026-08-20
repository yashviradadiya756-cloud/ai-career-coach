const Resume = require("../models/Resume");
const analyzeResume = require("../services/resumeAnalyzer");

// =====================================================
// GET LATEST RESUME
// =====================================================

const getLatestResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      user: req.user._id,
    }).sort({ createdAt: -1 });

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
    console.error("GET LATEST RESUME ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
      error: error.message,
    });
  }
};

// =====================================================
// UPLOAD + ANALYZE RESUME
// =====================================================

const uploadResume = async (req, res) => {
  let resume = null;

  try {
    console.log("=================================");
    console.log("RESUME UPLOAD CONTROLLER");
    console.log("=================================");

    // -----------------------------------------------
    // CHECK FILE
    // -----------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

    console.log("File:", req.file.filename);
    console.log("Path:", req.file.path);

    // -----------------------------------------------
    // CREATE RESUME RECORD
    // -----------------------------------------------

    resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      analysisStatus: "pending",
    });

    console.log("Resume saved:", resume._id);

    // -----------------------------------------------
    // RUN AI ANALYSIS
    // -----------------------------------------------

    try {
      console.log("Starting AI analysis...");

      const analysis = await analyzeResume(
        req.file.path
      );

      // ---------------------------------------------
      // UPDATE DATABASE
      // ---------------------------------------------

      resume.resumeText = analysis.resumeText;

      resume.atsScore = analysis.atsScore;

      resume.strengths = analysis.strengths;

      resume.weaknesses = analysis.weaknesses;

      resume.missingSkills =
        analysis.missingSkills;

      resume.suggestions =
        analysis.suggestions;

      resume.analysisStatus = "success";

      await resume.save();

      console.log("=================================");
      console.log("RESUME ANALYSIS SAVED");
      console.log("Resume ID:", resume._id);
      console.log("ATS:", resume.atsScore);
      console.log("=================================");

      return res.status(201).json({
        success: true,
        message: "Resume uploaded and analyzed successfully",
        resume,
      });
    } catch (analysisError) {
      // ---------------------------------------------
      // ANALYSIS FAILED
      // ---------------------------------------------

      console.error(
        "ANALYSIS ERROR:",
        analysisError
      );

      resume.analysisStatus = "failed";

      await resume.save();

      return res.status(500).json({
        success: false,
        message: "Resume uploaded but AI analysis failed",
        resume,
        error: analysisError.message,
      });
    }
  } catch (error) {
    console.error("UPLOAD RESUME ERROR:", error);

    if (resume) {
      try {
        resume.analysisStatus = "failed";
        await resume.save();
      } catch (saveError) {
        console.error(
          "FAILED TO UPDATE RESUME STATUS:",
          saveError
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "Resume upload failed",
      error: error.message,
    });
  }
};

module.exports = {
  getLatestResume,
  uploadResume,
};