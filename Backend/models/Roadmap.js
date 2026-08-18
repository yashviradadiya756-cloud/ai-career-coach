const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema(
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

    roadmapTitle: {
      type: String,
      default: "AI Career Roadmap",
    },

    phases: [
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
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Roadmap",
  roadmapSchema
);