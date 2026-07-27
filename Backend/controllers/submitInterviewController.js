const Interview = require("../models/Interview");
const evaluateAnswer = require("../utils/geminiInterviewEvaluation");

const submitInterviewController = async (req, res) => {
  try {
    const { interviewId, answers } = req.body;

    if (!interviewId || !answers) {
      return res.status(400).json({
        success: false,
        message: "Interview ID and answers are required",
      });
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    let totalScore = 0;

    for (const item of answers) {
      const question = interview.questions[item.questionIndex];

      if (!question) continue;

      const result = await evaluateAnswer(
        question.question,
        item.answer
      );

      question.answer = item.answer;
      question.feedback = result.feedback;
      question.improvement = result.improvement;
      question.score = result.score;

      totalScore += result.score;
    }

    interview.totalScore = totalScore;

    await interview.save();

    res.status(200).json({
      success: true,
      message: "Interview Evaluated Successfully",
      interview,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  submitInterviewController,
};