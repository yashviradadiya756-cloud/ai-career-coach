const Resume = require("../models/Resume");
const extractResumeText = require("../utils/pdfParser");
const analyzeResume = require("../utils/geminiResumeAnalyzer");


// Upload Resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF uploaded",
      });
    }

    const resumeText = await extractResumeText(req.file.path);

    const analysis = await analyzeResume(resumeText);

    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      resumeText,
      atsScore: analysis.atsScore,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      missingSkills: analysis.missingSkills,
      suggestions: analysis.suggestions,
    });

    res.status(201).json({
      success: true,
      resume,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get Latest Resume
const getLatestResume = async (req, res) => {
  try {

    console.log("Logged User:", req.user._id);

    const resume = await Resume.findOne({
      user: req.user._id,
    }).sort({ createdAt: -1 });


    console.log("Resume Found:", resume);


    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }


    res.status(200).json({
      success: true,
      resume,
    });


  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Export Controllers
module.exports = {
  uploadResume,
  getLatestResume
};