const mongoose = require("mongoose");

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
    },

    currentSkills: [
      {
        type: String,
      },
    ],

    missingSkills: [
      {
        type: String,
      },
    ],

    readinessScore: {
      type: Number,
      default: 0,
    },

    recommendedCourses: [
      {
        type: String,
      },
    ],

    roadmap: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SkillGap", skillGapSchema);