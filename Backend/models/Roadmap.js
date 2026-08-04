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
    },

    roadmapTitle: {
      type: String,
      default: "AI Career Roadmap",
    },

    phases: [
      {
        title: {
          type: String,
        },

        duration: {
          type: String,
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

module.exports = mongoose.model("Roadmap", roadmapSchema);