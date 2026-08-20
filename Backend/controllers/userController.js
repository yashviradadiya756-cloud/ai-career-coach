const User = require("../models/User");
const bcrypt = require("bcryptjs");

// =====================================================
// GET PROFILE
// =====================================================

const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

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
    console.error(
      "GET PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get profile",
    });
  }
};

// =====================================================
// UPDATE PROFILE
// =====================================================

const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
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

    const {
      name,
      username,
      email,
      phone,
    } = req.body;

    if (name !== undefined) {
      user.name = name;
    }

    if (username !== undefined) {
      user.username = username;
    }

    if (email !== undefined) {
      user.email = email;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    const updatedUser = await user.save();

    const safeUser = updatedUser.toObject();

    delete safeUser.password;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error(
      "UPDATE PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update profile",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getProfile,
  updateProfile,
};