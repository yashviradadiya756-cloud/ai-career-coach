const Interview = require("../models/Interview");
const generateInterviewQuestions = require("../utils/geminiInterview");

// ==========================================
// GENERATE INTERVIEW
// ==========================================

const generateInterviewController = async (req, res) => {
  try {
    const { targetRole } = req.body;

    console.log("=================================");
    console.log("INTERVIEW GENERATE API");
    console.log("User:", req.user?._id);
    console.log("Target Role:", targetRole);
    console.log("=================================");

    // ==========================================
    // VALIDATE TARGET ROLE
    // ==========================================

    if (
      !targetRole ||
      typeof targetRole !== "string" ||
      !targetRole.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Target Role is required",
      });
    }

    // ==========================================
    // GENERATE QUESTIONS
    // ==========================================

    const interviewData =
      await generateInterviewQuestions(
        targetRole.trim()
      );

    if (
      !interviewData ||
      !Array.isArray(interviewData.questions) ||
      interviewData.questions.length === 0
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Failed to generate interview questions",
      });
    }

    // ==========================================
    // FORMAT QUESTIONS FOR DATABASE
    // ==========================================

    const questions =
      interviewData.questions.map((q) => ({
        question: q.question,
        answer: "",
        feedback: "",
        improvement: "",
        score: 0,
      }));

    // ==========================================
    // SAVE INTERVIEW
    // ==========================================

    const interview = await Interview.create({
      user: req.user._id,
      targetRole: targetRole.trim(),
      questions,
      totalScore: 0,
      improvement: "",
    });

    console.log(
      "✅ Interview saved:",
      interview._id
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,
      message:
        "Interview Questions Generated Successfully",

      interview,
    });
  } catch (error) {
    console.error(
      "❌ Interview Controller Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Interview generation failed",
    });
  }
};

module.exports = {
  generateInterviewController,
};