const Interview = require("../models/Interview");
const generateInterviewQuestions = require("../utils/geminiInterview");

const generateInterviewController = async (req, res) => {
  try {
    const { targetRole } = req.body;

    if (!targetRole || !targetRole.trim()) {
      return res.status(400).json({
        success: false,
        message: "Target Role is required",
      });
    }

    console.log("Generating interview for:", targetRole);

    const interviewData = await generateInterviewQuestions(
      targetRole.trim()
    );

    if (
      !interviewData ||
      !Array.isArray(interviewData.questions)
    ) {
      return res.status(500).json({
        success: false,
        message: "Invalid interview questions generated",
      });
    }

    const questions = interviewData.questions.map((q) => ({
      question: q.question,
      answer: "",
      feedback: "",
      improvement: "",
      score: 0,
    }));

    const interview = await Interview.create({
      user: req.user._id,
      targetRole: targetRole.trim(),
      questions,
      totalScore: 0,
      improvement: "",
    });

    res.status(201).json({
      success: true,
      message: "Interview Questions Generated Successfully",
      interview,
    });

  } catch (error) {
    console.log("Interview Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Interview generation failed",
    });
  }
};

module.exports = {
  generateInterviewController,
};