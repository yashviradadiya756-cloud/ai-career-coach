const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

console.log("UPLOAD:", upload);

const {
    uploadResume,
    getLatestResume
} = require("../controllers/resumeController");

console.log("protect:", typeof protect);
console.log("upload:", typeof upload);
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