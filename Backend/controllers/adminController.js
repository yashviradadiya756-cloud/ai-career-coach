const User = require("../models/User");
const Resume = require("../models/Resume");
const Roadmap = require("../models/Roadmap");
const SkillGap = require("../models/SkillGap");
const Interview = require("../models/Interview");
const Course = require("../models/Course");
const Learning = require("../models/Learning");
const Payment = require("../models/Payment");
const Progress = require("../models/Progress");
const Achievement = require("../models/Achievement");
const CertificateCriteria = require("../models/CertificateCriteria");
const Certificate = require("../models/Certificate");

/* =========================================================
   HELPERS
========================================================= */

const getDateRange = (range) => {
  const now = new Date();

  let startDate = new Date(now);

  if (range === "7d") {
    startDate.setDate(now.getDate() - 6);
  } else if (range === "30d") {
    startDate.setDate(now.getDate() - 29);
  } else {
    startDate.setMonth(now.getMonth() - 11);
    startDate.setDate(1);
  }

  return {
    startDate,
    endDate: now,
  };
};

const safeCount = async (Model) => {
  try {
    return await Model.countDocuments();
  } catch (error) {
    console.log(`Count error for ${Model?.modelName}:`, error.message);
    return 0;
  }
};

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

const getAdminDashboard = async (req, res) => {
  try {
    const range = req.query.range || "12m";

    const { startDate, endDate } = getDateRange(range);

    /* =====================================================
       BASIC COUNTS
    ===================================================== */

    const [
      totalUsers,
      totalResumes,
      totalRoadmaps,
      totalSkillGaps,
      totalInterviews,
      totalPayments,
      totalProgress,
    ] = await Promise.all([
      safeCount(User),
      safeCount(Resume),
      safeCount(Roadmap),
      safeCount(SkillGap),
      safeCount(Interview),
      safeCount(Payment),
      safeCount(Progress),
    ]);

    /* =====================================================
       ACTIVE USERS
       Users active during selected period
    ===================================================== */

    let activeUsers = 0;

    try {
      activeUsers = await User.countDocuments({
        updatedAt: {
          $gte: startDate,
          $lte: endDate,
        },
      });
    } catch (error) {
      console.log("Active users error:", error.message);
    }

    /* =====================================================
       REVENUE
    ===================================================== */

    let revenue = 0;

    try {
      const paymentData = await Payment.aggregate([
        {
          $match: {
            status: {
              $in: ["paid", "success", "completed"],
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $convert: {
                  input: "$amount",
                  to: "double",
                  onError: 0,
                  onNull: 0,
                },
              },
            },
          },
        },
      ]);

      revenue = paymentData[0]?.total || 0;
    } catch (error) {
      console.log("Revenue error:", error.message);
    }

    /* =====================================================
       USER GROWTH
       IMPORTANT:
       Frontend expects:
       {
         month: "Jan",
         users: 10
       }
    ===================================================== */

    let userGrowth = [];

    try {
      if (range === "7d" || range === "30d") {
        userGrowth = await User.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startDate,
                $lte: endDate,
              },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%d %b",
                  date: "$createdAt",
                },
              },
              users: {
                $sum: 1,
              },
              sortDate: {
                $min: "$createdAt",
              },
            },
          },
          {
            $sort: {
              sortDate: 1,
            },
          },
          {
            $project: {
              _id: 0,
              month: "$_id",
              users: 1,
            },
          },
        ]);
      } else {
        userGrowth = await User.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startDate,
                $lte: endDate,
              },
            },
          },
          {
            $group: {
              _id: {
                year: {
                  $year: "$createdAt",
                },
                month: {
                  $month: "$createdAt",
                },
              },
              users: {
                $sum: 1,
              },
            },
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1,
            },
          },
          {
            $project: {
              _id: 0,
              month: {
                $let: {
                  vars: {
                    months: [
                      "",
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ],
                  },
                  in: {
                    $arrayElemAt: [
                      "$$months",
                      "$_id.month",
                    ],
                  },
                },
              },
              users: 1,
            },
          },
        ]);
      }
    } catch (error) {
      console.log("User growth error:", error.message);
    }

    /* =====================================================
       AI USAGE
       Frontend expects:
       {
         name: "Resume",
         value: 20
       }
    ===================================================== */

    let aiUsage = [];

    try {
      const [
        resumeCount,
        roadmapCount,
        skillGapCount,
        interviewCount,
      ] = await Promise.all([
        Resume.countDocuments({
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        }),

        Roadmap.countDocuments({
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        }),

        SkillGap.countDocuments({
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        }),

        Interview.countDocuments({
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        }),
      ]);

      aiUsage = [
        {
          name: "Resume AI",
          value: resumeCount,
        },
        {
          name: "Roadmap AI",
          value: roadmapCount,
        },
        {
          name: "Skill Gap",
          value: skillGapCount,
        },
        {
          name: "Mock Interview",
          value: interviewCount,
        },
      ];
    } catch (error) {
      console.log("AI usage error:", error.message);
    }

    /* =====================================================
       POPULAR CAREER ROLES
    ===================================================== */

    let popularRoles = [];

    try {
      const roleSources = [
        {
          model: Roadmap,
          fields: ["targetRole", "careerGoal", "role"],
        },
        {
          model: SkillGap,
          fields: ["targetRole", "careerGoal", "role"],
        },
      ];

      const roleMap = {};

      for (const source of roleSources) {
        try {
          const records = await source.model.find(
            {},
            {
              targetRole: 1,
              careerGoal: 1,
              role: 1,
            }
          ).lean();

          records.forEach((item) => {
            let role = "";

            for (const field of source.fields) {
              if (item[field]) {
                role = String(item[field]).trim();
                break;
              }
            }

            if (role) {
              roleMap[role] =
                (roleMap[role] || 0) + 1;
            }
          });
        } catch (error) {
          console.log(
            `Role source error:`,
            error.message
          );
        }
      }

      popularRoles = Object.entries(roleMap)
        .map(([role, users]) => ({
          _id: role,
          users,
        }))
        .sort((a, b) => b.users - a.users)
        .slice(0, 6);
    } catch (error) {
      console.log(
        "Popular roles error:",
        error.message
      );
    }

    /* =====================================================
       RECENT USERS
    ===================================================== */

    const recentUsers = await User.find()
      .select(
        "name username email createdAt"
      )
      .sort({
        createdAt: -1,
      })
      .limit(6)
      .lean();

    /* =====================================================
       RECENT ACTIVITY
    ===================================================== */

    let recentActivity = [];

    try {
      const [
        resumes,
        roadmaps,
        interviews,
        skillGaps,
      ] = await Promise.all([
        Resume.find()
          .select("createdAt fileName")
          .sort({ createdAt: -1 })
          .limit(3)
          .lean(),

        Roadmap.find()
          .select("createdAt targetRole careerGoal")
          .sort({ createdAt: -1 })
          .limit(3)
          .lean(),

        Interview.find()
          .select("createdAt")
          .sort({ createdAt: -1 })
          .limit(3)
          .lean(),

        SkillGap.find()
          .select("createdAt targetRole")
          .sort({ createdAt: -1 })
          .limit(3)
          .lean(),
      ]);

      resumes.forEach((item) => {
        recentActivity.push({
          type: "resume",
          title: "Resume analyzed",
          description:
            item.fileName ||
            "New resume analysis completed",
          createdAt: item.createdAt,
        });
      });

      roadmaps.forEach((item) => {
        recentActivity.push({
          type: "roadmap",
          title: "Career roadmap created",
          description:
            item.targetRole ||
            item.careerGoal ||
            "New career roadmap",
          createdAt: item.createdAt,
        });
      });

      interviews.forEach((item) => {
        recentActivity.push({
          type: "interview",
          title: "Mock interview completed",
          description:
            "AI interview activity detected",
          createdAt: item.createdAt,
        });
      });

      skillGaps.forEach((item) => {
        recentActivity.push({
          type: "skillgap",
          title: "Skill gap analyzed",
          description:
            item.targetRole ||
            "New skill gap analysis",
          createdAt: item.createdAt,
        });
      });

      recentActivity.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );

      recentActivity =
        recentActivity.slice(0, 8);
    } catch (error) {
      console.log(
        "Recent activity error:",
        error.message
      );
    }

    /* =====================================================
       USER GROWTH %
    ===================================================== */

    let userGrowthPercentage = 0;

    try {
      const previousStart = new Date(startDate);
      const previousEnd = new Date(startDate);

      const duration =
        endDate.getTime() -
        startDate.getTime();

      previousStart.setTime(
        startDate.getTime() - duration
      );

      previousEnd.setTime(
        startDate.getTime()
      );

      const [
        currentUsers,
        previousUsers,
      ] = await Promise.all([
        User.countDocuments({
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        }),

        User.countDocuments({
          createdAt: {
            $gte: previousStart,
            $lt: previousEnd,
          },
        }),
      ]);

      if (previousUsers > 0) {
        userGrowthPercentage = Math.round(
          ((currentUsers - previousUsers) /
            previousUsers) *
            100
        );
      } else if (currentUsers > 0) {
        userGrowthPercentage = 100;
      }
    } catch (error) {
      console.log(
        "Growth percentage error:",
        error.message
      );
    }

    /* =====================================================
       PLATFORM HEALTH
    ===================================================== */

    let databaseStatus = "Connected";

    try {
      const mongoose =
        require("mongoose");

      databaseStatus =
        mongoose.connection.readyState === 1
          ? "Connected"
          : "Disconnected";
    } catch (error) {
      databaseStatus = "Unknown";
    }

    /* =====================================================
       RESPONSE
    ===================================================== */

    return res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        activeUsers,
        totalResumes,
        totalRoadmaps,
        totalSkillGaps,
        totalInterviews,
        totalPayments,
        totalProgress,
        revenue,
        userGrowthPercentage,
        aiAnalyses:
          aiUsage.reduce(
            (sum, item) =>
              sum + item.value,
            0
          ),
      },

      userGrowth,

      aiUsage,

      popularRoles,

      recentUsers,

      recentActivity,

      platformHealth: {
        api: "Online",
        database: databaseStatus,
        ai: process.env.GEMINI_API_KEY
          ? "Available"
          : "Not Configured",
      },

      meta: {
        range,
        generatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error(
      "ADMIN DASHBOARD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load admin dashboard",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// ==========================================
// GET USERS
// ==========================================

const getAdminUsers = async (req, res) => {
  try {

    const users = await User.find()
      .select("-password")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {

    console.error(
      "Admin users error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load users",
    });
  }
};


// ==========================================
// DELETE USER
// ==========================================

const deleteAdminUser = async (req, res) => {
  try {

    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin account cannot be deleted",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {

    console.error(
      "Delete user error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};


// ==========================================
// GET ALL RESUMES FOR ADMIN
// ==========================================

const getAdminResumes = async (req, res) => {
  try {
    console.log(
      "========== ADMIN RESUMES =========="
    );

    const resumes = await Resume.find()
      .populate(
        "user",
        "name username email"
      )
      .sort({
        createdAt: -1,
      });

    console.log(
      "TOTAL RESUMES:",
      resumes.length
    );

    const formattedResumes =
      resumes.map((resume) => {
        const userName =
          resume.user?.name ||
          resume.user?.username ||
          "Unknown User";

        const initials = userName
          .split(" ")
          .map((word) =>
            word.charAt(0)
          )
          .join("")
          .substring(0, 2)
          .toUpperCase();

        return {
          _id: resume._id,

          fileName:
            resume.fileName,

          filePath:
            resume.filePath,

          user: userName,

          email:
            resume.user?.email ||
            "No email",

          initials,

          date: resume.createdAt
            ? new Date(
                resume.createdAt
              ).toLocaleDateString()
            : "Unknown date",

          atsScore:
            resume.atsScore || 0,

          strengths:
            Array.isArray(
              resume.strengths
            )
              ? resume.strengths
              : [],

          weaknesses:
            Array.isArray(
              resume.weaknesses
            )
              ? resume.weaknesses
              : [],

          missingSkills:
            Array.isArray(
              resume.missingSkills
            )
              ? resume.missingSkills
              : [],

          suggestions:
            Array.isArray(
              resume.suggestions
            )
              ? resume.suggestions
              : [],

          resumeText:
            resume.resumeText || "",
        };
      });

    return res.status(200).json({
      success: true,

      total: formattedResumes.length,

      resumes: formattedResumes,
    });

  } catch (error) {
    console.error(
      "ADMIN RESUMES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load resumes",
    });
  }
};

// ==========================================
// ROADMAPS
// ==========================================

const getAdminRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({})
      .populate(
        "user",
        "username name email"
      )
      .sort({
        updatedAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: roadmaps.length,
      roadmaps,
    });
  } catch (error) {
    console.error(
      "GET ADMIN ROADMAPS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin roadmaps",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL SKILL GAP ANALYSES FOR ADMIN
// ==========================================

const getAdminSkillGaps = async (req, res) => {
  try {
    console.log("========== ADMIN SKILL GAP ==========");

    const SkillGap = require("../models/SkillGap");

    const skillGaps = await SkillGap.find()
      .populate(
        "user",
        "name username email"
      )
      .sort({
        createdAt: -1,
      });

    console.log(
      "TOTAL SKILL GAP ANALYSES:",
      skillGaps.length
    );

    const formattedSkillGaps = skillGaps.map(
      (skillGap) => {

        const userName =
          skillGap.user?.name ||
          skillGap.user?.username ||
          "Unknown User";

        const initials = userName
          .split(" ")
          .map((word) => word.charAt(0))
          .join("")
          .substring(0, 2)
          .toUpperCase();

        // Convert mongoose document to plain object
        const skillGapData =
          skillGap.toObject();

        return {
          // First spread the original data
          ...skillGapData,

          // Then OVERRIDE these fields
          // so React gets strings instead of objects
          _id: skillGap._id,

          user: userName,

          email:
            skillGap.user?.email ||
            "No email",

          initials,

          date: skillGap.createdAt
            ? new Date(
                skillGap.createdAt
              ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "Unknown date",
        };
      }
    );

    console.log(
      "FORMATTED SKILL GAPS:",
      formattedSkillGaps.length
    );

    return res.status(200).json({
      success: true,

      total:
        formattedSkillGaps.length,

      skillGaps:
        formattedSkillGaps,
    });

  } catch (error) {

    console.error(
      "ADMIN SKILL GAP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to load skill gap analyses",

      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};


// ==========================================
// GET ADMIN INTERVIEWS
// ==========================================

const getAdminInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate("user", "name username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      interviews,
    });

  } catch (error) {
    console.error("Get admin interviews error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch interviews",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN: GET ALL COURSES
// GET /api/admin/courses
// ==========================================
const getAdminCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Get admin courses error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};
// ==========================================
// ADMIN: CREATE COURSE
// POST /api/admin/courses
// ==========================================
const createAdminCourse = async (req, res) => {
  try {
    const {
      title,
      type,
      category,
      level,
      provider,
      duration,
      url,
      description,
      skills,
    } = req.body;
    if (!title || !url) {
      return res.status(400).json({
        success: false,
        message: "Course title and URL are required",
      });
    }
    const newCourse = await Course.create({
      title: title.trim(),
      type: type || "Video Course",
      category: category ? category.trim() : "Web Development",
      level: level || "Beginner",
      provider: provider ? provider.trim() : "Online",
      duration: duration ? duration.trim() : "Self-Paced",
      url: url.trim(),
      description: description ? description.trim() : "",
      skills: Array.isArray(skills) ? skills : [],
      addedBy: req.user?._id,
    });
    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("Create course error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};
// ==========================================
// ADMIN: UPDATE COURSE
// PUT /api/admin/courses/:id
// ==========================================
const updateAdminCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Course.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updated,
    });
  } catch (error) {
    console.error("Update course error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
    });
  }
};
// ==========================================
// ADMIN: DELETE COURSE
// DELETE /api/admin/courses/:id
// ==========================================
const deleteAdminCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Course.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN USER LEARNINGS
// ==========================================
const getAdminUserLearnings = async (req, res) => {
  try {
    console.log("=================================");
    console.log("ADMIN USER LEARNINGS");
    console.log("=================================");

    // ------------------------------------------
    // CHECK LEARNING MODEL
    // ------------------------------------------

    console.log(
      "Learning model:",
      Learning?.modelName
    );

    console.log(
      "Learning fields:",
      Object.keys(Learning.schema.paths)
    );

    // ------------------------------------------
    // GET ALL LEARNINGS
    // ------------------------------------------

    const learnings = await Learning.find({})
      .sort({ createdAt: -1 })
      .lean();

    console.log(
      "Total learnings:",
      learnings.length
    );

    // ------------------------------------------
    // GET USER IDs
    // ------------------------------------------

    const userIds = learnings
      .map((item) => item.user)
      .filter(Boolean);

    // ------------------------------------------
    // GET COURSE IDs
    // ------------------------------------------

    const courseIds = learnings
      .map((item) => item.course)
      .filter(Boolean);

    // ------------------------------------------
    // FETCH USERS
    // ------------------------------------------

    let users = [];

    if (userIds.length > 0) {
      users = await User.find({
        _id: { $in: userIds },
      })
        .select("name username email")
        .lean();
    }

    // ------------------------------------------
    // FETCH COURSES
    // ------------------------------------------

    let courses = [];

    if (
      courseIds.length > 0 &&
      Course
    ) {
      courses = await Course.find({
        _id: { $in: courseIds },
      })
        .select("title category provider")
        .lean();
    }

    // ------------------------------------------
    // CREATE LOOKUP MAPS
    // ------------------------------------------

    const userMap = {};

    users.forEach((user) => {
      userMap[String(user._id)] = user;
    });

    const courseMap = {};

    courses.forEach((course) => {
      courseMap[String(course._id)] = course;
    });

    // ------------------------------------------
    // FORMAT DATA
    // ------------------------------------------

    const formattedLearnings =
      learnings.map((learning) => {

        const user =
          learning.user
            ? userMap[String(learning.user)]
            : null;

        const course =
          learning.course
            ? courseMap[String(learning.course)]
            : null;

        return {
          ...learning,

          user: user
            ? {
                _id: user._id,
                name:
                  user.name ||
                  user.username ||
                  "Unknown User",
                username:
                  user.username || "",
                email:
                  user.email || "",
              }
            : null,

          course: course
            ? {
                _id: course._id,
                title:
                  course.title ||
                  "Untitled Course",
                category:
                  course.category ||
                  "",
                provider:
                  course.provider ||
                  "",
              }
            : null,
        };
      });

    // ------------------------------------------
    // RESPONSE
    // ------------------------------------------

    return res.status(200).json({
      success: true,
      count: formattedLearnings.length,
      learnings: formattedLearnings,
    });

  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "ADMIN USER LEARNINGS ERROR"
    );

    console.error(
      error
    );

    console.error(
      "ERROR MESSAGE:",
      error.message
    );

    console.error(
      "ERROR STACK:",
      error.stack
    );

    console.error(
      "================================="
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user learnings",

      // TEMPORARY: useful for Render debugging
      error: error.message,
    });
  }
};

// ==========================================
// PAYMENTS
// ==========================================

const getAdminPayments = async (req, res) => {
  try {
    console.log("\n========== ADMIN PAYMENTS ==========");

    const payments = await Payment.find({})
      .populate("user", "name username email phone")
      .sort({ createdAt: -1 })
      .lean();

    console.log("TOTAL PAYMENTS:", payments.length);

    console.log(
      "PAYMENTS:",
      payments.map((payment) => ({
        id: payment._id,
        user: payment.user?.email,
        plan: payment.plan,
        amount: payment.amount,
        status: payment.status,
        orderId: payment.orderId,
        transactionId: payment.transactionId,
      }))
    );

    // IMPORTANT:
    // Prevent browser / proxy caching
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "Surrogate-Control": "no-store",
    });

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("ADMIN PAYMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load payments",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL USER PROGRESS
// GET /api/admin/progress
// ==========================================

const getAdminProgress = async (req, res) => {
  try {
    const progress = await Progress.find()
      .populate(
        "user",
        "name username email phone"
      )
      .sort({
        updatedAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: progress.length,
      progress,
    });
  } catch (error) {
    console.error(
      "ADMIN PROGRESS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load user progress",
      error: error.message,
    });
  }
};


// ==========================================
// GET ALL USER ACHIEVEMENTS
// GET /api/admin/achievements
// ==========================================

const getAdminAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find()
      .populate(
        "user",
        "name username email phone"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: achievements.length,
      achievements,
    });
  } catch (error) {
    console.error(
      "ADMIN ACHIEVEMENTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load achievements",
      error: error.message,
    });
  }
};

