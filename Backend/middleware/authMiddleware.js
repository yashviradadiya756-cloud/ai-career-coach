const jwt = require("jsonwebtoken");

// =====================================================
// PROTECT ROUTES
// =====================================================

const protect = (req, res, next) => {
  try {
    console.log("=================================");
    console.log("AUTH MIDDLEWARE STARTED");
    console.log("=================================");

    // -----------------------------------------------
    // AUTHORIZATION HEADER
    // -----------------------------------------------

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

    // -----------------------------------------------
    // BEARER CHECK
    // -----------------------------------------------

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    // -----------------------------------------------
    // TOKEN
    // -----------------------------------------------

    const token = authHeader
      .substring(7)
      .trim();

    console.log(
      "TOKEN EXISTS:",
      !!token
    );

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    // -----------------------------------------------
    // JWT SECRET
    // -----------------------------------------------

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET IS NOT DEFINED"
      );

      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured",
      });
    }

    // -----------------------------------------------
    // VERIFY TOKEN
    // -----------------------------------------------

    console.log(
      "VERIFYING JWT..."
    );

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log(
      "JWT DECODED:",
      decoded
    );

    // -----------------------------------------------
    // USER ID
    // -----------------------------------------------

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
        message:
          "User ID not found in token",
      });
    }

    // -----------------------------------------------
    // ATTACH USER
    // -----------------------------------------------

    req.user = {
      _id: userId,
    };

    console.log(
      "REQ.USER:",
      req.user
    );

    console.log(
      "AUTHENTICATION SUCCESS"
    );

    console.log(
      "================================="
    );

    next();

  } catch (error) {
    console.error("=================================");
    console.error("AUTH MIDDLEWARE ERROR");
    console.error("ERROR NAME:", error?.name);
    console.error(
      "ERROR MESSAGE:",
      error?.message
    );
    console.error("ERROR STACK:", error?.stack);
    console.error("=================================");

    // -----------------------------------------------
    // EXPIRED TOKEN
    // -----------------------------------------------

    if (
      error?.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    // -----------------------------------------------
    // INVALID TOKEN
    // -----------------------------------------------

    if (
      error?.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // -----------------------------------------------
    // OTHER ERROR
    // -----------------------------------------------

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Authentication middleware failed",
    });
  }
};

module.exports = protect;