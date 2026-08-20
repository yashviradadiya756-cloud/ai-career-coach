const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

dns.setDefaultResultOrder("ipv4first");

require("dotenv").config();

console.log(
  "Gemini Key Loaded:",
  process.env.GEMINI_API_KEY ? "YES" : "NO"
);

console.log("Razorpay Key:", process.env.RAZORPAY_KEY_ID);
console.log("Secret Loaded:", !!process.env.RAZORPAY_KEY_SECRET);

console.log(
  "Razorpay Key Loaded:",
  !!process.env.RAZORPAY_KEY_ID
);

console.log(
  "Razorpay Secret Loaded:",
  !!process.env.RAZORPAY_KEY_SECRET
);

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const skillGapRoutes = require("./routes/skillGapRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const coachRoutes = require("./routes/coachRoutes");
const learningRoutes = require("./routes/learningRoutes");
const progressRoutes = require("./routes/progressRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const app = express();
app.disable("etag");

console.log("ASSESSMENT API VERSION: 2026-08-06");

connectDB();

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://your-vercel-domain.vercel.app",
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path = require("path");

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.get("/", (req, res) => {
  res.send("AI Career Coach Backend is Running...");
});

app.get("/api/learning-test", (req, res) => {
  res.json({
    success: true,
    message: "Learning API is deployed correctly",
    version: "2026-08-06"
  });
});

app.get("/api/resume-test", (req, res) => {
  res.json({
    success: true,
    message: "Resume API is working",
  });
});

console.log("================================");
console.log("CHECKING ROUTES");

console.log("userRoutes:", typeof userRoutes);
console.log("authRoutes:", typeof authRoutes);
console.log("dashboardRoutes:", typeof dashboardRoutes);
console.log("assessmentRoutes:", typeof assessmentRoutes);
console.log("resumeRoutes:", typeof resumeRoutes);
console.log("skillGapRoutes:", typeof skillGapRoutes);
console.log("roadmapRoutes:", typeof roadmapRoutes);
console.log("interviewRoutes:", typeof interviewRoutes);
console.log("coachRoutes:", typeof coachRoutes);
console.log("learningRoutes:", typeof learningRoutes);
console.log("progressRoutes:", typeof progressRoutes);
console.log("achievementRoutes:", typeof achievementRoutes);
console.log("notificationRoutes:", typeof notificationRoutes);
console.log("paymentRoutes:", typeof paymentRoutes);

console.log("================================");

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/skillgap", skillGapRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/coach", coachRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/achievement", achievementRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/settings", settingsRoutes); 

// ===============================
// ADMIN ROUTES
// ===============================

// ===============================
// ADMIN ROUTES
// ===============================

const adminRoutes = require("./routes/adminRoutes");
const courseRoutes = require("./routes/courseRoutes");


console.log("🔥 ADMIN ROUTES LOADED:", typeof adminRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);

app.get("/api/admin-route-test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ADMIN ROUTE FILE DEPLOYED",
    version: "2026-08-14",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});