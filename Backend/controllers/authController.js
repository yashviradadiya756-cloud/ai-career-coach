const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// ==========================================
// REGISTER USER
// ==========================================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      phone,
    } = req.body;

    console.log("REGISTER BODY:", req.body);

    // Required fields
    if (
      !name?.trim() ||
      !username?.trim() ||
      !email?.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Full Name, Username, Email and Password are required",
      });
    }

    // Check email
    const userExists = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Check username
    const usernameExists = await User.findOne({
      username: username.trim(),
    });

    if (usernameExists) {
      return res.status(400).json({
        success: false,
        message: "Username is already taken",
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
      name: name.trim(),
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone?.trim() || "",
    });

    console.log("USER CREATED:", user);

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",

      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

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
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
    success: true,
    message: "Login Successful",

    token,

    user: {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

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
    console.error("GET PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get profile",
    });
  }
};

// =====================================================
// GOOGLE LOGIN
// =====================================================

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    console.log("======================================");
    console.log("GOOGLE LOGIN");
    console.log("======================================");

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    // -----------------------------------------------
    // VERIFY GOOGLE TOKEN
    // -----------------------------------------------

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    console.log("GOOGLE PAYLOAD:", payload);

    const {
      sub,
      email,
      name,
      picture,
      email_verified,
    } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google account email not found",
      });
    }

    if (!email_verified) {
      return res.status(401).json({
        success: false,
        message: "Google email is not verified",
      });
    }

    // -----------------------------------------------
    // FIND USER
    // -----------------------------------------------

    let user = await User.findOne({ email });

    // -----------------------------------------------
    // CREATE USER IF NOT EXISTS
    // -----------------------------------------------

    if (!user) {
      let username = email
        .split("@")[0]
        .replace(/[^a-zA-Z0-9]/g, "");

      // Prevent duplicate username
      const usernameExists = await User.findOne({
        username,
      });

      if (usernameExists) {
        username = `${username}${Date.now()
          .toString()
          .slice(-5)}`;
      }

      user = await User.create({
        name: name || username,
        username,
        email,
        password: undefined,
      });

      console.log(
        "NEW GOOGLE USER CREATED:",
        user._id
      );
    } else {
      console.log(
        "EXISTING GOOGLE USER:",
        user._id
      );
    }

    // -----------------------------------------------
    // GENERATE YOUR NORMAL JWT
    // -----------------------------------------------

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Google login successful",

      token,

      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        picture,
      },
    });
  } catch (error) {
    console.error(
      "GOOGLE LOGIN ERROR:",
      error
    );

    return res.status(401).json({
      success: false,
      message: "Google authentication failed",
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
  googleLogin,
};
