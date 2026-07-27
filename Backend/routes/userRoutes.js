const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
} = require("../controllers/userController");

// Get User Profile
router.get("/profile", protect, getProfile);

// Update User Profile
router.put("/profile", protect, updateProfile);

module.exports = router;