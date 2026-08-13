const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    console.log("========== AUTH START ==========");

    const authHeader = req.headers.authorization;

    console.log(
      "Authorization exists:",
      !!authHeader
    );

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token =
      authHeader.split(" ")[1];

    console.log(
      "Token exists:",
      !!token
    );

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log(
      "JWT DECODED:",
      decoded
    );

    const user = await User.findById(
      decoded.id
    ).select("-password");

    console.log(
      "DATABASE USER:",
      user
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    console.log(
      "REQ.USER ROLE:",
      req.user.role
    );

    console.log("========== AUTH END ==========");

    next();

  } catch (error) {
    console.error(
      "AUTH ERROR:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = protect;