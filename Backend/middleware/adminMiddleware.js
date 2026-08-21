const adminMiddleware = (req, res, next) => {
  try {
    console.log("=================================");
    console.log("ADMIN MIDDLEWARE STARTED");
    console.log("=================================");

    if (!req.user) {
      console.log("NO REQ.USER");

      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    console.log("ADMIN USER ID:", req.user._id);
    console.log("ADMIN USERNAME:", req.user.username);
    console.log("ADMIN EMAIL:", req.user.email);
    console.log("ADMIN ROLE:", req.user.role);

    const role = String(req.user.role || "")
      .trim()
      .toLowerCase();

    console.log("NORMALIZED ROLE:", role);

    if (role !== "admin") {
      console.log("ADMIN ACCESS DENIED");

      return res.status(403).json({
        success: false,
        message: "Admin access required",
        role: req.user.role || null,
      });
    }

    console.log("ADMIN ACCESS GRANTED");
    console.log("=================================");

    next();

  } catch (error) {
    console.error(
      "ADMIN MIDDLEWARE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Admin authorization failed",
    });
  }
};

module.exports = adminMiddleware;