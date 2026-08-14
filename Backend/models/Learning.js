const mongoose = require("mongoose");

const learningSchema =
  new mongoose.Schema(
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
        trim: true,
      },

      recommendations: [
        {
          skill: {
            type: String,
            default: "",
            trim: true,
          },

          course: {
            type: String,
            default: "",
            trim: true,
          },

          platform: {
            type: String,
            default: "",
            trim: true,
          },

          duration: {
            type: String,
            default: "",
            trim: true,
          },

          level: {
            type: String,
            default: "",
            trim: true,
          },

          url: {
            type: String,
            default: "",
            trim: true,
          },
        },
      ],
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Learning",
    learningSchema
  );