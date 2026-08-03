const { GoogleGenAI } = require("@google/genai");
const CoachHistory = require("../models/CoachHistory");
const User = require("../models/User");
const Resume = require("../models/Resume");
const CoachScore = require("../models/CoachScore");

// Only keep this if these models actually exist in your project
const Roadmap = require("../models/Roadmap");
const Interview = require("../models/Interview");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


// ======================================================
// ASK AI COACH
// ======================================================

const askCoachController = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate message
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
        question: message,
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


// ======================================================
// GET COACH HISTORY
// ======================================================

const getCoachHistoryController = async (req, res) => {
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


// ======================================================
// GET COACH DASHBOARD SCORES
// ======================================================

const getCoachDashboardController = async (req, res) => {
  try {

    const userId = req.user._id;

    console.log("Loading Coach Dashboard for:", userId);


    // ==================================================
    // 1. CAREER SCORE
    // ==================================================

    let careerScore = 0;

    const user = await User.findById(userId).select(
      "careerGoal skills"
    );

    if (user) {

      let careerPoints = 0;

      // Career goal = 40 points
      if (
        user.careerGoal &&
        user.careerGoal.trim()
      ) {
        careerPoints += 40;
      }

      // Skills = up to 60 points
      if (Array.isArray(user.skills)) {

        const skillCount = user.skills.length;

        careerPoints += Math.min(
          skillCount * 10,
          60
        );
      }

      careerScore = Math.min(
        careerPoints,
        100
      );
    }


    // ==================================================
    // 2. RESUME SCORE
    // ==================================================

    let resumeScore = 0;

    const latestResume = await Resume.findOne({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    if (
      latestResume &&
      latestResume.atsScore !== undefined &&
      latestResume.atsScore !== null
    ) {

      resumeScore = Math.min(
        Math.max(
          Number(latestResume.atsScore) || 0,
          0
        ),
        100
      );
    }


    // ==================================================
    // 3. ROADMAP PROGRESS
    // ==================================================

    let roadmapProgress = 0;

    try {

      const roadmap = await Roadmap.findOne({
        user: userId,
      }).sort({
        createdAt: -1,
      });

      if (roadmap) {

        // Option 1:
        // roadmap.progress = 75

        if (
          typeof roadmap.progress === "number"
        ) {

          roadmapProgress = Math.min(
            Math.max(
              roadmap.progress,
              0
            ),
            100
          );
        }

        // Option 2:
        // roadmap.completed = 3
        // roadmap.total = 5

        else if (
          roadmap.completed !== undefined &&
          roadmap.total !== undefined &&
          Number(roadmap.total) > 0
        ) {

          roadmapProgress = Math.round(
            (
              Number(roadmap.completed) /
              Number(roadmap.total)
            ) * 100
          );

        }
      }

    } catch (roadmapError) {

      console.log(
        "Roadmap score unavailable:",
        roadmapError.message
      );

      roadmapProgress = 0;
    }


    // ==================================================
    // 4. INTERVIEW SCORE
    // ==================================================

    let interviewScore = 0;

    try {

      const latestInterview =
        await Interview.findOne({
          user: userId,
        }).sort({
          createdAt: -1,
        });

      if (latestInterview) {

        // score field
        if (
          typeof latestInterview.score === "number"
        ) {

          interviewScore = Math.min(
            Math.max(
              latestInterview.score,
              0
            ),
            100
          );
        }

        // totalScore field
        else if (
          typeof latestInterview.totalScore === "number"
        ) {

          interviewScore = Math.min(
            Math.max(
              latestInterview.totalScore,
              0
            ),
            100
          );
        }
      }

    } catch (interviewError) {

      console.log(
        "Interview score unavailable:",
        interviewError.message
      );

      interviewScore = 0;
    }


    // ==================================================
    // 5. SAVE CURRENT SCORES
    // ==================================================

    const savedScore =
      await CoachScore.findOneAndUpdate(

        {
          user: userId,
        },

        {
          $set: {
            careerScore,
            roadmapProgress,
            resumeScore,
            interviewScore,
          },
        },

        {
          upsert: true,
          new: true,
        }
      );


    console.log(
      "Coach Scores Saved:",
      savedScore
    );


    // ==================================================
    // 6. SEND SCORES TO FRONTEND
    // ==================================================

    return res.status(200).json({

      success: true,

      scores: {

        careerScore,

        roadmapProgress,

        resumeScore,

        interviewScore,

      },

    });

  } catch (error) {

    console.error(
      "Coach Dashboard Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message ||
        "Failed to load dashboard",

    });
  }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {

  askCoachController,

  getCoachHistoryController,

  getCoachDashboardController,

};