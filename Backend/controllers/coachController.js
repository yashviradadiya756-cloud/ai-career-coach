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

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const answer = response.text;

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
    console.log("COACH DASHBOARD");
    console.log("USER ID:", userId.toString());
    console.log("================================");


    // ==================================================
    // DEFAULT VALUES
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

    if (latestSkillGap) {
      careerScore = Math.min(
        Math.max(
          Number(latestSkillGap.readinessScore) || 0,
          0
        ),
        100
      );
    }

    console.log(
      "CAREER SCORE:",
      careerScore
    );


    // ==================================================
    // 2. RESUME SCORE
    // ==================================================

    const latestResume = await Resume.findOne({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    if (latestResume) {
      resumeScore = Math.min(
        Math.max(
          Number(latestResume.atsScore) || 0,
          0
        ),
        100
      );
    }

    console.log(
      "RESUME SCORE:",
      resumeScore
    );

    // ==================================================
    // 3. ROADMAP PROGRESS
    // ==================================================

    const latestRoadmap = await Roadmap.findOne({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    if (
      latestRoadmap &&
      Array.isArray(latestRoadmap.phases) &&
      latestRoadmap.phases.length > 0
    ) {

      const totalPhases = latestRoadmap.phases.length;

      const completedPhases = latestRoadmap.phases.filter(
        (phase) => phase.completed === true
      ).length;

      roadmapProgress = Math.round(
        (completedPhases / totalPhases) * 100
      );

      console.log(
        `ROADMAP: ${completedPhases}/${totalPhases} = ${roadmapProgress}%`
      );

    } else {

      console.log(
        "ROADMAP: Not found or no phases"
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

    if (latestInterview) {

      let calculatedInterviewScore = 0;

      // Calculate directly from question scores
      if (
        Array.isArray(latestInterview.questions) &&
        latestInterview.questions.length > 0
      ) {

        const scores = latestInterview.questions
          .map((question) => Number(question.score))
          .filter(
            (score) =>
              Number.isFinite(score) &&
              score >= 0
          );

        if (scores.length > 0) {

          const total = scores.reduce(
            (sum, score) => sum + score,
            0
          );

          calculatedInterviewScore = Math.round(
            total / scores.length
          );
        }
      }

      // Fallback to totalScore
      if (
        calculatedInterviewScore === 0 &&
        Number(latestInterview.totalScore) > 0
      ) {
        calculatedInterviewScore =
          Number(latestInterview.totalScore);
      }

      interviewScore = Math.min(
        Math.max(
          calculatedInterviewScore,
          0
        ),
        100
      );

      console.log(
        "INTERVIEW QUESTIONS:",
        latestInterview.questions.length
      );

      console.log(
        "INTERVIEW SCORE:",
        interviewScore + "%"
      );

    } else {

      console.log(
        "INTERVIEW: No interview found"
      );

    }

    // ==================================================
    // 5. SAVE SCORES
    // ==================================================

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


    // ==================================================
    // 6. FINAL RESULT
    // ==================================================

    console.log("================================");
    console.log("FINAL COACH SCORES");
    console.log({
      careerScore,
      roadmapProgress,
      resumeScore,
      interviewScore,
    });
    console.log("================================");


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
      "COACH DASHBOARD ERROR:",
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