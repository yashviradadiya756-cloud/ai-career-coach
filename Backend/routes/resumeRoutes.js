const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  uploadResume,
  getLatestResume,
} = require("../controllers/resumeController");

const { protect } = require("../middleware/authMiddleware")

const router = express.Router();

// =====================================================
// UPLOAD DIRECTORY
// =====================================================

const uploadsPath = path.join(
  process.cwd(),
  "uploads"
);

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, {
    recursive: true,
  });
}

// =====================================================
// MULTER STORAGE
// =====================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      file.originalname.replace(/\s+/g, "-");

    cb(null, uniqueName);
  },
});

// =====================================================
// MULTER
// =====================================================

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF files are allowed"
        )
      );
    }
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// =====================================================
// DEBUG
// =====================================================

console.log(
  "RESUME ROUTES"
);

console.log(
  "protect:",
  typeof protect
);

console.log(
  "getLatestResume:",
  typeof getLatestResume
);

console.log(
  "uploadResume:",
  typeof uploadResume
);

// =====================================================
// GET LATEST RESUME
// =====================================================

router.get(
  "/latest",
  protect,
  getLatestResume
);

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
// EXPORT
// =====================================================

module.exports = router;