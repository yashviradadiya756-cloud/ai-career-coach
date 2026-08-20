const Resume = require("../models/Resume");

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

const uploadResume = async (req, res) => {
  try {
    console.log("=================================");
    console.log("RESUME UPLOAD CONTROLLER");
    console.log("=================================");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

    console.log("File:", req.file.filename);
    console.log("Path:", req.file.path);

    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      analysisStatus: "pending",
    });

    console.log("Resume saved:", resume._id);

    return res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    console.error("UPLOAD RESUME ERROR:", error);

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