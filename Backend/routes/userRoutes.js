const express = require("express");

const {
  getProfile,
  updateProfile,
} = require("../controllers/userController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// DEBUG
// =====================================================

console.log("=================================");
console.log("USER ROUTES");
console.log("protect:", typeof protect);
console.log("getProfile:", typeof getProfile);
console.log("updateProfile:", typeof updateProfile);
console.log("=================================");

// =====================================================
// GET PROFILE
// =====================================================

router.get(
  "/profile",
  protect,
  getProfile
);

// =====================================================
// UPDATE PROFILE
// =====================================================

router.put(
  "/profile",
  protect,
  updateProfile
);

module.exports = router;