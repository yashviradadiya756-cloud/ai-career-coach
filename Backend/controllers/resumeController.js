const Resume = require("../models/Resume");
const analyzeResume = require("../services/resumeAnalyzer");

// =====================================================
// GET LATEST RESUME
// =====================================================

const getLatestResume = async (req, res) => {
  try {
    console.log("🔥 GET LATEST RESUME");

    const resume = await Resume.findOne({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found",
      });
    }

    console.log("🔥 Latest resume:", resume._id);
    console.log("🔥 Analysis status:", resume.analysisStatus);

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
  console.log("=================================");
  console.log("🔥 RESUME UPLOAD CONTROLLER CALLED");
  console.log("=================================");

  let resume = null;

  try {
    // -------------------------------------------------
    // CHECK FILE
    // -------------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

    console.log("🔥 File:", req.file.originalname);
    console.log("🔥 Saved filename:", req.file.filename);
    console.log("🔥 File path:", req.file.path);

    // -------------------------------------------------
    // SAVE INITIAL RESUME
    // -------------------------------------------------

    resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      analysisStatus: "pending",
    });

    console.log("🔥 Resume saved:", resume._id);

    // -------------------------------------------------
    // CALL AI ANALYZER
    // -------------------------------------------------

    console.log("");
    console.log("🔥 ABOUT TO CALL analyzeResume");
    console.log("");

    const analysis = await analyzeResume(req.file.path);

    console.log("");
    console.log("🔥 analyzeResume COMPLETED");
    console.log("🔥 ATS SCORE:", analysis.atsScore);
    console.log("");

    // -------------------------------------------------
    // SAVE AI RESULT
    // -------------------------------------------------

    resume.resumeText = analysis.resumeText;

    resume.atsScore = analysis.atsScore;

    resume.strengths = analysis.strengths;

    resume.weaknesses = analysis.weaknesses;

    resume.missingSkills = analysis.missingSkills;

    resume.suggestions = analysis.suggestions;

    resume.analysisStatus = "success";

    await resume.save();

    console.log("=================================");
    console.log("🔥 RESUME ANALYSIS SAVED");
    console.log("Resume ID:", resume._id);
    console.log("Status:", resume.analysisStatus);
    console.log("ATS:", resume.atsScore);
    console.log("Strengths:", resume.strengths.length);
    console.log("Weaknesses:", resume.weaknesses.length);
    console.log("Missing Skills:", resume.missingSkills.length);
    console.log("Suggestions:", resume.suggestions.length);
    console.log("=================================");

    // -------------------------------------------------
    // RETURN RESULT TO FRONTEND
    // -------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Resume uploaded and analyzed successfully",

      resume,
    });
  } catch (error) {
    console.error("=================================");
    console.error("🔥 RESUME ANALYSIS FAILED");
    console.error("=================================");
    console.error(error);

    // -------------------------------------------------
    // UPDATE DATABASE STATUS
    // -------------------------------------------------

    if (resume) {
      try {
        resume.analysisStatus = "failed";
        await resume.save();

        console.log(
          "🔥 Resume status updated to FAILED:",
          resume._id
        );
      } catch (saveError) {
        console.error(
          "🔥 Could not update failed status:",
          saveError
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "Resume analysis failed",
      error: error.message,
    });
  }
};

module.exports = {
  getLatestResume,
  uploadResume,
};