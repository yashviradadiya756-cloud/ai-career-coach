const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "Video Course",
        "Article",
        "Documentation",
        "Project",
        "Certification",
        "Practice",
        "Book",
        "Other",
      ],
      default: "Video Course",
    },

    category: {
      type: String,
      default: "Web Development",
      trim: true,
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    provider: {
      type: String,
      default: "Online",
      trim: true,
    },

    duration: {
      type: String,
      default: "Self-Paced",
      trim: true,
    },

    url: {
      type: String,
      required: true,
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
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);