const createCertificateCriteria = async (req, res) => {
  try {
    const {
      name,
      description,
      resumeScore,
      roadmapCompleted,
      learningCompleted,
      interviewScore,
      overallProgress,
      certificateTitle,
      organizationName,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Certificate criteria name is required",
      });
    }

    const criteria = await CertificateCriteria.create({
      name,
      description,
      resumeScore,
      roadmapCompleted,
      learningCompleted,
      interviewScore,
      overallProgress,
      certificateTitle,
      organizationName,
    });

    return res.status(201).json({
      success: true,
      message: "Certificate criteria created successfully",
      criteria,
    });
  } catch (error) {
    console.error(
      "CREATE CERTIFICATE CRITERIA ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create certificate criteria",
      error: error.message,
    });
  }
};

const getCertificateCriteria = async (req, res) => {
  try {
    const criteria = await CertificateCriteria.find()
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      criteria,
    });
  } catch (error) {
    console.error(
      "GET CERTIFICATE CRITERIA ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load certificate criteria",
      error: error.message,
    });
  }
};

const updateCertificateCriteria = async (req, res) => {
  try {
    const { id } = req.params;

    const criteria =
      await CertificateCriteria.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!criteria) {
      return res.status(404).json({
        success: false,
        message: "Certificate criteria not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Certificate criteria updated successfully",
      criteria,
    });
  } catch (error) {
    console.error(
      "UPDATE CERTIFICATE CRITERIA ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update certificate criteria",
      error: error.message,
    });
  }
};

