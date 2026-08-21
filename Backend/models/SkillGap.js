const mongoose = require("mongoose");

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

const skillGapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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