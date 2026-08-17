const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    criteria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CertificateCriteria",
      required: true,
    },

    certificateId: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      default: "Certificate of Achievement",
    },

    achievementName: {
      type: String,
      required: true,
    },

    recipientName: {
      type: String,
      required: true,
    },

    organizationName: {
      type: String,
      default: "CareerPilot",
    },

    issueDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Generated", "Revoked"],
      default: "Generated",
    },

    certificateUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Certificate",
  certificateSchema
);