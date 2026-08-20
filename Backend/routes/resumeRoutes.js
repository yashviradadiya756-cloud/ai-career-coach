const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const {
  uploadResume,
  getLatestResume,
} = require("../controllers/resumeController");

// ======================================================
// DEBUG ROUTE
// ======================================================

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Resume route is working",
  });
});

// ======================================================
// UPLOAD RESUME
// ======================================================

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

// ======================================================
// GET LATEST RESUME
// ======================================================

router.get(
  "/latest",
  protect,
  getLatestResume
);

module.exports = router;