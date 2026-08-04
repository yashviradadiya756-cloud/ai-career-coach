const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getProfile,
} = require("../controllers/userController");


console.log("USER getProfile:", typeof getProfile);
console.log("USER protect:", typeof protect);


router.get(
  "/profile",
  protect,
  getProfile
);


module.exports = router;