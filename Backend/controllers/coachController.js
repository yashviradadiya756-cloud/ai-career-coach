const CoachChat = require("../models/CoachChat");
const askAICoach = require("../utils/geminiCoach");

const askCoachController = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // Ask Gemini
    const answer = await askAICoach(question.trim());

    // Save chat
    const chat = await CoachChat.create({
      user: req.user._id,
      question: question.trim(),
      answer,
    });

    res.status(200).json({
      success: true,
      message: "AI Coach response generated",
      chat,
    });
  } catch (error) {
    console.log("AI Coach Controller Error:", error);

    // Gemini quota
    if (error.status === 429 || error.message?.includes("429")) {
      return res.status(429).json({
        success: false,
        message:
          "AI usage limit reached. Please wait and try again later.",
      });
    }

    // Gemini temporary unavailable
    if (error.status === 503 || error.message?.includes("503")) {
      return res.status(503).json({
        success: false,
        message:
          "AI service is temporarily busy. Please try again shortly.",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "AI Coach failed",
    });
  }
};


const getCoachHistoryController = async (req, res) => {
  try {
    const chats = await CoachChat.find({
      user: req.user._id,
    })
      .sort({ createdAt: 1 })
      .limit(30);

    res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    console.log("Coach History Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  askCoachController,
  getCoachHistoryController,
};