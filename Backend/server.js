// =====================================================
// SERVER.JS
// AI CAREER COACH - BACKEND
// =====================================================

// ===============================
// LOAD ENVIRONMENT VARIABLES FIRST
// ===============================

require("dotenv").config();

// ===============================
// DNS CONFIGURATION
// ===============================

const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);

dns.setDefaultResultOrder("ipv4first");

// ===============================
// IMPORT PACKAGES
// ===============================

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// ===============================
// CREATE EXPRESS APP
// ===============================

const app = express();

// ===============================
// PORT
// ===============================

const PORT = process.env.PORT || 5000;

// =====================================================
// CORS CONFIGURATION
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-career-coach-beryl-ten.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests that do not contain an Origin
      // Example: Postman, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      // Allow known frontend origins
      if (allowedOrigins.includes(origin)) {
        console.log("CORS ALLOWED:", origin);
        return callback(null, true);
      }

      // Block unknown origins
      console.log("CORS BLOCKED:", origin);

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
      "Cache-Control",
      "Pragma",
      "Expires",
    ],

    optionsSuccessStatus: 204,
  })
);

// =====================================================
// BODY PARSER
// =====================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// BASIC REQUEST LOGGER
// =====================================================

app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.originalUrl}`
  );

  next();
});

// =====================================================
// ROOT ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Career Coach Backend is running",
  });
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend API is healthy",
    server: "AI Career Coach",
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// MONGODB CONNECTION
// =====================================================

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error(
        "MONGO_URI is missing from environment variables."
      );

      return;
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully");
    console.log(
      "Database:",
      mongoose.connection.name
    );
  } catch (error) {
    console.error(
      "MongoDB Connection Error:",
      error.message
    );
  }
};

connectDB();

// =====================================================
// MONGODB CONNECTION EVENTS
// =====================================================

mongoose.connection.on(
  "connected",
  () => {
    console.log("MongoDB connection established");
  }
);

mongoose.connection.on(
  "error",
  (error) => {
    console.error(
      "MongoDB error:",
      error.message
    );
  }
);

mongoose.connection.on(
  "disconnected",
  () => {
    console.log(
      "MongoDB disconnected"
    );
  }
);

// =====================================================
// GEMINI CONFIGURATION
// =====================================================

console.log(
  "GEMINI_API_KEY EXISTS:",
  !!process.env.GEMINI_API_KEY
);

if (process.env.GEMINI_API_KEY) {
  console.log(
    "GEMINI_API_KEY LENGTH:",
    process.env.GEMINI_API_KEY.length
  );
} else {
  console.log(
    "WARNING: GEMINI_API_KEY is not loaded"
  );
}

console.log(
  "PRIMARY MODEL:",
  process.env.GEMINI_PRIMARY_MODEL ||
    "gemini-3.5-flash-lite"
);

console.log(
  "FALLBACK MODEL:",
  process.env.GEMINI_FALLBACK_MODEL ||
    "gemini-3.6-flash"
);

// =====================================================
// RAZORPAY CONFIGURATION CHECK
// =====================================================

console.log(
  "KEY ID:",
  process.env.RAZORPAY_KEY_ID
    ? "LOADED"
    : "MISSING"
);

console.log(
  "KEY SECRET:",
  process.env.RAZORPAY_KEY_SECRET
    ? "LOADED"
    : "MISSING"
);

// =====================================================
// IMPORT ROUTES
// =====================================================

// Authentication
const authRoutes = require("./routes/authRoutes");

// User
const userRoutes = require("./routes/userRoutes");

// Dashboard
const dashboardRoutes = require("./routes/dashboardRoutes");

// Assessment
const assessmentRoutes = require("./routes/assessmentRoutes");

// Resume
const resumeRoutes = require("./routes/resumeRoutes");

// Skill Gap
const skillGapRoutes = require("./routes/skillGapRoutes");

// Roadmap
const roadmapRoutes = require("./routes/roadmapRoutes");

// Interview
const interviewRoutes = require("./routes/interviewRoutes");

// AI Coach
const coachRoutes = require("./routes/coachRoutes");

// Learning
const learningRoutes = require("./routes/learningRoutes");

// Progress
const progressRoutes = require("./routes/progressRoutes");

// Achievement
const achievementRoutes = require("./routes/achievementRoutes");

// Notification
const notificationRoutes = require("./routes/notificationRoutes");

// Payment
const paymentRoutes = require("./routes/paymentRoutes");

// Settings
const settingsRoutes = require("./routes/settingsRoutes");

// Admin
const adminRoutes = require("./routes/adminRoutes");

// Courses
const courseRoutes = require("./routes/courseRoutes");

// Contact
const contactRoutes = require("./routes/contactRoutes");

// =====================================================
// API ROUTES
// =====================================================

// Authentication
app.use(
  "/api/auth",
  authRoutes
);

// Users
app.use(
  "/api/users",
  userRoutes
);

// Dashboard
app.use(
  "/api/dashboard",
  dashboardRoutes
);

// Assessment
app.use(
  "/api/assessment",
  assessmentRoutes
);

// Resume
app.use(
  "/api/resume",
  resumeRoutes
);

// Skill Gap
app.use(
  "/api/skillgap",
  skillGapRoutes
);

// Roadmap
app.use(
  "/api/roadmap",
  roadmapRoutes
);

// Interview
app.use(
  "/api/interview",
  interviewRoutes
);

// AI Coach
app.use(
  "/api/coach",
  coachRoutes
);

// Learning
app.use(
  "/api/learning",
  learningRoutes
);

// Progress
app.use(
  "/api/progress",
  progressRoutes
);

// Achievement
app.use(
  "/api/achievement",
  achievementRoutes
);

// Notification
app.use(
  "/api/notification",
  notificationRoutes
);

// Payment
app.use(
  "/api/payment",
  paymentRoutes
);

// Settings
app.use(
  "/api/settings",
  settingsRoutes
);

// Admin
app.use(
  "/api/admin",
  adminRoutes
);

// Courses
app.use(
  "/api/courses",
  courseRoutes
);

// Contact
app.use(
  "/api/contact",
  contactRoutes
);

// =====================================================
// GEMINI TEST ROUTE
// =====================================================

try {
  const {
    testGemini,
  } = require("./config/gemini");

  app.get(
    "/api/gemini-test",
    async (req, res) => {
      try {
        const result =
          await testGemini();

        res.status(200).json({
          success: true,
          message:
            "Gemini API is working",
          result,
        });
      } catch (error) {
        console.error(
          "Gemini Test Error:",
          error
        );

        res.status(500).json({
          success: false,
          message:
            "Gemini API test failed",
          error: error.message,
        });
      }
    }
  );
} catch (error) {
  console.error(
    "Gemini config could not be loaded:",
    error.message
  );
}

// =====================================================
// 404 HANDLER
// =====================================================

app.use(
  (req, res) => {
    console.log(
      "404 ROUTE NOT FOUND:",
      req.method,
      req.originalUrl
    );

    res.status(404).json({
      success: false,
      message: "Route not found",
      path: req.originalUrl,
    });
  }
);

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      "GLOBAL ERROR:",
      error.message
    );

    // CORS error
    if (
      error.message ===
      "Not allowed by CORS"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "CORS blocked this request",
        origin: req.headers.origin || null,
      });
    }

    res.status(
      error.status || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Internal Server Error",
    });
  }
);

// =====================================================
// START SERVER
// =====================================================

app.listen(
  PORT,
  () => {
    console.log(
      "========================================"
    );

    console.log(
      `Server is running on port ${PORT}`
    );

    console.log(
      `Local URL: http://localhost:${PORT}`
    );

    console.log(
      `Health URL: http://localhost:${PORT}/api/health`
    );

    console.log(
      "Frontend URL:",
      "https://ai-career-coach-beryl-ten.vercel.app"
    );

    console.log(
      "========================================"
    );
  }
);