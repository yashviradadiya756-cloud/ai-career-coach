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
    console.log("USER ID FROM JWT:", userId.toString());

    const testSkillGaps = await SkillGap.find({});

    console.log("TOTAL SKILL GAP RECORDS:", testSkillGaps.length);

    testSkillGaps.forEach((item, index) => {
      console.log(`SKILL GAP ${index + 1}:`);
      console.log("ID:", item._id.toString());
      console.log("USER:", item.user.toString());
      console.log("READINESS:", item.readinessScore);
      console.log("ROLE:", item.targetRole);
    });

    const matchingSkillGap = await SkillGap.findOne({
      user: userId,
    });

    console.log("MATCHING SKILL GAP:", matchingSkillGap);
    console.log("================================");

    // ============================================
    // DEFAULT SCORES
    // ============================================

    let careerScore = 0;
    let roadmapProgress = 0;
    let resumeScore = 0;
    let interviewScore = 0;


    // ============================================
    // 1. CAREER / SKILL GAP SCORE
    // ============================================

    const latestSkillGap = await SkillGap.findOne({
      user: userId,
    })
      .sort({ createdAt: -1 });

      console.log("================================");
console.log("SKILL GAP DEBUG");
console.log("Logged-in User ID:", userId.toString());

console.log(
  "All SkillGap records:",
  await SkillGap.find({}).select("user readinessScore targetRole createdAt")
);

console.log(
  "User SkillGap records:",
  await SkillGap.find({ user: userId }).select(
    "user readinessScore targetRole createdAt"
  )
);

console.log(
  "Latest SkillGap:",
  latestSkillGap
);

if (latestSkillGap) {
  console.log(
    "Latest SkillGap user:",
    latestSkillGap.user.toString()
  );

  console.log(
    "Latest SkillGap readinessScore:",
    latestSkillGap.readinessScore
  );

  console.log(
    "Readiness type:",
    typeof latestSkillGap.readinessScore
  );
}

console.log("================================");

    console.log(
      "LATEST SKILL GAP:",
      latestSkillGap
        ? latestSkillGap._id.toString()
        : "NOT FOUND"
    );

    if (latestSkillGap) {

      console.log(
        "READINESS SCORE:",
        latestSkillGap.readinessScore
      );

      careerScore = Math.min(
        Math.max(
          Number(latestSkillGap.readinessScore) || 0,
          0
        ),
        100
      );
    }


    // ============================================
    // 2. RESUME SCORE
    // ============================================

    const latestResume = await Resume.findOne({
      user: userId,
    })
      .sort({ createdAt: -1 });

    console.log(
      "LATEST RESUME:",
      latestResume
        ? latestResume._id.toString()
        : "NOT FOUND"
    );

    if (latestResume) {

      console.log(
        "ATS SCORE:",
        latestResume.atsScore
      );

      resumeScore = Math.min(
        Math.max(
          Number(latestResume.atsScore) || 0,
          0
        ),
        100
      );
    }


    // ============================================
    // 3. ROADMAP PROGRESS
    // ============================================

    const roadmap = await Roadmap.findOne({
      user: userId,
    })
      .sort({ createdAt: -1 });

    console.log(
      "LATEST ROADMAP:",
      roadmap
        ? roadmap._id.toString()
        : "NOT FOUND"
    );

    /*
      Your current Roadmap model does not have
      completed/progress fields.

      So for now we calculate roadmap progress
      based on completed phases only if that
      field exists.
    */

    if (
      roadmap &&
      Array.isArray(roadmap.phases) &&
      roadmap.phases.length > 0
    ) {

      const totalPhases = roadmap.phases.length;

      const completedPhases = roadmap.phases.filter(
        phase => phase.completed === true
      ).length;

      roadmapProgress = Math.round(
        (completedPhases / totalPhases) * 100
      );

      console.log(
        "ROADMAP PROGRESS:",
        completedPhases,
        "/",
        totalPhases,
        "=",
        roadmapProgress
      );
    }


    // ============================================
    // 4. INTERVIEW SCORE
    // ============================================

    const latestInterview = await Interview.findOne({
      user: userId,
    })
      .sort({ createdAt: -1 });

    console.log(
      "LATEST INTERVIEW:",
      latestInterview
        ? latestInterview._id.toString()
        : "NOT FOUND"
    );

    if (latestInterview) {

      console.log(
        "INTERVIEW TOTAL SCORE:",
        latestInterview.totalScore
      );

      interviewScore = Math.min(
        Math.max(
          Number(latestInterview.totalScore) || 0,
          0
        ),
        100
      );
    }


    // ============================================
    // 5. SAVE SCORES
    // ============================================

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
    console.log("FINAL SCORES");
    console.log({
      careerScore,
      roadmapProgress,
      resumeScore,
      interviewScore,
    });
    console.log("================================");


    // ============================================
    // 6. RESPONSE
    // ============================================

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