const deleteCertificateCriteria = async (req, res) => {
  try {
    const { id } = req.params;

    const criteria =
      await CertificateCriteria.findByIdAndDelete(id);

    if (!criteria) {
      return res.status(404).json({
        success: false,
        message: "Certificate criteria not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Certificate criteria deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE CERTIFICATE CRITERIA ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete certificate criteria",
      error: error.message,
    });
  }
};

const checkCertificateEligibility = async (
  req,
  res
) => {
  try {
    const { userId, criteriaId } = req.params;

    const criteria =
      await CertificateCriteria.findById(criteriaId);

    if (!criteria) {
      return res.status(404).json({
        success: false,
        message: "Certificate criteria not found",
      });
    }

    const progress = await Progress.findOne({
      user: userId,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "User progress not found",
      });
    }

    const checks = {
      resumeScore:
        progress.resumeScore >= criteria.resumeScore,

      roadmapCompleted:
        progress.roadmapCompleted >=
        criteria.roadmapCompleted,

      learningCompleted:
        progress.learningCompleted >=
        criteria.learningCompleted,

      interviewScore:
        progress.interviewScore >=
        criteria.interviewScore,

      overallProgress:
        progress.overallProgress >=
        criteria.overallProgress,
    };

    const eligible = Object.values(checks).every(
      Boolean
    );

    return res.status(200).json({
      success: true,
      eligible,
      checks,
      progress,
      criteria,
    });
  } catch (error) {
    console.error(
      "CHECK CERTIFICATE ELIGIBILITY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to check certificate eligibility",
      error: error.message,
    });
  }
};

