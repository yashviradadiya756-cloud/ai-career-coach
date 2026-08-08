const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ===============================
// GET SETTINGS / PROFILE
// ===============================

const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Settings Error:", error);

    res.status(500).json({
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
    const { name, phone } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};


// ===============================
// UPDATE PREFERENCES
// ===============================

const updatePreferences = async (req, res) => {
  try {
    const {
      darkMode,
      emailNotifications,
      pushNotifications,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.preferences) {
      user.preferences = {};
    }

    if (darkMode !== undefined) {
      user.preferences.darkMode = darkMode;
    }

    if (emailNotifications !== undefined) {
      user.preferences.emailNotifications = emailNotifications;
    }

    if (pushNotifications !== undefined) {
      user.preferences.pushNotifications = pushNotifications;
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Preferences updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Preferences Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update preferences",
    });
  }
};


// ===============================
// CHANGE PASSWORD
// ===============================

const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};


// ===============================
// DELETE ACCOUNT
// ===============================

const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete Account Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete account",
    });
  }
};


module.exports = {
  getSettings,
  updateProfile,
  updatePreferences,
  changePassword,
  deleteAccount,
};