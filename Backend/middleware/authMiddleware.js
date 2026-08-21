const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    console.log("=================================");
    console.log("AUTH MIDDLEWARE STARTED");
    console.log("=================================");

    const authHeader = req.headers.authorization;

    console.log(
      "AUTH HEADER:",
      authHeader ? "PRESENT" : "MISSING"
    );

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    const token = authHeader.substring(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("JWT DECODED:", decoded);

    const userId =
      decoded?.id ||
      decoded?._id ||
      decoded?.userId;

    console.log(
      "USER ID FROM TOKEN:",
      userId
    );

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in token",
      });
    }

    // =================================================
    // IMPORTANT:
    // GET USER FROM MONGODB
    // =================================================

    const user = await User.findById(userId)
      .select("-password");

    console.log(
      "DATABASE USER FOUND:",
      !!user
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("DATABASE USER ID:", user._id);
    console.log("DATABASE USERNAME:", user.username);
    console.log("DATABASE EMAIL:", user.email);
    console.log("DATABASE ROLE:", user.role);

    // =================================================
    // ATTACH COMPLETE USER
    // =================================================

    req.user = user;

    console.log("REQ.USER ROLE:", req.user.role);

    console.log(
      "AUTHENTICATION SUCCESS"
    );

    console.log("=================================");

    next();

  } catch (error) {

    console.error(
      "AUTH MIDDLEWARE ERROR:",
      error
    );

    if (error?.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    if (error?.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Authentication middleware failed",
    });
  }
};

module.exports = protect;