const Interview = require("../models/Interview");
const evaluateAnswer = require("../utils/geminiEvaluate");

const submitInterviewController = async (req, res) => {
  try {
    const { interviewId, answers } = req.body;

    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message: "Interview ID is required",
      });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be an array",
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

    let totalScore = 0;

    for (let i = 0; i < interview.questions.length; i++) {
      const question = interview.questions[i];

      const submittedAnswer = answers[i] || "";

      if (!submittedAnswer.trim()) {
        question.answer = "";
        question.feedback = "No answer provided.";
        question.improvement =
          "Try to provide a clear and structured answer.";
        question.score = 0;

        continue;
      }

      const evaluation = await evaluateAnswer(
        question.question,
        submittedAnswer
      );

      question.answer = submittedAnswer;
      question.feedback = evaluation.feedback || "";
      question.improvement = evaluation.improvement || "";
      question.score = Number(evaluation.score) || 0;

      totalScore += question.score;
    }

    interview.totalScore =
      interview.questions.length > 0
        ? Math.round(totalScore / interview.questions.length)
        : 0;

    await interview.save();

    res.status(200).json({
      success: true,
      message: "Interview Submitted Successfully",
      interview,
    });

  } catch (error) {
    console.log("Submit Interview Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Interview submission failed",
    });
  }
};

module.exports = {
  submitInterviewController,
};