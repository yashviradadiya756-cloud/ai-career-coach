const adminMiddleware = (req, res, next) => {
  console.log("=================================");
  console.log("ADMIN MIDDLEWARE");
  console.log("req.user:", req.user);
  console.log("USER ID:", req.user?._id);
  console.log("USER EMAIL:", req.user?.email);
  console.log("USER ROLE:", req.user?.role);
  console.log("ROLE TYPE:", typeof req.user?.role);
  console.log("=================================");

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (String(req.user.role).trim().toLowerCase() !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
      debug: {
        userId: req.user._id,
        email: req.user.email,
        role: req.user.role,
        roleType: typeof req.user.role,
      },
    });
  }

  next();
};

module.exports = adminMiddleware;