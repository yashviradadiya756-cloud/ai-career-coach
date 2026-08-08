const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================================
// REGISTER USER
// ==========================================

const registerUser = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    console.log("REGISTER BODY:", req.body);

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email and password are required",
      });
    }

    // Check existing user
    const userExists = await User.findOne({
      email: email.toLowerCase(),
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // Create user
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || "",
    });

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",

      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// LOGIN USER
// ==========================================

const loginUser = async (req, res) => {
  try {
    console.log("Login API called");
    console.log(req.body);

    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    console.log(
      "User:",
      user ? user._id : "Not Found"
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    console.log(
      "Password Match:",
      isMatch
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.log("Token Generated");

    return res.status(200).json({
      success: true,
      message: "Login Successful",

      token,

      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET PROFILE
// ==========================================

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "Get Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get profile",
    });
  }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};