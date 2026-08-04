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
// GET COACH DASHBOARD
// ======================================================

const getCoachDashboardController = async (req, res) => {
  try {
    console.log("\n========================================");
    console.log("🔥 COACH DASHBOARD START");
    console.log("========================================");

    // ==========================================
    // 1. GET LOGGED-IN USER
    // ==========================================

    const userId = req.user._id;

    console.log("JWT USER ID:", String(userId));

    // ==========================================
    // 2. GET ALL SKILL GAPS
    // ==========================================

    const allSkillGaps = await SkillGap.find({}).lean();

    console.log(
      "TOTAL SKILL GAP RECORDS:",
      allSkillGaps.length
    );

    allSkillGaps.forEach((item, index) => {
      console.log(
        `SKILL GAP ${index + 1}:`,
        {
          id: String(item._id),
          user: String(item.user),
          readinessScore: item.readinessScore,
          targetRole: item.targetRole,
        }
      );
    });

    // ==========================================
    // 3. FIND USER'S SKILL GAP
    // ==========================================

    const userSkillGaps = allSkillGaps.filter(
      item =>
        String(item.user) === String(userId)
    );

    console.log(
      "MATCHING USER SKILL GAPS:",
      userSkillGaps.length
    );

    // Latest SkillGap
    const latestSkillGap = userSkillGaps
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )[0];

    console.log(
      "LATEST USER SKILL GAP:",
      latestSkillGap
    );

    // ==========================================
    // 4. CAREER SCORE
    // ==========================================

    let careerScore = 0;

    if (latestSkillGap) {

      console.log(
        "RAW READINESS SCORE:",
        latestSkillGap.readinessScore
      );

      console.log(
        "READINESS SCORE TYPE:",
        typeof latestSkillGap.readinessScore
      );

      careerScore = Number(
        latestSkillGap.readinessScore
      );

      if (!Number.isFinite(careerScore)) {
        careerScore = 0;
      }

      careerScore = Math.max(
        0,
        Math.min(100, careerScore)
      );
    }

    console.log(
      "🔥 CALCULATED CAREER SCORE:",
      careerScore
    );

    // ==========================================
    // 5. RESUME SCORE
    // ==========================================

    let resumeScore = 0;

    const latestResume = await Resume.findOne({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    console.log(
      "LATEST RESUME:",
      latestResume
        ? String(latestResume._id)
        : "NOT FOUND"
    );

    if (latestResume) {

      resumeScore = Number(
        latestResume.atsScore
      );

      if (!Number.isFinite(resumeScore)) {
        resumeScore = 0;
      }

      resumeScore = Math.max(
        0,
        Math.min(100, resumeScore)
      );
    }

    // ==========================================
    // 6. ROADMAP PROGRESS
    // ==========================================

    let roadmapProgress = 0;

    const roadmap = await Roadmap.findOne({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    console.log(
      "LATEST ROADMAP:",
      roadmap
        ? String(roadmap._id)
        : "NOT FOUND"
    );

    if (
      roadmap &&
      Array.isArray(roadmap.phases) &&
      roadmap.phases.length > 0
    ) {

      const totalPhases =
        roadmap.phases.length;

      const completedPhases =
        roadmap.phases.filter(
          phase => phase.completed === true
        ).length;

      roadmapProgress = Math.round(
        (completedPhases / totalPhases) * 100
      );
    }

    // ==========================================
    // 7. INTERVIEW SCORE
    // ==========================================

    let interviewScore = 0;

    const latestInterview =
      await Interview.findOne({
        user: userId,
      })
        .sort({ createdAt: -1 })
        .lean();

    console.log(
      "LATEST INTERVIEW:",
      latestInterview
        ? String(latestInterview._id)
        : "NOT FOUND"
    );

    if (latestInterview) {

      interviewScore = Number(
        latestInterview.totalScore
      );

      if (!Number.isFinite(interviewScore)) {
        interviewScore = 0;
      }

      interviewScore = Math.max(
        0,
        Math.min(100, interviewScore)
      );
    }

    // ==========================================
    // 8. FINAL SCORES
    // ==========================================

    const finalScores = {
      careerScore,
      roadmapProgress,
      resumeScore,
      interviewScore,
    };

    console.log("\n========================================");
    console.log("🔥 FINAL COACH SCORES");
    console.log(finalScores);
    console.log("========================================\n");

    // ==========================================
    // 9. SAVE SCORE
    // ==========================================

    await CoachScore.findOneAndUpdate(
      {
        user: userId,
      },
      {
        $set: finalScores,
      },
      {
        upsert: true,
        new: true,
      }
    );

    // ==========================================
    // 10. RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      scores: finalScores,
    });

  } catch (error) {

    console.error(
      "❌ COACH DASHBOARD ERROR:",
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