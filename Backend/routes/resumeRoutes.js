const express = require("express");

const router = express.Router();

const {
  getLatestResume,
  uploadResume,
} = require("../controllers/resumeController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

console.log("=================================");
console.log("RESUME ROUTES");
console.log("protect:", typeof protect);
console.log("getLatestResume:", typeof getLatestResume);
console.log("uploadResume:", typeof uploadResume);
console.log("upload:", typeof upload);
console.log("upload.single:", typeof upload.single);
console.log("=================================");

router.get(
  "/latest",
  protect,
  getLatestResume
);

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

module.exports = router;