const mongoose = require("mongoose");

const coachScoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    careerScore: {
      type: Number,
      default: 0,
    },

    roadmapProgress: {
      type: Number,
      default: 0,
    },

    resumeScore: {
      type: Number,
      default: 0,
    },

    interviewScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CoachScore",
  coachScoreSchema
);