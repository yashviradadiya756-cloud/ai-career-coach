const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ==========================================
// GET SETTINGS
// ==========================================

const getSettings = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GET SETTINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load settings",
    });
  }
};

// ===============================
// UPDATE PROFILE
// ===============================

const updateProfile = async (req, res) => {
  try {
    const { name, username, phone } = req.body;

    console.log("UPDATE PROFILE BODY:", req.body);
    console.log("USER ID:", req.user._id);

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // FULL NAME
    if (name !== undefined) {
      const cleanName = String(name).trim();

      if (!cleanName) {
        return res.status(400).json({
          success: false,
          message: "Full name cannot be empty",
        });
      }

      user.name = cleanName;
    }

    // USERNAME
    if (username !== undefined) {
      const cleanUsername = String(username).trim();

      if (!cleanUsername) {
        return res.status(400).json({
          success: false,
          message: "Username cannot be empty",
        });
      }

      // Check if another user already has this username
      const usernameExists = await User.findOne({
        username: cleanUsername,
        _id: { $ne: req.user._id },
      });

      if (usernameExists) {
        return res.status(400).json({
          success: false,
          message: "Username is already taken",
        });
      }

      user.username = cleanUsername;
    }

    // PHONE
    if (phone !== undefined) {
      user.phone = String(phone).trim();
    }

    // IMPORTANT:
    // Existing users may not have name in MongoDB.
    // If name is missing, don't allow save without it.
    if (!user.name || !user.name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    await user.save();

    const updatedUser = await User.findById(
      req.user._id
    ).select("-password");

    console.log("PROFILE UPDATED:", updatedUser);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("================================");
    console.error("UPDATE PROFILE ERROR:");
    console.error(error);
    console.error("================================");

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};


// ==========================================
// UPDATE PREFERENCES
// ==========================================

const updatePreferences = async (req, res) => {
  try {
    const {
      darkMode,
      emailNotifications,
      pushNotifications,
    } = req.body;

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (darkMode !== undefined) {
      user.preferences.darkMode = darkMode;
    }

    if (
      emailNotifications !== undefined
    ) {
      user.preferences.emailNotifications =
        emailNotifications;
    }

    if (
      pushNotifications !== undefined
    ) {
      user.preferences.pushNotifications =
        pushNotifications;
    }

    await user.save();

    const updatedUser = await User.findById(
      req.user._id
    ).select("-password");

    return res.status(200).json({
      success: true,
      message:
        "Preferences updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error(
      "UPDATE PREFERENCES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update preferences",
    });
  }
};


// ==========================================
// CHANGE PASSWORD
// ==========================================

const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "New passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordCorrect =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message:
          "Current password is incorrect",
      });
    }

    user.password =
      await bcrypt.hash(
        newPassword,
        10
      );

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password changed successfully",
    });

  } catch (error) {
    console.error(
      "CHANGE PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to change password",
    });
  }
};


// ==========================================
// DELETE ACCOUNT
// ==========================================

const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(
      req.user._id
    );

    return res.status(200).json({
      success: true,
      message:
        "Account deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE ACCOUNT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete account",
    });
  }
};


// ==========================================
// EXPORT EVERYTHING
// ==========================================

module.exports = {
  getSettings,
  updateProfile,
  updatePreferences,
  changePassword,
  deleteAccount,
};