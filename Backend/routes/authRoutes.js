const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

console.log("AUTH CONTROLLERS:", {
    registerUser: typeof registerUser,
    loginUser: typeof loginUser,
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);

module.exports = router;