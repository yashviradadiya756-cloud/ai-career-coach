const mongoose = require("mongoose");

const skillGapSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      targetRole: {
        type: String,
        required: true,
      },

      currentSkills: {
        type: [String],
        default: [],
      },

      missingSkills: {
        type: [String],
        default: [],
      },

      skillMatchPercentage: {
        type: Number,
        default: 0,
      },

      strengths: {
        type: [String],
        default: [],
      },

      weaknesses: {
        type: [String],
        default: [],
      },

      recommendations: {
        type: [String],
        default: [],
      },

      roadmap: {
        type: [String],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "SkillGap",
    skillGapSchema
  );