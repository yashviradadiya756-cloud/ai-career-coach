const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
    },

    phone: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    authProvider: {
      type: String,
      default: "local",
    },

    googleId: {
      type: String,
      default: null,
    },

    plan: {
      type: String,
      default: "Free",
    },

    profileImage: {
      type: String,
      default: "",
    },

    subscriptionStatus: {
      type: String,
      default: "Inactive",
    },

    preferences: {
      darkMode: {
        type: Boolean,
        default: false,
      },

      emailNotifications: {
        type: Boolean,
        default: true,
      },

      pushNotifications: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "User",
  userSchema
);