const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    getProfile
} = require("../controllers/userController");

console.log("protect:", typeof protect);
console.log("getProfile:", typeof getProfile);

router.get(
    "/profile",
    protect,
    getProfile
);


module.exports = router;