const Interview = require("../models/Interview");
const generateInterviewQuestions = require("../utils/geminiInterview");

const generateInterviewController = async (req, res) => {
  try {
    const { targetRole } = req.body;

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message: "Target Role is required",
      });
    }

    // Generate AI Questions
    const interviewData = await generateInterviewQuestions(targetRole);

    // Format questions
    const questions = interviewData.questions.map((q) => ({
      question: q.question,
      answer: "",
      feedback: "",
      score: 0,
    }));

    // Save Interview
    const interview = await Interview.create({
      user: req.user._id,
      targetRole,
      questions,
      totalScore: 0,
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
      message: error.message,
    });
  }
};

module.exports = {
  generateInterviewController,
};