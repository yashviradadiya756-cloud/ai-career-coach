const Resume = require("../models/Resume");
const extractResumeText = require("../utils/pdfParser");
const analyzeResume = require("../utils/geminiResumeAnalyzer");


// Upload Resume
const uploadResume = async (req, res) => {
  try {
    console.log("Step 1: File received");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF uploaded",
      });
    }

    console.log("Step 2: Extracting PDF");

    const resumeText = await extractResumeText(req.file.path);

    console.log("Step 3: Resume extracted");
    console.log(resumeText.substring(0, 200));

    console.log("Step 4: Calling Gemini");

    const analysis = await analyzeResume(resumeText);

    console.log("Step 5: Gemini Result");
    console.log(analysis);

    console.log("Step 6: Saving MongoDB");

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

    console.log("Step 7: Saved");

    res.status(201).json({
      success: true,
      resume,
    });

  } catch (error) {
    console.error("UPLOAD ERROR:");
    console.error(error);

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

exports.getLatestResume = async (req,res)=>{
  try {

    const resume = await Resume.findOne({
      user:req.user._id
    })
    .sort({
      createdAt:-1
    });


    if(!resume){
      return res.status(404).json({
        message:"No resume found"
      });
    }


    res.status(200).json(resume);

  } catch(error){

    res.status(500).json({
      message:error.message
    });

  }
};

// Export Controllers
module.exports = {
  uploadResume,
  getLatestResume
};