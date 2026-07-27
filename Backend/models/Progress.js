const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeScore: {
      type: Number,
      default: 0,
    },

    interviewScore: {
      type: Number,
      default: 0,
    },

    learningCompleted: {
      type: Number,
      default: 0,
    },

    roadmapCompleted: {
      type: Number,
      default: 0,
    },

    overallProgress: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Progress", progressSchema);