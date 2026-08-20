const fs = require("fs");
const pdfParse = require("pdf-parse");

const Resume = require("../models/Resume");

// =====================================================
// UPLOAD RESUME
// =====================================================

const uploadResume = async (req, res) => {
  try {
    console.log("=================================");
    console.log("RESUME UPLOAD STARTED");
    console.log("=================================");

    console.log("USER:", req.user);
    console.log("FILE:", req.file);

    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

    // ==========================================
    // READ PDF
    // ==========================================

    const filePath = req.file.path;

    console.log("PDF PATH:", filePath);

    const pdfBuffer = fs.readFileSync(filePath);

    const pdfData = await pdfParse(pdfBuffer);

    const resumeText = pdfData.text || "";

    console.log(
      "PDF TEXT LENGTH:",
      resumeText.length
    );

    // ==========================================
    // SAVE RESUME
    // ==========================================

    const resume = await Resume.create({
      user: req.user._id,

      fileName: req.file.originalname,

      filePath: req.file.path,

      resumeText: resumeText,

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

    return res.status(201).json({
      success: true,

      message: "Resume uploaded successfully",

      resume,
    });
  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "RESUME UPLOAD ERROR:"
    );

    console.error(error);

    console.error(
      "================================="
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Resume upload failed",
    });
  }
};

// =====================================================
// GET LATEST RESUME
// =====================================================

const getLatestResume = async (req, res) => {
  try {
    console.log(
      "================================="
    );

    console.log(
      "GET LATEST RESUME"
    );

    console.log(
      "USER:",
      req.user
    );

    console.log(
      "================================="
    );

    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Find latest resume
    const resume = await Resume.findOne({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    // No resume
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found",
      });
    }

    // Resume found
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
        error.message ||
        "Failed to get latest resume",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  uploadResume,
  getLatestResume,
};