const express = require("express");

const router =
  express.Router();

const {
  uploadResume,
  getLatestResume,
} = require("../controllers/resumeController");

const protect =
  require("../middleware/authMiddleware");

const upload =
  require("../middleware/uploadMiddleware");

// =====================================================
// UPLOAD RESUME
// =====================================================

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

// =====================================================
// GET LATEST RESUME
// =====================================================

router.get(
  "/latest",
  protect,
  getLatestResume
);

module.exports = router;