const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    console.log("\n========== AUTH MIDDLEWARE ==========");

    const authHeader =
      req.headers.authorization;

    console.log(
      "AUTHORIZATION HEADER:",
      authHeader
        ? "TOKEN RECEIVED"
        : "NO TOKEN"
    );

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    const token =
      authHeader.split(" ")[1];

    console.log(
      "TOKEN RECEIVED:",
      token ? "YES" : "NO"
    );

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    console.log(
      "DECODED TOKEN:",
      decoded
    );

    const user =
      await User.findById(
        decoded.id
      ).select("-password");

    if (!user) {
      console.log(
        "USER NOT FOUND:",
        decoded.id
      );

      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    console.log(
      "USER FOUND:",
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    );

    req.user = user;

    next();

  } catch (error) {

    console.error(
      "AUTH MIDDLEWARE ERROR:",
      error
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token",
    });
  }
};

module.exports = protect;