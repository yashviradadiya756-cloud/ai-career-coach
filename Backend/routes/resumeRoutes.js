const express = require("express");
const router = express.Router();

const {
  uploadResume,
  getLatestResume
} = require("../controllers/resumeController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

console.log("protect:", typeof protect);
console.log("upload:", typeof upload);
console.log("upload.single:", typeof upload?.single);
console.log("uploadResume:", typeof uploadResume);
console.log("getLatestResume:", typeof getLatestResume);

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