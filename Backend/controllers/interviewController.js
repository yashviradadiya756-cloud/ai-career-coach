const Interview = require("../models/Interview");
const generateInterviewQuestions = require("../utils/geminiInterview");

// ==========================================
// GENERATE INTERVIEW
// ==========================================

const generateInterviewController = async (
  req,
  res
) => {
  try {
    const { targetRole } = req.body;

    console.log(
      "================================="
    );
    console.log("INTERVIEW GENERATION");
    console.log("User:", req.user?._id);
    console.log("Target Role:", targetRole);
    console.log(
      "================================="
    );

    // Validate target role
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

    // Generate questions using Gemini
    const interviewData =
      await generateInterviewQuestions(
        targetRole.trim()
      );

    if (
      !interviewData ||
      !Array.isArray(
        interviewData.questions
      ) ||
      interviewData.questions.length === 0
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Invalid interview questions generated",
      });
    }

    // Prepare questions for MongoDB
    const questions =
      interviewData.questions.map((q) => ({
        question: q.question,
        answer: "",
        feedback: "",
        improvement: "",
        score: 0,
      }));

    // Save interview
    const interview = await Interview.create({
      user: req.user._id,
      targetRole: targetRole.trim(),
      questions,
      totalScore: 0,
      improvement: "",
    });

    console.log(
      "Interview saved:",
      interview._id
    );

    return res.status(201).json({
      success: true,
      message:
        "Interview Questions Generated Successfully",
      interview,
    });
  } catch (error) {
    console.error(
      "================================="
    );
    console.error("INTERVIEW GENERATION ERROR");
    console.error(error);
    console.error(
      "================================="
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