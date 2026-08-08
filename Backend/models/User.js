const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Full name
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    // Username
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },

    // Email
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Password
    password: {
      type: String,
      required: true,
    },

    // Phone
    phone: {
      type: String,
      default: "",
      trim: true,
    },

    // Preferences
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

module.exports = mongoose.model("User", userSchema);