const Interview = require("../models/Interview");
const evaluateAnswer = require("../utils/geminiInterviewEvaluation");

const submitInterviewController = async (req, res) => {
  try {

    const {
      interviewId,
      questionIndex,
      question,
      answer,
    } = req.body;

    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message: "Interview ID is required",
      });
    }

    if (!answer || !answer.trim()) {
      return res.status(400).json({
        success: false,
        message: "Answer is required",
      });
    }

    const interview = await Interview.findOne({
      _id: interviewId,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    // AI evaluates spoken answer
    const evaluation = await evaluateAnswer(
      question,
      answer
    );

    // Save answer
    interview.questions[questionIndex].answer =
      answer;

    interview.questions[questionIndex].score =
      evaluation.score;

    interview.questions[questionIndex].feedback =
      evaluation.feedback;

    interview.questions[questionIndex].improvement =
      evaluation.improvement;

    // Calculate total score
    let totalScore = 0;

    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
    });

    interview.totalScore = totalScore;

    await interview.save();

    res.status(200).json({
      success: true,

      message: "Answer evaluated successfully",

      evaluation,

      interview,
    });

  } catch (error) {

    console.log(
      "Submit Interview Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to evaluate answer",
    });
  }
};

module.exports = {
  submitInterviewController,
};