const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  uploadResume,
  getLatestResume,
} = require("../controllers/resumeController");

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

router.get(
  "/latest",
  protect,
  getLatestResume
);

module.exports = router;