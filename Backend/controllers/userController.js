const User = require("../models/User");
const bcrypt = require("bcryptjs");

// =====================================================
// GET PROFILE
// =====================================================

const getProfile = async (req, res) => {
  console.log("=================================");
  console.log("GET PROFILE CONTROLLER");
  console.log("=================================");

  try {
    // -----------------------------------------------
    // CHECK AUTH USER
    // -----------------------------------------------

    console.log("REQ.USER:", req.user);

    if (!req.user || !req.user._id) {
      console.log("NO AUTHENTICATED USER");

      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // -----------------------------------------------
    // GET USER ID FROM MIDDLEWARE
    // -----------------------------------------------

    const userId = req.user._id;

    console.log("USER ID:", userId);

    // -----------------------------------------------
    // FIND USER
    // -----------------------------------------------

    const user = await User.findById(userId).select(
      "-password"
    );

    console.log(
      "USER FOUND:",
      !!user
    );

    // -----------------------------------------------
    // USER NOT FOUND
    // -----------------------------------------------

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("=================================");
    console.error("GET PROFILE ERROR");
    console.error("ERROR NAME:", error?.name);
    console.error("ERROR MESSAGE:", error?.message);
    console.error("ERROR STACK:", error?.stack);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to get profile",
    });
  }
};

// =====================================================
// UPDATE PROFILE
// =====================================================

const updateProfile = async (req, res) => {
  console.log("=================================");
  console.log("UPDATE PROFILE CONTROLLER");
  console.log("=================================");

  try {
    // -----------------------------------------------
    // CHECK AUTH USER
    // -----------------------------------------------

    console.log("REQ.USER:", req.user);

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // -----------------------------------------------
    // GET USER
    // -----------------------------------------------

    const userId = req.user._id;

    console.log(
      "USER ID:",
      userId
    );

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -----------------------------------------------
    // BODY
    // -----------------------------------------------

    const {
      name,
      username,
      email,
      phone,
    } = req.body;

    console.log("UPDATE DATA:", {
      name,
      username,
      email,
      phone,
    });

    // -----------------------------------------------
    // UPDATE FIELDS
    // -----------------------------------------------

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

    // -----------------------------------------------
    // SAVE
    // -----------------------------------------------

    const updatedUser = await user.save();

    // -----------------------------------------------
    // REMOVE PASSWORD
    // -----------------------------------------------

    const safeUser = updatedUser.toObject();

    delete safeUser.password;

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: safeUser,
    });

  } catch (error) {
    console.error("=================================");
    console.error("UPDATE PROFILE ERROR");
    console.error("ERROR NAME:", error?.name);
    console.error("ERROR MESSAGE:", error?.message);
    console.error("ERROR STACK:", error?.stack);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
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