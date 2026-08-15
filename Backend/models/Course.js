const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    type: {
      type: String,
      default: "Video Course",
      trim: true,
    },
    category: {
      type: String,
      default: "Web Development",
      trim: true,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
      default: "Beginner",
    },
    provider: {
      type: String,
      default: "Online Resource",
      trim: true,
    },
    duration: {
      type: String,
      default: "Self-Paced",
      trim: true,
    },
    url: {
      type: String,
      required: [true, "Course URL is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);