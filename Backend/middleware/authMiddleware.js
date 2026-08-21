const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =====================================================
// PROTECT MIDDLEWARE
// =====================================================

const protect = async (req, res, next) => {
  try {
    console.log("AUTH MIDDLEWARE RUNNING");

    // -----------------------------------------------
    // GET AUTHORIZATION HEADER
    // -----------------------------------------------

    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // -----------------------------------------------
    // GET TOKEN
    // -----------------------------------------------

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // -----------------------------------------------
    // VERIFY TOKEN
    // -----------------------------------------------

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log(
      "TOKEN DECODED:",
      decoded
    );

    // -----------------------------------------------
    // FIND USER
    // -----------------------------------------------

    const user = await User.findById(
      decoded.id
    ).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // -----------------------------------------------
    // ATTACH USER
    // -----------------------------------------------

    req.user = user;

    console.log(
      "AUTHENTICATED USER:",
      user._id
    );

    // -----------------------------------------------
    // CONTINUE
    // -----------------------------------------------

    next();

  } catch (error) {
    console.error(
      "AUTH MIDDLEWARE ERROR:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = protect;