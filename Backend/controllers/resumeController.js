const fs = require("fs");
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const Resume = require("../models/Resume");

// =====================================================
// GEMINI AI SETUP
// =====================================================

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeResumeWithAI = async (resumeText) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are an expert ATS resume analyzer. Analyze the following resume text and return a JSON evaluation.

Resume:
"""
${resumeText.slice(0, 8000)}
"""

Respond with ONLY a raw JSON object — no markdown, no code blocks, no explanation. Use this exact structure:
{
  "atsScore": <integer 0-100>,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "missingSkills": ["skill 1", "skill 2", "skill 3"],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}
`;

  const result = await model.generateContent(prompt);
  let text = result.response.text().trim();

  // Strip markdown code fences if present
  text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

  const parsed = JSON.parse(text);

  return {
    atsScore:      Number(parsed.atsScore)      || 0,
    strengths:     Array.isArray(parsed.strengths)     ? parsed.strengths     : [],
    weaknesses:    Array.isArray(parsed.weaknesses)    ? parsed.weaknesses    : [],
    missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
    suggestions:   Array.isArray(parsed.suggestions)   ? parsed.suggestions   : [],
  };
};

// =====================================================
// UPLOAD RESUME
// =====================================================

const uploadResume = async (req, res) => {
  try {
    console.log("=================================");
    console.log("RESUME UPLOAD STARTED");
    console.log("=================================");

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload a PDF resume" });
    }

    // ==========================================
    // READ PDF
    // ==========================================

    const filePath = req.file.path;
    const pdfBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text || "";

    console.log("PDF TEXT LENGTH:", resumeText.length);

    // ==========================================
    // AI ANALYSIS
    // ==========================================

    console.log("Running AI analysis...");

    let analysis = {
      atsScore: 0,
      strengths: [],
      weaknesses: [],
      missingSkills: [],
      suggestions: [],
    };

    try {
      analysis = await analyzeResumeWithAI(resumeText);
      console.log("AI ANALYSIS DONE:", analysis);
    } catch (aiError) {
      console.error("AI ANALYSIS FAILED (saving with defaults):", aiError.message);
    }

    // ==========================================
    // SAVE RESUME WITH ANALYSIS
    // ==========================================

    const resume = await Resume.create({
      user:          req.user._id,
      fileName:      req.file.originalname,
      filePath:      req.file.path,
      resumeText,
      atsScore:      analysis.atsScore,
      strengths:     analysis.strengths,
      weaknesses:    analysis.weaknesses,
      missingSkills: analysis.missingSkills,
      suggestions:   analysis.suggestions,
    });

    console.log("RESUME SAVED:", resume._id);

    return res.status(201).json({
      success: true,
      message: "Resume uploaded and analyzed successfully",
      resume,
    });

  } catch (error) {
    console.error("RESUME UPLOAD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Resume upload failed",
    });
  }
};

// =====================================================
// GET LATEST RESUME
// =====================================================

const getLatestResume = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found",
      });
    }

    return res.status(200).json({ success: true, resume });

  } catch (error) {
    console.error("GET LATEST RESUME ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get latest resume",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = { uploadResume, getLatestResume };