const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { uploadResume } = require("../controllers/resumeController");

console.log("protect:", typeof protect);
console.log("upload:", typeof upload);
console.log("upload.single:", typeof upload.single);
console.log("uploadResume:", typeof uploadResume);

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

module.exports = router;