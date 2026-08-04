const { GoogleGenAI } = require("@google/genai");

const CoachHistory = require("../models/CoachHistory");
const Resume = require("../models/Resume");
const CoachScore = require("../models/CoachScore");
const Roadmap = require("../models/Roadmap");
const Interview = require("../models/Interview");
const SkillGap = require("../models/SkillGap");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


// ======================================================
// ASK AI COACH
// ======================================================

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

    console.log("================================");
    console.log("Loading Coach Dashboard");
    console.log("User:", userId);
    console.log("================================");


    // ==================================================
    // INITIAL SCORES
    // ==================================================

    let careerScore = 0;
    let roadmapProgress = 0;
    let resumeScore = 0;
    let interviewScore = 0;


    // ==================================================
    // 1. CAREER SCORE
    // ==================================================

    const latestSkillGap = await SkillGap.findOne({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    console.log("SKILL GAP DATA:", latestSkillGap);

    console.log(
      "Latest Skill Gap:",
      latestSkillGap ? latestSkillGap._id : "NONE"
    );

    if (
      latestSkillGap &&
      latestSkillGap.readinessScore !== undefined &&
      latestSkillGap.readinessScore !== null
    ) {

      careerScore = Math.min(
        Math.max(
          Number(latestSkillGap.readinessScore) || 0,
          0
        ),
        100
      );
    }


    // ==================================================
    // 2. RESUME SCORE
    // ==================================================

    const latestResume = await Resume.findOne({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    console.log(
      "Latest Resume:",
      latestResume ? latestResume._id : "NONE"
    );

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

    const roadmap = await Roadmap.findOne({
      user: userId,
    }).sort({
      createdAt: -1,
    });
    
    console.log("ROADMAP DATA:", roadmap);

    console.log(
      "Latest Roadmap:",
      roadmap ? roadmap._id : "NONE"
    );

    if (
      roadmap &&
      Array.isArray(roadmap.phases) &&
      roadmap.phases.length > 0
    ) {

      const totalPhases = roadmap.phases.length;

      const completedPhases = roadmap.phases.filter(
        (phase) => phase.completed === true
      ).length;

      roadmapProgress = Math.round(
        (completedPhases / totalPhases) * 100
      );

      console.log(
        "Roadmap:",
        completedPhases,
        "/",
        totalPhases,
        "=",
        roadmapProgress + "%"
      );
    }


    // ==================================================
    // 4. INTERVIEW SCORE
    // ==================================================

    const latestInterview = await Interview.findOne({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    console.log("INTERVIEW DATA:", latestInterview);

    console.log(
      "Latest Interview:",
      latestInterview ? latestInterview._id : "NONE"
    );

    if (
      latestInterview &&
      latestInterview.totalScore !== undefined &&
      latestInterview.totalScore !== null
    ) {

      interviewScore = Math.min(
        Math.max(
          Number(latestInterview.totalScore) || 0,
          0
        ),
        100
      );
    }


    // ==================================================
    // 5. SAVE SCORES
    // ==================================================

    const savedScore = await CoachScore.findOneAndUpdate(
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

    console.log("================================");
    console.log("Coach Scores Saved:");
    console.log({
      careerScore,
      roadmapProgress,
      resumeScore,
      interviewScore,
    });
    console.log("================================");


    // ==================================================
    // 6. SEND TO FRONTEND
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