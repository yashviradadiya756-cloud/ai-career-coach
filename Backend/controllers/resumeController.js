const Resume = require("../models/Resume");
const extractResumeText = require("../utils/pdfParser");
const analyzeResume = require("../utils/geminiResumeAnalyzer");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No PDF uploaded",
      });
    }

    // Extract PDF text
    const resumeText = await extractResumeText(req.file.path);

    // Analyze with Gemini
    const analysis = await analyzeResume(resumeText);

    // Save everything in MongoDB
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
      message: "Resume uploaded and analyzed successfully",
      resume,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  uploadResume,
};