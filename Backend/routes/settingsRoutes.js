const express = require("express");

const router = express.Router();

const {
  getSettings,
  updateProfile,
  updatePreferences,
  changePassword,
  deleteAccount,
} = require("../controllers/settingsController");

const { protect } = require("../middleware/authMiddleware")


// Get current user settings
router.get("/", protect, getSettings);


// Update profile
router.put("/profile", protect, updateProfile);


// Update preferences
router.put("/preferences", protect, updatePreferences);


// Change password
router.put("/password", protect, changePassword);


// Delete account
router.delete("/account", protect, deleteAccount);


module.exports = router;