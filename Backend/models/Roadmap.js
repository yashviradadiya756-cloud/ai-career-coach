const mongoose = require("mongoose");

const phaseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      default: "Flexible",
    },

    topics: {
      type: [String],
      default: [],
    },

    projects: {
      type: [String],
      default: [],
    },

    resources: {
      type: [String],
      default: [],
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  }
);

const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    targetRole: {
      type: String,
      required: true,
      trim: true,
    },

    roadmapTitle: {
      type: String,
      required: true,
      trim: true,
    },

    phases: {
      type: [phaseSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Roadmap", roadmapSchema);