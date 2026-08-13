const mongoose = require("mongoose");

// =====================================================
// ROADMAP ITEM SCHEMA
// =====================================================

const roadmapItemSchema = new mongoose.Schema(
  {
    phase: {
      type: String,
      default: "",
    },

    duration: {
      type: String,
      default: "",
    },

    actionItems: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  }
);

// =====================================================
// SKILL GAP SCHEMA
// =====================================================

const skillGapSchema = new mongoose.Schema(
  {
    // ==========================================
    // USER
    // ==========================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // RESUME
    // ==========================================

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    // ==========================================
    // TARGET ROLE
    // ==========================================

    targetRole: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // CURRENT SKILLS
    // ==========================================

    currentSkills: {
      type: [String],
      default: [],
    },

    // ==========================================
    // MISSING SKILLS
    // ==========================================

    missingSkills: {
      type: [String],
      default: [],
    },

    // ==========================================
    // READINESS SCORE
    // ==========================================

    readinessScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ==========================================
    // RECOMMENDED COURSES
    // ==========================================

    recommendedCourses: {
      type: [String],
      default: [],
    },

    // ==========================================
    // ROADMAP
    // ==========================================

    roadmap: {
      type: [roadmapItemSchema],
      default: [],
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SkillGap",
  skillGapSchema
);