const express = require("express");
const router = express.Router();

const {
  uploadResume,
  getLatestResume,
} = require("../controllers/resumeController");

const protect =
  require("../middleware/authMiddleware");

const upload =
  require("../middleware/uploadMiddleware");

// Upload resume
router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

// Latest resume
router.get(
  "/latest",
  protect,
  getLatestResume
);

module.exports = router;