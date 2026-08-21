const express = require("express");

const router = express.Router();

// =====================================================
// CONTROLLER
// =====================================================

const {
  getProfile,
  updateProfile,
} = require("../controllers/userController");

// =====================================================
// AUTH MIDDLEWARE
// =====================================================

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const protect = require(
  "../middleware/authMiddleware"
);

// =====================================================
// DEBUG
// =====================================================

console.log("=================================");
console.log("USER ROUTES");
console.log("=================================");

console.log(
  "authMiddleware:",
  typeof authMiddleware
);

console.log(
  "protect:",
  typeof protect
);

console.log(
  "getProfile:",
  typeof getProfile
);

console.log(
  "updateProfile:",
  typeof updateProfile
);

console.log("=================================");

// =====================================================
// VALIDATION
// =====================================================

if (typeof protect !== "function") {
  throw new Error(
    "protect middleware is not a function. Check authMiddleware.js export."
  );
}

if (typeof getProfile !== "function") {
  throw new Error(
    "getProfile controller is not a function."
  );
}

if (typeof updateProfile !== "function") {
  throw new Error(
    "updateProfile controller is not a function."
  );
}

// =====================================================
// ROUTES
// =====================================================

// GET PROFILE

router.get(
  "/profile",
  protect,
  getProfile
);

// UPDATE PROFILE

router.put(
  "/profile",
  protect,
  updateProfile
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;