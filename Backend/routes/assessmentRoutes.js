const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getAssessmentOverview,
} = require("../controllers/assessmentController");

router.get("/overview", protect, getAssessmentOverview);

module.exports = router;