const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const {
  uploadResume,
  getLatestResume,
} = require("../controllers/resumeController");

const protect = require("../middleware/authMiddleware");

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