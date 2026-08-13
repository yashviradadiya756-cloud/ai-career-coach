const mongoose = require("mongoose");

// =====================================================
// ROADMAP ITEM SCHEMA
// =====================================================

const roadmapItemSchema = new mongoose.Schema(
  {
    phase: {
      type: String,
      required: true,
      default: "",
    },

    duration: {
      type: String,
      required: true,
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    targetRole: {
      type: String,
      required: true,
      trim: true,
    },

    currentSkills: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    readinessScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    recommendedCourses: {
      type: [String],
      default: [],
    },

    // =================================================
    // IMPORTANT
    // =================================================
    // DO NOT use:
    //
    // roadmap: [String]
    //
    // because roadmap is now an array of objects.
    // =================================================

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