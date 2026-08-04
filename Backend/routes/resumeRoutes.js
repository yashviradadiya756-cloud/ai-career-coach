const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  uploadResume,
  getLatestResume,
} = require("../controllers/resumeController");


// Debug
console.log("protect:", typeof protect);
console.log("upload:", typeof upload);
console.log("upload.single:", typeof upload?.single);
console.log("uploadResume:", typeof uploadResume);
console.log("getLatestResume:", typeof getLatestResume);


// Upload Resume
router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);


// Get Latest Resume
router.get(
  "/latest",
  protect,
  getLatestResume
);


module.exports = router;