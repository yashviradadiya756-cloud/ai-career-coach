const mongoose = require("mongoose");

const phaseSchema = new mongoose.Schema({
  title: String,
  duration: String,
  topics: [String],
  projects: [String],
  resources: [String],

  completed: {
    type: Boolean,
    default: false,
  },
});

const roadmapSchema = new mongoose.Schema(
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

    roadmapTitle: {
      type: String,
      required: true,
    },

    phases: [phaseSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Roadmap", roadmapSchema);