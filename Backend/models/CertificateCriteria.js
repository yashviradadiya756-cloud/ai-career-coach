const mongoose = require("mongoose");

const certificateCriteriaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    resumeScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    roadmapCompleted: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    learningCompleted: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    interviewScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    overallProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    active: {
      type: Boolean,
      default: true,
    },

    certificateTitle: {
      type: String,
      default: "Certificate of Achievement",
    },

    organizationName: {
      type: String,
      default: "CareerPilot",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CertificateCriteria",
  certificateCriteriaSchema
);