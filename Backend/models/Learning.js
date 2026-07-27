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
        skill: String,
        course: String,
        platform: String,
        duration: String,
        level: String,
        url: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Learning", learningSchema);