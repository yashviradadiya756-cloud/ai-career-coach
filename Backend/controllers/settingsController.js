const User = require("../models/User");
const bcrypt = require("bcryptjs");

// =====================================================
// GET SETTINGS
// =====================================================

const getSettings = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
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
      "GET SETTINGS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to load settings",
    });
  }
};


// =====================================================
// UPDATE PROFILE
// =====================================================

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      username,
      phone,
    } = req.body;

    console.log(
      "UPDATE PROFILE BODY:",
      req.body
    );

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
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


    // -----------------------------------------
    // FULL NAME
    // -----------------------------------------

    if (name !== undefined) {
      const cleanName = String(name).trim();

      if (!cleanName) {
        return res.status(400).json({
          success: false,
          message:
            "Full name cannot be empty",
        });
      }

      user.name = cleanName;
    }


    // -----------------------------------------
    // USERNAME
    // -----------------------------------------

    if (username !== undefined) {
      const cleanUsername =
        String(username).trim();

      if (!cleanUsername) {
        return res.status(400).json({
          success: false,
          message:
            "Username cannot be empty",
        });
      }

      const existingUser =
        await User.findOne({
          username: cleanUsername,
          _id: {
            $ne: user._id,
          },
        });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message:
            "Username is already taken",
        });
      }

      user.username = cleanUsername;
    }


    // -----------------------------------------
    // PHONE
    // -----------------------------------------

    if (phone !== undefined) {
      user.phone = String(phone).trim();
    }


    // -----------------------------------------
    // SAVE TO MONGODB
    // -----------------------------------------

    await user.save();

    console.log(
      "PROFILE SAVED TO MONGODB:",
      user._id
    );


    // -----------------------------------------
    // GET UPDATED USER
    // -----------------------------------------

    const updatedUser =
      await User.findById(
        user._id
      ).select("-password");


    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",
      user: updatedUser,
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
// UPDATE PREFERENCES
// =====================================================

const updatePreferences = async (
  req,
  res
) => {
  try {
    const {
      darkMode,
      emailNotifications,
      pushNotifications,
    } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
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


    // -----------------------------------------
    // DARK MODE
    // -----------------------------------------

    if (darkMode !== undefined) {
      user.preferences.darkMode =
        Boolean(darkMode);
    }


    // -----------------------------------------
    // EMAIL NOTIFICATIONS
    // -----------------------------------------

    if (
      emailNotifications !== undefined
    ) {
      user.preferences.emailNotifications =
        Boolean(emailNotifications);
    }


    // -----------------------------------------
    // PUSH NOTIFICATIONS
    // -----------------------------------------

    if (
      pushNotifications !== undefined
    ) {
      user.preferences.pushNotifications =
        Boolean(pushNotifications);
    }


    await user.save();

    const updatedUser =
      await User.findById(
        user._id
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


// =====================================================
// CHANGE PASSWORD
// =====================================================

const changePassword = async (
  req,
  res
) => {
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


    if (
      newPassword !== confirmPassword
    ) {
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


    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );


    user.password = hashedPassword;

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
        error.message ||
        "Failed to change password",
    });
  }
};


// =====================================================
// DELETE ACCOUNT
// =====================================================

const deleteAccount = async (
  req,
  res
) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
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
        error.message ||
        "Failed to delete account",
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getSettings,
  updateProfile,
  updatePreferences,
  changePassword,
  deleteAccount,
};