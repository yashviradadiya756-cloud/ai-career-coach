const adminMiddleware = (
  req,
  res,
  next
) => {
  try {
    console.log(
      "\n========== ADMIN MIDDLEWARE =========="
    );

    console.log(
      "REQ.USER:",
      req.user
    );

    if (!req.user) {
      console.log(
        "ADMIN CHECK FAILED: NO USER"
      );

      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    console.log(
      "USER ROLE:",
      req.user.role
    );

    if (
      String(req.user.role)
        .trim()
        .toLowerCase() !== "admin"
    ) {
      console.log(
        "ADMIN ACCESS DENIED"
      );

      return res.status(403).json({
        success: false,
        message:
          "Admin access required",
        role: req.user.role || null,
      });
    }

    console.log(
      "ADMIN ACCESS GRANTED"
    );

    next();

  } catch (error) {

    console.error(
      "ADMIN MIDDLEWARE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Admin authorization failed",
    });
  }
};

module.exports =
  adminMiddleware;