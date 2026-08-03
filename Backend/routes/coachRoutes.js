const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  askCoachController,
} = require("../controllers/coachController");

console.log("protect:", typeof protect);
console.log(
  "askCoachController:",
  typeof askCoachController
);

router.post("/ask", protect, askCoachController);

module.exports = router;