const mongoose = require("mongoose");

const learningSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    skillGap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SkillGap",
      required: true,
    },

    targetRole: {
      type: String,
      required: true,
    },

    recommendations: [
      {
        skill: {
          type: String,
          default: "",
        },

        course: {
          type: String,
          default: "",
        },

        platform: {
          type: String,
          default: "",
        },

        duration: {
          type: String,
          default: "",
        },

        level: {
          type: String,
          default: "",
        },

        url: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Learning",
  learningSchema
);