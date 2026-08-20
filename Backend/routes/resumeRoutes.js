import express from "express";
import multer from "multer";

import {
  uploadResume,
  getLatestResume,
} from "../controllers/resumeController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "-");

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// GET latest resume
router.get("/latest", protect, getLatestResume);

// POST upload resume
router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

export default router;