const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  getSettings,
  updateProfile,
  updatePreferences,
  changePassword,
  deleteAccount,
} = require("../controllers/settingsController");

// Import protect — adjust if your authMiddleware exports differently
const protect = require("../middleware/authMiddleware");

// ==========================
// MULTER — Profile Photo Upload
// ==========================
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user._id}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// ==========================
// ROUTES
// ==========================
router.get("/", protect, getSettings);
router.put("/profile", protect, upload.single("profilePhoto"), updateProfile);
router.put("/preferences", protect, updatePreferences);
router.put("/password", protect, changePassword);
router.delete("/account", protect, deleteAccount);

module.exports = router;