const { GoogleGenAI } = require("@google/genai");
const CoachHistory = require("../models/CoachHistory");
const User = require("../models/User");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


// =========================
// ASK AI COACH
// =========================
const askCoachController = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const prompt = `
You are CareerPilot AI Career Coach.

You are helping a student with career development.

User Question:
${message}

Give practical, personalized and easy-to-understand guidance.

Focus on:
- Career guidance
- Resume improvement
- Skill development
- Learning roadmap
- Interview preparation
- Projects
- Placement preparation

Do not return JSON.
Return a normal conversational answer.
`;

    console.log("Calling Gemini AI Coach...");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const answer = response.text;

    console.log("AI Coach Response Received");

    // Save chat history
    if (req.user?._id) {
      await CoachHistory.create({
        user: req.user._id,
        question: message.trim(),
        answer,
      });
    }

    return res.status(200).json({
      success: true,
      answer,
    });

  } catch (error) {
    console.error("AI Coach Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "AI Coach failed",
    });
  }
};


// =========================
// GET COACH HISTORY
// =========================
const getCoachHistory = async (req, res) => {
  try {
    const history = await CoachHistory.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      history,
    });

  } catch (error) {
    console.error("Coach History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load coach history",
    });
  }
};


// =========================
// GET COACH DASHBOARD
// =========================
const getCoachDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const latestResumeScore =
      user?.resumeScore ||
      0;

    const historyCount = await CoachHistory.countDocuments({
      user: req.user._id,
    });

    return res.status(200).json({
      success: true,

      score: {
        careerScore: 0,
        roadmapProgress: 0,
        resumeScore: latestResumeScore,
        interviewScore: 0,
      },

      historyCount,
    });

  } catch (error) {
    console.error("Coach Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load coach dashboard",
    });
  }
};


module.exports = {
  askCoachController,
  getCoachHistory,
  getCoachDashboard,
};