const generateCertificate = async (req, res) => {
  try {
    const { userId, criteriaId } = req.body;

    const criteria =
      await CertificateCriteria.findById(criteriaId);

    if (!criteria) {
      return res.status(404).json({
        success: false,
        message: "Certificate criteria not found",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const progress = await Progress.findOne({
      user: userId,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "User progress not found",
      });
    }

    // ==========================================
    // CHECK ALL CONDITIONS
    // ==========================================

    const eligible =
      progress.resumeScore >=
        criteria.resumeScore &&
      progress.roadmapCompleted >=
        criteria.roadmapCompleted &&
      progress.learningCompleted >=
        criteria.learningCompleted &&
      progress.interviewScore >=
        criteria.interviewScore &&
      progress.overallProgress >=
        criteria.overallProgress;

    if (!eligible) {
      return res.status(400).json({
        success: false,
        eligible: false,
        message:
          "User does not satisfy certificate criteria.",
      });
    }

    // ==========================================
    // PREVENT DUPLICATE CERTIFICATE
    // ==========================================

    const existingCertificate =
      await Certificate.findOne({
        user: userId,
        criteria: criteriaId,
        status: "Generated",
      });

    if (existingCertificate) {
      return res.status(200).json({
        success: true,
        message: "Certificate already generated",
        certificate: existingCertificate,
      });
    }

    // ==========================================
    // GENERATE UNIQUE ID
    // ==========================================

    const certificateId =
      "CP-" +
      new Date().getFullYear() +
      "-" +
      Date.now();

    const certificate = await Certificate.create({
      user: userId,
      criteria: criteriaId,
      certificateId,
      title: criteria.certificateTitle,
      achievementName: criteria.name,
      recipientName: user.name,
      organizationName:
        criteria.organizationName,
      issueDate: new Date(),
      status: "Generated",
    });

    return res.status(201).json({
      success: true,
      message: "Certificate generated successfully",
      certificate,
    });
  } catch (error) {
    console.error(
      "GENERATE CERTIFICATE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to generate certificate",
      error: error.message,
    });
  }
};

// ==========================================
// FEEDBACK
// ==========================================

const getAdminFeedback = async (req, res) => {
  try {

    res.status(200).json({
      success: true,
      feedback: [],
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to load feedback",
    });
  }
};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  getAdminDashboard,
  getAdminUsers,
  deleteAdminUser,
  getAdminResumes,
  getAdminRoadmaps,
  getAdminSkillGaps,
  getAdminInterviews,
  getAdminCourses,
  createAdminCourse,
  updateAdminCourse,
  deleteAdminCourse,
  getAdminUserLearnings,
  getAdminPayments,
  getAdminProgress,
  getAdminAchievements,
  createCertificateCriteria,
  getCertificateCriteria,
  updateCertificateCriteria,
  deleteCertificateCriteria,
  checkCertificateEligibility,
  generateCertificate,
  getAdminFeedback,
};