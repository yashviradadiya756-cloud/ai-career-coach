import React, { useEffect, useMemo, useState } from "react";

import {
  getLearning,
  generateLearning,
} from "../../api/learningApi";

import { getLatestSkillGap } from "../../api/skillGapApi";

export default function Learning() {
  // =========================================================
  // EXISTING BACKEND STATE
  // =========================================================

  const [learning, setLearning] = useState(null);
  const [skillGap, setSkillGap] = useState(null);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =========================================================
  // UI STATE
  // =========================================================

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [selectedCourse, setSelectedCourse] =
    useState(null);

  const [showPremiumModal, setShowPremiumModal] =
    useState(false);

  const [favorites, setFavorites] = useState([]);

  const [activeQuickPanel, setActiveQuickPanel] =
    useState("");

  // =========================================================
  // PREMIUM USER CHECK
  // =========================================================

  const isPremiumUser = useMemo(() => {
    try {
      const storedUser =
        localStorage.getItem("user") ||
        localStorage.getItem("currentUser");

      if (!storedUser) {
        return false;
      }

      const user = JSON.parse(storedUser);

      return Boolean(
        user?.isPremium === true ||
          user?.premium === true ||
          user?.isPro === true ||
          user?.isPremiumUser === true ||
          user?.subscription === "pro" ||
          user?.subscription === "premium" ||
          user?.subscription === "active" ||
          user?.plan === "pro" ||
          user?.plan === "premium" ||
          user?.membership === "pro" ||
          user?.membership === "premium"
      );
    } catch (err) {
      console.error("Premium status error:", err);
      return false;
    }
  }, []);

  // =========================================================
  // ALL IT PREMIUM COURSES
  // =========================================================

  const allCourses = [
    // -------------------------------------------------------
    // DEVELOPMENT
    // -------------------------------------------------------

    {
      id: 1,
      title: "Full Stack MERN Masterclass",
      category: "Development",
      icon: "⚛️",
      description:
        "Master MongoDB, Express, React and Node.js with real-world projects.",
      videos: 124,
      level: "Intermediate",
      duration: "18 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=MERN+stack+course",
    },

    {
      id: 2,
      title: "Advanced React.js",
      category: "Development",
      icon: "⚛️",
      description:
        "Learn React hooks, state management, performance and advanced patterns.",
      videos: 96,
      level: "Advanced",
      duration: "15 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=advanced+React+course",
    },

    {
      id: 3,
      title: "Node.js & Express.js",
      category: "Development",
      icon: "🟢",
      description:
        "Build scalable REST APIs and backend applications using Node.js.",
      videos: 88,
      level: "Intermediate",
      duration: "13 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Node.js+Express+course",
    },

    {
      id: 4,
      title: "Next.js Full Stack Development",
      category: "Development",
      icon: "▲",
      description:
        "Build production-ready applications using Next.js and modern React.",
      videos: 78,
      level: "Advanced",
      duration: "14 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Next.js+course",
    },

    {
      id: 5,
      title: "Angular Development",
      category: "Development",
      icon: "🔺",
      description:
        "Learn Angular components, services, routing and enterprise applications.",
      videos: 72,
      level: "Intermediate",
      duration: "12 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Angular+course",
    },

    // -------------------------------------------------------
    // PROGRAMMING
    // -------------------------------------------------------

    {
      id: 6,
      title: "Advanced Python Programming",
      category: "Programming",
      icon: "🐍",
      description:
        "Master Python programming, OOP, APIs, automation and projects.",
      videos: 236,
      level: "Intermediate",
      duration: "24 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=advanced+Python+course",
    },

    {
      id: 7,
      title: "Java Programming Masterclass",
      category: "Programming",
      icon: "☕",
      description:
        "Learn Java, OOP, collections, exception handling and backend development.",
      videos: 180,
      level: "Intermediate",
      duration: "22 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Java+programming+course",
    },

    {
      id: 8,
      title: "C++ Programming",
      category: "Programming",
      icon: "💻",
      description:
        "Learn C++ programming, OOP and problem-solving for technical interviews.",
      videos: 150,
      level: "Intermediate",
      duration: "20 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=C%2B%2B+programming+course",
    },

    {
      id: 9,
      title: "TypeScript Complete Course",
      category: "Programming",
      icon: "🔷",
      description:
        "Build safer and scalable applications using TypeScript.",
      videos: 82,
      level: "Intermediate",
      duration: "11 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=TypeScript+course",
    },

    {
      id: 10,
      title: "Data Structures & Algorithms",
      category: "Programming",
      icon: "🧠",
      description:
        "Prepare for technical interviews with DSA concepts and coding problems.",
      videos: 180,
      level: "Intermediate",
      duration: "30 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=DSA+course",
    },

    // -------------------------------------------------------
    // DATA & AI
    // -------------------------------------------------------

    {
      id: 11,
      title: "Machine Learning with Python",
      category: "Data & AI",
      icon: "🤖",
      description:
        "Learn machine learning algorithms and build practical AI projects.",
      videos: 135,
      level: "Advanced",
      duration: "25 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Machine+Learning+Python+course",
    },

    {
      id: 12,
      title: "Artificial Intelligence",
      category: "Data & AI",
      icon: "🧠",
      description:
        "Understand AI concepts, neural networks and modern AI applications.",
      videos: 110,
      level: "Advanced",
      duration: "21 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Artificial+Intelligence+course",
    },

    {
      id: 13,
      title: "Data Science with Python",
      category: "Data & AI",
      icon: "📊",
      description:
        "Learn NumPy, Pandas, visualization and data analysis.",
      videos: 118,
      level: "Intermediate",
      duration: "19 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Data+Science+Python+course",
    },

    {
      id: 14,
      title: "Generative AI & LLM Development",
      category: "Data & AI",
      icon: "✨",
      description:
        "Learn LLM concepts, prompt engineering and AI application development.",
      videos: 92,
      level: "Advanced",
      duration: "16 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Generative+AI+LLM+course",
    },

    // -------------------------------------------------------
    // DATABASE
    // -------------------------------------------------------

    {
      id: 15,
      title: "SQL & Database Mastery",
      category: "Database",
      icon: "🗄️",
      description:
        "Master SQL queries, joins, indexes, relationships and database design.",
      videos: 105,
      level: "Intermediate",
      duration: "15 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=SQL+database+course",
    },

    {
      id: 16,
      title: "MongoDB Developer Course",
      category: "Database",
      icon: "🍃",
      description:
        "Learn MongoDB collections, queries, aggregation and Mongoose.",
      videos: 75,
      level: "Intermediate",
      duration: "10 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=MongoDB+course",
    },

    {
      id: 17,
      title: "PostgreSQL Advanced",
      category: "Database",
      icon: "🐘",
      description:
        "Learn PostgreSQL, relational design, advanced queries and optimization.",
      videos: 70,
      level: "Advanced",
      duration: "11 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=PostgreSQL+course",
    },

    // -------------------------------------------------------
    // CLOUD
    // -------------------------------------------------------

    {
      id: 18,
      title: "AWS Cloud Fundamentals",
      category: "Cloud",
      icon: "☁️",
      description:
        "Learn AWS services, deployment, cloud architecture and security.",
      videos: 96,
      level: "Intermediate",
      duration: "15 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=AWS+cloud+course",
    },

    {
      id: 19,
      title: "Microsoft Azure Fundamentals",
      category: "Cloud",
      icon: "🔵",
      description:
        "Learn Azure cloud services, virtual machines and cloud architecture.",
      videos: 80,
      level: "Beginner",
      duration: "12 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Azure+cloud+course",
    },

    {
      id: 20,
      title: "Google Cloud Platform",
      category: "Cloud",
      icon: "☁️",
      description:
        "Learn GCP services, deployment and cloud infrastructure.",
      videos: 75,
      level: "Intermediate",
      duration: "11 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Google+Cloud+course",
    },

    // -------------------------------------------------------
    // DEVOPS
    // -------------------------------------------------------

    {
      id: 21,
      title: "Docker & Containers",
      category: "DevOps",
      icon: "🐳",
      description:
        "Learn Docker containers, images, networks and deployment workflows.",
      videos: 75,
      level: "Intermediate",
      duration: "10 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Docker+course",
    },

    {
      id: 22,
      title: "Kubernetes Complete Course",
      category: "DevOps",
      icon: "☸️",
      description:
        "Learn Kubernetes architecture, pods, deployments and services.",
      videos: 105,
      level: "Advanced",
      duration: "16 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Kubernetes+course",
    },

    {
      id: 23,
      title: "CI/CD with GitHub Actions",
      category: "DevOps",
      icon: "⚙️",
      description:
        "Build automated CI/CD pipelines using GitHub Actions.",
      videos: 68,
      level: "Intermediate",
      duration: "9 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=GitHub+Actions+CI+CD",
    },

    // -------------------------------------------------------
    // CYBERSECURITY
    // -------------------------------------------------------

    {
      id: 24,
      title: "Cybersecurity Fundamentals",
      category: "Cybersecurity",
      icon: "🔐",
      description:
        "Learn cybersecurity fundamentals, threats, vulnerabilities and protection.",
      videos: 115,
      level: "Beginner",
      duration: "18 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Cybersecurity+fundamentals+course",
    },

    {
      id: 25,
      title: "Ethical Hacking",
      category: "Cybersecurity",
      icon: "🛡️",
      description:
        "Learn ethical security testing and defensive cybersecurity concepts.",
      videos: 140,
      level: "Advanced",
      duration: "22 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Ethical+Hacking+course",
    },

    {
      id: 26,
      title: "Web Application Security",
      category: "Cybersecurity",
      icon: "🔒",
      description:
        "Understand authentication, authorization and common web security risks.",
      videos: 80,
      level: "Advanced",
      duration: "13 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Web+Application+Security+course",
    },

    // -------------------------------------------------------
    // MOBILE
    // -------------------------------------------------------

    {
      id: 27,
      title: "Flutter App Development",
      category: "Mobile",
      icon: "📱",
      description:
        "Build cross-platform mobile apps using Flutter and Dart.",
      videos: 125,
      level: "Intermediate",
      duration: "20 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Flutter+course",
    },

    {
      id: 28,
      title: "Android Development with Kotlin",
      category: "Mobile",
      icon: "🤖",
      description:
        "Build Android applications using Kotlin and Android Studio.",
      videos: 130,
      level: "Intermediate",
      duration: "22 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Android+Kotlin+course",
    },

    // -------------------------------------------------------
    // DESIGN
    // -------------------------------------------------------

    {
      id: 29,
      title: "UI/UX Design with Figma",
      category: "Design",
      icon: "🎨",
      description:
        "Learn professional UI/UX design and build modern Figma projects.",
      videos: 87,
      level: "Beginner",
      duration: "12 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Figma+UI+UX+course",
    },

    {
      id: 30,
      title: "Product Design Fundamentals",
      category: "Design",
      icon: "✨",
      description:
        "Learn user research, wireframes, prototypes and product design.",
      videos: 72,
      level: "Beginner",
      duration: "10 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Product+Design+course",
    },

    // -------------------------------------------------------
    // TESTING
    // -------------------------------------------------------

    {
      id: 31,
      title: "Software Testing & QA",
      category: "Testing",
      icon: "🧪",
      description:
        "Learn software testing concepts, test cases and QA practices.",
      videos: 85,
      level: "Beginner",
      duration: "12 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Software+Testing+QA+course",
    },

    {
      id: 32,
      title: "Automation Testing with Selenium",
      category: "Testing",
      icon: "⚡",
      description:
        "Automate browser testing using Selenium and programming.",
      videos: 90,
      level: "Intermediate",
      duration: "14 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Selenium+Automation+Testing+course",
    },

    // -------------------------------------------------------
    // CAREER
    // -------------------------------------------------------

    {
      id: 33,
      title: "Technical Interview Preparation",
      category: "Career",
      icon: "🎤",
      description:
        "Prepare for technical interviews with coding and CS fundamentals.",
      videos: 100,
      level: "Intermediate",
      duration: "16 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Technical+Interview+Preparation",
    },

    {
      id: 34,
      title: "Git & GitHub Professional",
      category: "Career",
      icon: "🔧",
      description:
        "Master Git workflows, GitHub collaboration and professional repositories.",
      videos: 65,
      level: "Beginner",
      duration: "8 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Git+GitHub+course",
    },

    {
      id: 35,
      title: "Placement Preparation Masterclass",
      category: "Career",
      icon: "🏆",
      description:
        "Prepare for placements with aptitude, technical and HR preparation.",
      videos: 150,
      level: "Intermediate",
      duration: "25 Hours",
      premium: true,
      url: "https://www.youtube.com/results?search_query=Placement+Preparation+course",
    },
  ];

  // =========================================================
  // CATEGORIES
  // =========================================================

  const categories = [
    "All",
    "Development",
    "Programming",
    "Data & AI",
    "Database",
    "Cloud",
    "DevOps",
    "Cybersecurity",
    "Mobile",
    "Design",
    "Testing",
    "Career",
  ];

  // =========================================================
  // LOAD DATA
  // =========================================================

  useEffect(() => {
    loadLearningData();

    const savedFavorites =
      localStorage.getItem("learningFavorites");

    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  // =========================================================
  // LOAD EXISTING BACKEND DATA
  // =========================================================

  const loadLearningData = async () => {
    try {
      setLoading(true);
      setError("");

      // -------------------------------
      // LEARNING API
      // -------------------------------

      try {
        const response = await getLearning();

        console.log(
          "LEARNING API:",
          JSON.stringify(response, null, 2)
        );

        if (
          response?.success &&
          response?.learning
        ) {
          setLearning(response.learning);
        } else {
          setLearning(null);
        }
      } catch (err) {
        console.error(
          "Learning API Error:",
          err.response?.data || err.message
        );

        setLearning(null);
      }

      // -------------------------------
      // SKILL GAP API
      // -------------------------------

      try {
        const response =
          await getLatestSkillGap();

        console.log(
          "SKILL GAP API:",
          JSON.stringify(response, null, 2)
        );

        if (
          response?.success &&
          response?.skillGap
        ) {
          setSkillGap(response.skillGap);
        } else {
          setSkillGap(null);
        }
      } catch (err) {
        console.error(
          "Skill Gap API Error:",
          err.response?.data || err.message
        );

        setSkillGap(null);
      }
    } catch (err) {
      console.error("Learning Error:", err);

      setError(
        "Failed to load learning dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // EXISTING VALUES
  // =========================================================

  const targetRole =
    learning?.targetRole ||
    skillGap?.targetRole ||
    "";

  const missingSkills = Array.isArray(
    skillGap?.missingSkills
  )
    ? skillGap.missingSkills
    : [];

  const recommendations = Array.isArray(
    learning?.recommendations
  )
    ? learning.recommendations
    : [];

  // =========================================================
  // FILTER COURSES
  // =========================================================

  const filteredCourses =
    selectedCategory === "All"
      ? allCourses
      : allCourses.filter(
          (course) =>
            course.category ===
            selectedCategory
        );

  // =========================================================
  // FAVORITE COURSES
  // =========================================================

  const favoriteCourses = allCourses.filter(
    (course) =>
      favorites.includes(course.id)
  );

  // =========================================================
  // GENERATE AI LEARNING PLAN
  // =========================================================

  const handleGenerateLearning =
    async () => {
      try {
        setGenerating(true);
        setError("");
        setMessage("");

        const role =
          learning?.targetRole ||
          skillGap?.targetRole;

        if (!role) {
          setError(
            "Please complete Skill Gap Analysis first."
          );
          return;
        }

        if (missingSkills.length === 0) {
          setError(
            "No missing skills found in your Skill Gap Analysis."
          );
          return;
        }

        const response =
          await generateLearning(role);

        console.log(
          "GENERATED LEARNING:",
          JSON.stringify(
            response,
            null,
            2
          )
        );

        if (
          response?.success &&
          response?.learning
        ) {
          setLearning(
            response.learning
          );

          setMessage(
            "AI Learning Plan generated successfully!"
          );
        } else {
          setError(
            response?.message ||
              "Failed to generate learning plan."
          );
        }
      } catch (err) {
        console.error(
          "Generate Learning Error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to generate learning plan."
        );
      } finally {
        setGenerating(false);
      }
    };

  // =========================================================
  // COURSE CLICK
  // =========================================================

  const handleCourseClick = (course) => {
    if (!course) return;

    // Every static course is PREMIUM
    if (course.premium) {
      if (isPremiumUser) {
        window.open(
          course.url,
          "_blank",
          "noopener,noreferrer"
        );
        return;
      }

      setSelectedCourse(course);
      setShowPremiumModal(true);
      return;
    }

    // Fallback
    window.open(
      course.url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =========================================================
  // FAVORITE
  // =========================================================

  const toggleFavorite = (courseId) => {
    setFavorites((previous) => {
      let updated;

      if (previous.includes(courseId)) {
        updated = previous.filter(
          (id) => id !== courseId
        );
      } else {
        updated = [
          ...previous,
          courseId,
        ];
      }

      localStorage.setItem(
        "learningFavorites",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  // =========================================================
  // QUICK ACTION SCROLL
  // =========================================================

  const scrollToSection = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  // =========================================================
  // QUICK ACTION
  // =========================================================

  const handleQuickAction = (title) => {
    if (title === "Courses") {
      scrollToSection("premium-courses");
      return;
    }

    if (title === "Favorites") {
      scrollToSection("my-courses");
      return;
    }

    if (title === "Explore") {
      scrollToSection("premium-courses");
      return;
    }

    if (title === "Notifications") {
      setActiveQuickPanel("notifications");
      return;
    }

    if (title === "Alerts") {
      setActiveQuickPanel("alerts");
      return;
    }

    if (title === "Tips") {
      setActiveQuickPanel("tips");
      return;
    }
  };

  // =========================================================
  // UPGRADE
  // =========================================================

  const handleUpgrade = () => {
    setShowPremiumModal(false);

    window.location.href = "/pricing";
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <div style={styles.loadingIcon}>
            📚
          </div>

          <h2 style={styles.loadingTitle}>
            Loading Learning Center...
          </h2>

          <p style={styles.loadingText}>
            Preparing your personalized
            learning dashboard.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div style={styles.container}>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>
            📚 Learning Center
          </h1>

          <p style={styles.headerDescription}>
            Learn new IT skills, explore premium
            courses, improve your technical knowledge
            and become job-ready with CareerPilot.
          </p>

          {targetRole && (
            <span style={styles.targetRole}>
              🎯 Target Role:{" "}
              <strong>
                {targetRole}
              </strong>
            </span>
          )}
        </div>

        <div
          style={
            isPremiumUser
              ? styles.proStatus
              : styles.freeStatus
          }
        >
          {isPremiumUser
            ? "👑 PRO MEMBER"
            : "FREE PLAN"}
        </div>
      </div>

      {/* =====================================================
          ALERTS
      ===================================================== */}

      {error && (
        <div style={styles.error}>
          ⚠️ {error}
        </div>
      )}

      {message && (
        <div style={styles.success}>
          ✅ {message}
        </div>
      )}

      {/* =====================================================
          STATS
      ===================================================== */}

      <div style={styles.cards}>

        <div style={styles.card}>
          <div style={styles.cardIconBlue}>
            🧠
          </div>

          <div>
            <h3 style={styles.cardTitle}>
              Recommended Skills
            </h3>

            <h1
              style={{
                ...styles.cardNumber,
                color: "#2563eb",
              }}
            >
              {missingSkills.length}
            </h1>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIconGreen}>
            📚
          </div>

          <div>
            <h3 style={styles.cardTitle}>
              Total Courses
            </h3>

            <h1
              style={{
                ...styles.cardNumber,
                color: "#16a34a",
              }}
            >
              {allCourses.length}
            </h1>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIconYellow}>
            ⭐
          </div>

          <div>
            <h3 style={styles.cardTitle}>
              Favorites
            </h3>

            <h1
              style={{
                ...styles.cardNumber,
                color: "#f59e0b",
              }}
            >
              {favorites.length}
            </h1>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIconRed}>
            👑
          </div>

          <div>
            <h3 style={styles.cardTitle}>
              Access
            </h3>

            <h1
              style={{
                ...styles.cardNumber,
                color: isPremiumUser
                  ? "#16a34a"
                  : "#dc2626",
              }}
            >
              {isPremiumUser
                ? "PRO"
                : "FREE"}
            </h1>
          </div>
        </div>

      </div>

      {/* =====================================================
          AI LEARNING PLAN
      ===================================================== */}

      <div style={styles.generateBox}>

        <div style={styles.generateContent}>

          <h2 style={styles.generateTitle}>
            🤖 AI Learning Plan
          </h2>

          <p style={styles.generateDescription}>
            Generate personalized learning
            resources based on your Skill Gap
            Analysis.
          </p>

          {targetRole ? (
            <p style={styles.roleText}>
              <strong>
                Target Role:
              </strong>{" "}
              {targetRole}
            </p>
          ) : (
            <p style={styles.warningText}>
              ⚠️ Please complete Skill Gap
              Analysis first.
            </p>
          )}

        </div>

        <button
          onClick={handleGenerateLearning}
          disabled={
            generating ||
            !targetRole ||
            missingSkills.length === 0
          }
          style={{
            ...styles.button,
            opacity:
              generating ||
              !targetRole ||
              missingSkills.length === 0
                ? 0.6
                : 1,
            cursor:
              generating ||
              !targetRole ||
              missingSkills.length === 0
                ? "not-allowed"
                : "pointer",
          }}
        >
          {generating
            ? "Generating..."
            : "Generate Learning Plan"}
        </button>

      </div>

      {/* =====================================================
          SKILLS YOU NEED
      ===================================================== */}

      {skillGap && (
        <div style={styles.section}>

          <div style={styles.sectionHeader}>

            <div>
              <h2 style={styles.sectionTitle}>
                🧩 Skills You Need to Learn
              </h2>

              <p style={styles.sectionSubtitle}>
                Based on your latest Skill Gap
                Analysis.
              </p>
            </div>

            <span style={styles.skillCount}>
              {missingSkills.length} skills
            </span>

          </div>

          {missingSkills.length > 0 ? (
            <div style={styles.skillList}>
              {missingSkills.map(
                (skill, index) => (
                  <span
                    key={index}
                    style={styles.skillBadge}
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          ) : (
            <p style={styles.emptyText}>
              No missing skills were found.
            </p>
          )}

        </div>
      )}

      {/* =====================================================
          AI RECOMMENDED COURSES
          THIS SECTION IS NOT PREMIUM LOCKED
      ===================================================== */}

      <div
        id="ai-recommendations"
        style={styles.section}
      >

        <div style={styles.sectionHeader}>

          <div>
            <h2 style={styles.sectionTitle}>
              🤖 AI Recommended Learning
            </h2>

            <p style={styles.sectionSubtitle}>
              Personalized resources based on
              your Skill Gap Analysis.
            </p>
          </div>

          <span style={styles.aiBadge}>
            AI POWERED
          </span>

        </div>

        {recommendations.length === 0 ? (

          <div style={styles.empty}>

            <div style={styles.emptyIcon}>
              🤖
            </div>

            <h3 style={styles.emptyTitle}>
              No AI recommendations yet
            </h3>

            <p style={styles.emptyDescription}>
              Complete your Skill Gap Analysis
              and generate your personalized
              AI learning plan.
            </p>

            {targetRole && (
              <button
                onClick={handleGenerateLearning}
                disabled={generating}
                style={styles.smallButton}
              >
                {generating
                  ? "Generating..."
                  : "Generate AI Plan"}
              </button>
            )}

          </div>

        ) : (

          <div style={styles.courseGrid}>

            {recommendations.map(
              (item, index) => (

                <div
                  key={index}
                  style={styles.aiCourseCard}
                >

                  <div style={styles.courseHeader}>

                    <div style={styles.courseInfo}>

                      <div style={styles.courseIcon}>
                        🤖
                      </div>

                      <div>
                        <h3
                          style={styles.courseTitle}
                        >
                          {item.course ||
                            "AI Recommended Course"}
                        </h3>

                        {item.skill && (
                          <span
                            style={
                              styles.courseSkill
                            }
                          >
                            {item.skill}
                          </span>
                        )}
                      </div>

                    </div>

                    {item.duration && (
                      <span style={styles.duration}>
                        ⏱ {item.duration}
                      </span>
                    )}

                  </div>

                  <div style={styles.courseDetails}>

                    <div style={styles.detailBox}>
                      <span style={styles.detailLabel}>
                        Platform
                      </span>

                      <strong style={styles.detailValue}>
                        {item.platform ||
                          "Online"}
                      </strong>
                    </div>

                    <div style={styles.detailBox}>
                      <span style={styles.detailLabel}>
                        Level
                      </span>

                      <strong style={styles.detailValue}>
                        {item.level ||
                          "Beginner"}
                      </strong>
                    </div>

                  </div>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.link}
                    >
                      View AI Resource →
                    </a>
                  )}

                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* =====================================================
          PREMIUM COURSE SECTION
      ===================================================== */}

      <section
        id="premium-courses"
        style={styles.learnSection}
      >

        <div style={styles.learnSectionHeader}>

          <div>
            <div style={styles.premiumHeadingRow}>

              <h2 style={styles.learnSectionTitle}>
                Learn New Skills
              </h2>

              <span style={styles.premiumLabel}>
                👑 PRO COURSES
              </span>

            </div>

            <p style={styles.learnSectionSubtitle}>
              Master IT skills with CareerPilot
              Premium learning resources.
            </p>
          </div>

          <button
            style={styles.exploreButton}
            onClick={() =>
              scrollToSection(
                "premium-courses"
              )
            }
          >
            + Explore More
          </button>

        </div>

        {/* CATEGORY FILTER */}

        <div style={styles.categoryRow}>

          {categories.map((category) => (

            <button
              key={category}
              onClick={() =>
                setSelectedCategory(
                  category
                )
              }
              style={{
                ...styles.categoryButton,
                ...(selectedCategory ===
                category
                  ? styles.activeCategory
                  : {}),
              }}
            >
              {category}
            </button>

          ))}

        </div>

        {/* COURSE CARDS */}

        <div style={styles.courseShowcase}>

          {filteredCourses.map((course) => {

            const favorite =
              favorites.includes(
                course.id
              );

            return (
              <div
                key={course.id}
                style={styles.showcaseCard}
              >

                {/* PREMIUM BADGE */}

                <div style={styles.proBadge}>
                  👑 PRO
                </div>

                <div style={styles.showcaseIcon}>
                  {course.icon}
                </div>

                <h3 style={styles.showcaseTitle}>
                  {course.title}
                </h3>

                <p style={styles.showcaseDescription}>
                  {course.description}
                </p>

                <div style={styles.courseMetaRow}>

                  <span>
                    🎥 {course.videos}
                  </span>

                  <span>
                    ⏱ {course.duration}
                  </span>

                </div>

                <div style={styles.levelBadge}>
                  {course.level}
                </div>

                <div style={styles.showcaseBottom}>

                  <button
                    onClick={() =>
                      handleCourseClick(
                        course
                      )
                    }
                    style={
                      styles.learnMorePremium
                    }
                  >
                    🔒 Learn More
                  </button>

                  <button
                    onClick={() =>
                      toggleFavorite(
                        course.id
                      )
                    }
                    style={{
                      ...styles.favoriteButton,
                      color: favorite
                        ? "#f59e0b"
                        : "#64748b",
                    }}
                    title={
                      favorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    {favorite
                      ? "★"
                      : "☆"}
                  </button>

                </div>

              </div>
            );
          })}

        </div>

      </section>

      {/* =====================================================
          MY COURSES
      ===================================================== */}

      <section
        id="my-courses"
        style={styles.section}
      >

        <div style={styles.sectionHeader}>

          <div>
            <h2 style={styles.sectionTitle}>
              📚 My Courses
            </h2>

            <p style={styles.sectionSubtitle}>
              Your favorite courses are saved
              here for quick access.
            </p>
          </div>

          <span style={styles.skillCount}>
            {isPremiumUser
              ? "PRO ACCESS"
              : "FAVORITES"}
          </span>

        </div>

        {favoriteCourses.length === 0 ? (

          <div style={styles.noFavorites}>

            <div style={styles.noFavoriteIcon}>
              ⭐
            </div>

            <h3>
              No favorite courses yet
            </h3>

            <p>
              Click the ☆ icon on any course
              to save it here.
            </p>

            <button
              style={styles.smallButton}
              onClick={() =>
                scrollToSection(
                  "premium-courses"
                )
              }
            >
              Explore Courses
            </button>

          </div>

        ) : (

          <div style={styles.myCourseGrid}>

            {favoriteCourses.map(
              (course) => (

                <div
                  key={course.id}
                  style={styles.myCourseCard}
                >

                  <div style={styles.myCourseIcon}>
                    {course.icon}
                  </div>

                  <div style={styles.myCourseContent}>

                    <div style={styles.myCourseTitleRow}>

                      <h3>
                        {course.title}
                      </h3>

                      <span style={styles.miniPro}>
                        PRO
                      </span>

                    </div>

                    <p>
                      {course.category} •{" "}
                      {course.duration}
                    </p>

                  </div>

                  <button
                    style={styles.openCourseButton}
                    onClick={() =>
                      handleCourseClick(
                        course
                      )
                    }
                  >
                    Open
                  </button>

                </div>

              )
            )}

          </div>

        )}

      </section>

      {/* =====================================================
          LEARNING CURVE + QUICK ACTIONS
      ===================================================== */}

      <div style={styles.dashboardGrid}>

        {/* LEARNING CURVE */}

        {/* <section style={styles.learningCurve}>

          <div style={styles.curveHeader}>

            <div>
              <h2 style={styles.curveTitle}>
                Learning Curve
              </h2>

              <p style={styles.curveSubtitle}>
                Track your learning activity
              </p>
            </div>

            <div style={styles.changeBox}>
              <span>
                Change
              </span>

              <strong>
                +12%
              </strong>
            </div>

          </div>

          <div style={styles.chartArea}>

            <div style={styles.chartLine}></div>

            {[
              20,
              40,
              65,
              35,
              18,
              55,
              72,
              48,
              60,
              45,
              52,
              50,
            ].map(
              (height, index) => (

                <div
                  key={index}
                  style={{
                    ...styles.chartBar,
                    height: `${height}%`,
                    background:
                      index === 2 ||
                      index === 7
                        ? "#173bff"
                        : "#eeeafd",
                  }}
                />

              )
            )}

          </div>

          <div style={styles.monthRow}>

            {[
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
            ].map((month) => (

              <span key={month}>
                {month}
              </span>

            ))}

          </div>

        </section> */}

        {/* QUICK ACTIONS */}

        {/* <section style={styles.quickActions}>

          {[
            ["📚", "Courses"],
            ["☆", "Favorites"],
            ["◉", "Explore"],
            ["🔔", "Notifications"],
            ["⚠️", "Alerts"],
            ["💡", "Tips"],
          ].map(
            ([icon, title]) => (

              <button
                key={title}
                style={styles.quickAction}
                onClick={() =>
                  handleQuickAction(
                    title
                  )
                }
              >

                <span style={styles.quickIcon}>
                  {icon}
                </span>

                <strong>
                  {title}
                </strong>

              </button>

            )
          )}

          <button
            style={styles.myCoursesButton}
            onClick={() =>
              scrollToSection(
                "my-courses"
              )
            }
          >
            My Courses
          </button>

        </section> */}

      </div>

      {/* =====================================================
          AI RECOMMENDATION
          NOT PREMIUM LOCKED
      ===================================================== */}

      <div style={styles.recommendation}>

        <div style={styles.recommendIcon}>
          🚀
        </div>

        <div>

          <h2 style={styles.recommendTitle}>
            AI Recommendation
          </h2>

          <p style={styles.recommendationText}>

            {recommendations.length > 0 ? (
              <>
                Based on your Skill Gap
                Analysis for{" "}
                <strong
                  style={styles.highlight}
                >
                  {targetRole ||
                    "your target role"}
                </strong>
                , focus on completing
                your recommended resources.
              </>
            ) : targetRole ? (
              <>
                Based on your{" "}
                <strong
                  style={styles.highlight}
                >
                  {targetRole}
                </strong>
                {" "}career goal, generate
                your personalized AI learning
                plan to identify the skills
                you should learn next.
              </>
            ) : (
              <>
                Complete your Skill Gap
                Analysis and generate a
                personalized learning plan.
              </>
            )}

          </p>

          {targetRole && (
            <button
              style={styles.aiRecommendationButton}
              onClick={() =>
                scrollToSection(
                  "ai-recommendations"
                )
              }
            >
              View AI Learning →
            </button>
          )}

        </div>

      </div>

      {/* =====================================================
          QUICK ACTION PANEL
      ===================================================== */}

      {activeQuickPanel && (
        <div
          style={styles.quickPanelOverlay}
          onClick={() =>
            setActiveQuickPanel("")
          }
        >

          <div
            style={styles.quickPanel}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              style={styles.panelClose}
              onClick={() =>
                setActiveQuickPanel("")
              }
            >
              ×
            </button>

            {activeQuickPanel ===
              "notifications" && (
              <>
                <div style={styles.panelIcon}>
                  🔔
                </div>

                <h2>
                  Learning Notifications
                </h2>

                <div style={styles.panelItem}>
                  📚 New premium courses
                  are available.
                </div>

                <div style={styles.panelItem}>
                  🤖 Your AI learning plan
                  is ready to explore.
                </div>

                <div style={styles.panelItem}>
                  🎯 Continue learning
                  toward your target role.
                </div>
              </>
            )}

            {activeQuickPanel ===
              "alerts" && (
              <>
                <div style={styles.panelIcon}>
                  ⚠️
                </div>

                <h2>
                  Learning Alerts
                </h2>

                <div style={styles.panelItem}>
                  🔐 Premium courses require
                  CareerPilot Pro.
                </div>

                <div style={styles.panelItem}>
                  🧠 Complete Skill Gap
                  Analysis for better
                  recommendations.
                </div>

                <div style={styles.panelItem}>
                  ⏰ Try to maintain a
                  consistent learning
                  schedule.
                </div>
              </>
            )}

            {activeQuickPanel ===
              "tips" && (
              <>
                <div style={styles.panelIcon}>
                  💡
                </div>

                <h2>
                  Learning Tips
                </h2>

                <div style={styles.panelItem}>
                  💡 Practice coding every
                  day.
                </div>

                <div style={styles.panelItem}>
                  🚀 Build real-world
                  projects.
                </div>

                <div style={styles.panelItem}>
                  🎤 Practice technical
                  interviews.
                </div>

                <div style={styles.panelItem}>
                  📄 Keep your resume
                  updated.
                </div>
              </>
            )}

          </div>

        </div>
      )}

      {/* =====================================================
          PREMIUM MODAL
      ===================================================== */}

      {showPremiumModal && (
        <div
          style={styles.modalOverlay}
          onClick={() =>
            setShowPremiumModal(false)
          }
        >

          <div
            style={styles.modal}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              style={styles.closeButton}
              onClick={() =>
                setShowPremiumModal(false)
              }
            >
              ×
            </button>

            <div style={styles.premiumModalIcon}>
              👑
            </div>

            <div style={styles.modalBadge}>
              PREMIUM COURSE
            </div>

            <h2 style={styles.modalTitle}>
              Upgrade to Pro
            </h2>

            <p style={styles.modalCourse}>
              {selectedCourse?.title}
            </p>

            <p style={styles.modalDescription}>
              This IT course is available
              only for CareerPilot Pro
              members.
            </p>

            <div style={styles.premiumFeatures}>

              <div>
                ✓ Access all premium IT courses
              </div>

              <div>
                ✓ Advanced learning resources
              </div>

              <div>
                ✓ Development, Cloud & DevOps
              </div>

              <div>
                ✓ AI & Data Science courses
              </div>

              <div>
                ✓ Cybersecurity & Mobile courses
              </div>

              <div>
                ✓ Career & interview preparation
              </div>

            </div>

            <button
              style={styles.upgradeButton}
              onClick={handleUpgrade}
            >
              Upgrade to Pro 🚀
            </button>

            <button
              style={styles.cancelButton}
              onClick={() =>
                setShowPremiumModal(false)
              }
            >
              Maybe Later
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "22px",
    boxSizing: "border-box",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
  },

  // ==========================================================
  // HEADER
  // ==========================================================

  header: {
    background: "#ffffff",
    padding: "24px 28px",
    borderRadius: "16px",
    marginBottom: "20px",
    boxShadow:
      "0 3px 14px rgba(15,23,42,0.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  headerTitle: {
    margin: "0 0 8px",
    fontSize: "27px",
    fontWeight: "800",
    color: "#111827",
  },

  headerDescription: {
    margin: 0,
    maxWidth: "760px",
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#64748b",
  },

  targetRole: {
    display: "inline-block",
    marginTop: "13px",
    padding: "7px 12px",
    background: "#eff6ff",
    color: "#2563eb",
    borderRadius: "8px",
    fontSize: "13px",
  },

  proStatus: {
    padding: "10px 16px",
    borderRadius: "25px",
    background:
      "linear-gradient(135deg,#fff7d6,#fef3a7)",
    color: "#92400e",
    fontWeight: "800",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },

  freeStatus: {
    padding: "10px 16px",
    borderRadius: "25px",
    background: "#f1f5f9",
    color: "#64748b",
    fontWeight: "700",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },

  // ==========================================================
  // ALERTS
  // ==========================================================

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "13px 17px",
    borderRadius: "10px",
    marginBottom: "18px",
    border: "1px solid #fecaca",
    fontSize: "14px",
  },

  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "13px 17px",
    borderRadius: "10px",
    marginBottom: "18px",
    border: "1px solid #bbf7d0",
    fontSize: "14px",
  },

  // ==========================================================
  // STAT CARDS
  // ==========================================================

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(210px,1fr))",
    gap: "16px",
    marginBottom: "20px",
  },

  card: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    minHeight: "95px",
    boxSizing: "border-box",
  },

  cardTitle: {
    margin: "0 0 5px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
  },

  cardNumber: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "800",
  },

  cardIconBlue: {
    width: "46px",
    height: "46px",
    borderRadius: "10px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
  },

  cardIconGreen: {
    width: "46px",
    height: "46px",
    borderRadius: "10px",
    background: "#f0fdf4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
  },

  cardIconYellow: {
    width: "46px",
    height: "46px",
    borderRadius: "10px",
    background: "#fffbeb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
  },

  cardIconRed: {
    width: "46px",
    height: "46px",
    borderRadius: "10px",
    background: "#fef2f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
  },

  // ==========================================================
  // AI GENERATE
  // ==========================================================

  generateBox: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "14px",
    marginBottom: "20px",
    border: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  generateContent: {
    flex: 1,
    minWidth: "250px",
  },

  generateTitle: {
    margin: "0 0 8px",
    fontSize: "19px",
    color: "#1e293b",
  },

  generateDescription: {
    margin: 0,
    fontSize: "13px",
    lineHeight: "1.6",
    color: "#64748b",
  },

  roleText: {
    margin: "10px 0 0",
    fontSize: "13px",
    color: "#475569",
  },

  warningText: {
    margin: "10px 0 0",
    fontSize: "13px",
    color: "#dc2626",
  },

  button: {
    padding: "11px 18px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "700",
    minWidth: "190px",
  },

  // ==========================================================
  // SECTION
  // ==========================================================

  section: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "14px",
    marginBottom: "20px",
    border: "1px solid #e5e7eb",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
    marginBottom: "18px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "19px",
    fontWeight: "750",
    color: "#1e293b",
  },

  sectionSubtitle: {
    margin: "6px 0 0",
    fontSize: "13px",
    color: "#64748b",
  },

  skillCount: {
    background: "#eff6ff",
    color: "#2563eb",
    padding: "6px 11px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  aiBadge: {
    background: "#ecfdf5",
    color: "#15803d",
    padding: "6px 11px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "800",
  },

  skillList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "9px",
  },

  skillBadge: {
    background: "#eff6ff",
    color: "#2563eb",
    border: "1px solid #dbeafe",
    padding: "8px 13px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },

  emptyText: {
    color: "#64748b",
    fontSize: "13px",
  },

  // ==========================================================
  // AI COURSE
  // ==========================================================

  courseGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(280px,1fr))",
    gap: "16px",
  },

  aiCourseCard: {
    padding: "18px",
    border: "1px solid #dbeafe",
    borderRadius: "12px",
    background:
      "linear-gradient(145deg,#ffffff,#f8fbff)",
  },

  courseHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "16px",
  },

  courseInfo: {
    display: "flex",
    gap: "10px",
    minWidth: 0,
  },

  courseIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "9px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    flexShrink: 0,
  },

  courseTitle: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "700",
    color: "#1e293b",
  },

  courseSkill: {
    display: "inline-block",
    marginTop: "6px",
    background: "#eff6ff",
    color: "#2563eb",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "10px",
    fontWeight: "600",
  },

  duration: {
    background: "#ffffff",
    color: "#64748b",
    padding: "5px 8px",
    borderRadius: "15px",
    fontSize: "10px",
    whiteSpace: "nowrap",
    border: "1px solid #e5e7eb",
  },

  courseDetails: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2,minmax(0,1fr))",
    gap: "10px",
  },

  detailBox: {
    background: "#ffffff",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #f1f5f9",
  },

  detailLabel: {
    display: "block",
    fontSize: "10px",
    color: "#94a3b8",
    marginBottom: "4px",
  },

  detailValue: {
    fontSize: "12px",
    color: "#334155",
  },

  link: {
    display: "inline-block",
    marginTop: "15px",
    color: "#2563eb",
    fontSize: "13px",
    fontWeight: "600",
    textDecoration: "none",
  },

  // ==========================================================
  // PREMIUM COURSES
  // ==========================================================

  learnSection: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "16px",
    marginBottom: "20px",
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 3px 14px rgba(15,23,42,0.05)",
  },

  learnSectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "18px",
    flexWrap: "wrap",
  },

  premiumHeadingRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },

  learnSectionTitle: {
    margin: 0,
    fontSize: "25px",
    fontWeight: "800",
    color: "#111827",
  },

  premiumLabel: {
    background:
      "linear-gradient(135deg,#fff7cc,#fde68a)",
    color: "#92400e",
    padding: "6px 10px",
    borderRadius: "15px",
    fontSize: "10px",
    fontWeight: "800",
  },

  learnSectionSubtitle: {
    margin: "5px 0 0",
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: "600",
  },

  exploreButton: {
    border: "none",
    background:
      "linear-gradient(135deg,#173bff,#2448ff)",
    color: "#ffffff",
    padding: "12px 18px",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  categoryRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "18px",
  },

  categoryButton: {
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#64748b",
    padding: "7px 13px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },

  activeCategory: {
    background: "#173bff",
    color: "#ffffff",
    border: "1px solid #173bff",
  },

  courseShowcase: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "16px",
  },

  showcaseCard: {
    position: "relative",
    minHeight: "245px",
    border: "1px solid #d8dfff",
    borderRadius: "12px",
    overflow: "hidden",
    background: "#ffffff",
    boxShadow:
      "0 3px 12px rgba(37,99,235,0.05)",
  },

  proBadge: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "#111827",
    color: "#ffffff",
    padding: "5px 8px",
    borderRadius: "5px",
    fontSize: "9px",
    fontWeight: "800",
  },

  showcaseIcon: {
    margin: "18px 15px 10px",
    width: "42px",
    height: "42px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eef2ff",
    fontSize: "21px",
  },

  showcaseTitle: {
    margin: "0 15px 5px",
    fontSize: "15px",
    color: "#373b7d",
    fontWeight: "700",
    lineHeight: "1.4",
  },

  showcaseDescription: {
    margin: "0 15px 10px",
    color: "#64748b",
    fontSize: "11px",
    lineHeight: "1.5",
    minHeight: "34px",
  },

  courseMetaRow: {
    display: "flex",
    gap: "10px",
    margin: "0 15px 8px",
    color: "#64748b",
    fontSize: "10px",
  },

  levelBadge: {
    display: "inline-block",
    margin: "0 15px 45px",
    background: "#f1f5f9",
    color: "#475569",
    padding: "4px 8px",
    borderRadius: "10px",
    fontSize: "9px",
    fontWeight: "700",
  },

  showcaseBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: "42px",
    background: "#eeeafd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  learnMorePremium: {
    border: "none",
    background: "#173bff",
    color: "#ffffff",
    fontSize: "11px",
    fontWeight: "700",
    padding: "11px 15px",
    cursor: "pointer",
  },

  favoriteButton: {
    border: "none",
    background: "transparent",
    fontSize: "21px",
    cursor: "pointer",
    paddingRight: "12px",
  },

  // ==========================================================
  // MY COURSES
  // ==========================================================

  myCourseGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  myCourseCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "13px",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    background: "#f8fafc",
  },

  myCourseIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "9px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  myCourseContent: {
    flex: 1,
  },

  myCourseTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },

  miniPro: {
    background: "#111827",
    color: "#ffffff",
    padding: "3px 6px",
    borderRadius: "4px",
    fontSize: "8px",
    fontWeight: "800",
  },

  openCourseButton: {
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    padding: "8px 14px",
    borderRadius: "7px",
    fontWeight: "700",
    cursor: "pointer",
  },

  noFavorites: {
    textAlign: "center",
    padding: "35px",
    color: "#64748b",
  },

  noFavoriteIcon: {
    fontSize: "40px",
    marginBottom: "8px",
  },

  // ==========================================================
  // LEARNING CURVE
  // ==========================================================

  dashboardGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0,2fr) minmax(280px,1fr)",
    gap: "20px",
    marginBottom: "20px",
  },

  learningCurve: {
    background: "#ffffff",
    padding: "25px 28px",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    minHeight: "330px",
    boxSizing: "border-box",
  },

  curveHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  curveTitle: {
    margin: 0,
    fontSize: "22px",
    color: "#373b7d",
  },

  curveSubtitle: {
    margin: "5px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
  },

  changeBox: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontSize: "11px",
    color: "#94a3b8",
  },

  chartArea: {
    height: "200px",
    marginTop: "25px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-around",
    gap: "8px",
    borderTop: "1px solid #eef2f7",
    padding: "20px 10px 0",
    boxSizing: "border-box",
    position: "relative",
  },

  chartBar: {
    width: "7%",
    minWidth: "12px",
    borderRadius: "8px 8px 0 0",
  },

  chartLine: {
    position: "absolute",
    left: "12%",
    right: "12%",
    top: "42%",
    height: "3px",
    background: "#173bff",
    transform: "rotate(-2deg)",
    opacity: 0.9,
    borderRadius: "5px",
  },

  monthRow: {
    display: "grid",
    gridTemplateColumns:
      "repeat(12,1fr)",
    marginTop: "10px",
    color: "#94a3b8",
    fontSize: "10px",
    textAlign: "center",
  },

  // ==========================================================
  // QUICK ACTIONS
  // ==========================================================

  quickActions: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3,1fr)",
    gap: "12px",
  },

  quickAction: {
    minHeight: "105px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    color: "#373b7d",
    cursor: "pointer",
    fontSize: "12px",
  },

  quickIcon: {
    fontSize: "22px",
    color: "#a1a1aa",
  },

  myCoursesButton: {
    gridColumn: "1 / -1",
    height: "52px",
    background: "#173bff",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    fontWeight: "800",
    fontSize: "15px",
    cursor: "pointer",
  },

  // ==========================================================
  // AI RECOMMENDATION
  // ==========================================================

  recommendation: {
    display: "flex",
    gap: "15px",
    alignItems: "flex-start",
    background: "#eef4ff",
    padding: "22px",
    borderRadius: "14px",
    marginBottom: "25px",
    border: "1px solid #dbeafe",
  },

  recommendIcon: {
    fontSize: "30px",
  },

  recommendTitle: {
    margin: 0,
    color: "#1e293b",
  },

  recommendationText: {
    margin: "8px 0 12px",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.7",
  },

  highlight: {
    color: "#2563eb",
  },

  aiRecommendationButton: {
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    padding: "9px 14px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "12px",
  },

  // ==========================================================
  // EMPTY
  // ==========================================================

  empty: {
    background: "#f8fafc",
    border: "1px dashed #cbd5e1",
    padding: "30px 20px",
    borderRadius: "10px",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "36px",
    marginBottom: "8px",
  },

  emptyTitle: {
    margin: "0 0 7px",
    color: "#334155",
    fontSize: "16px",
  },

  emptyDescription: {
    margin: "0 auto",
    maxWidth: "500px",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.6",
  },

  smallButton: {
    marginTop: "15px",
    padding: "9px 16px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },

  // ==========================================================
  // QUICK PANEL
  // ==========================================================

  quickPanelOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.55)",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "stretch",
    zIndex: 9998,
  },

  quickPanel: {
    position: "relative",
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    padding: "35px 28px",
    boxSizing: "border-box",
    boxShadow:
      "-10px 0 40px rgba(0,0,0,0.15)",
  },

  panelClose: {
    position: "absolute",
    right: "18px",
    top: "15px",
    width: "34px",
    height: "34px",
    border: "none",
    borderRadius: "50%",
    background: "#f1f5f9",
    color: "#475569",
    fontSize: "23px",
    cursor: "pointer",
  },

  panelIcon: {
    fontSize: "42px",
    marginBottom: "10px",
  },

  panelItem: {
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    padding: "15px",
    borderRadius: "10px",
    marginTop: "12px",
    color: "#334155",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  // ==========================================================
  // PREMIUM MODAL
  // ==========================================================

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.58)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 9999,
  },

  modal: {
    position: "relative",
    width: "100%",
    maxWidth: "470px",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "32px",
    textAlign: "center",
    boxShadow:
      "0 25px 70px rgba(0,0,0,0.25)",
    boxSizing: "border-box",
  },

  closeButton: {
    position: "absolute",
    right: "15px",
    top: "12px",
    width: "32px",
    height: "32px",
    border: "none",
    borderRadius: "50%",
    background: "#f1f5f9",
    color: "#475569",
    fontSize: "23px",
    cursor: "pointer",
  },

  premiumModalIcon: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    margin: "0 auto 14px",
    background:
      "linear-gradient(135deg,#fff7cc,#fde68a)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "35px",
  },

  modalBadge: {
    display: "inline-block",
    background: "#eef2ff",
    color: "#3730a3",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "800",
    marginBottom: "10px",
  },

  modalTitle: {
    margin: "0 0 7px",
    fontSize: "25px",
    color: "#111827",
  },

  modalCourse: {
    margin: "0 0 10px",
    color: "#2563eb",
    fontWeight: "700",
    fontSize: "14px",
  },

  modalDescription: {
    margin: "0 auto 18px",
    maxWidth: "350px",
    color: "#64748b",
    lineHeight: "1.6",
    fontSize: "13px",
  },

  premiumFeatures: {
    textAlign: "left",
    background: "#f8fafc",
    padding: "15px 18px",
    borderRadius: "10px",
    color: "#334155",
    lineHeight: "2",
    fontSize: "13px",
    marginBottom: "20px",
  },

  upgradeButton: {
    width: "100%",
    padding: "13px",
    border: "none",
    borderRadius: "9px",
    background:
      "linear-gradient(135deg,#173bff,#3155ff)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
  },

  cancelButton: {
    width: "100%",
    padding: "11px",
    marginTop: "8px",
    border: "none",
    background: "transparent",
    color: "#64748b",
    fontWeight: "600",
    cursor: "pointer",
  },

  // ==========================================================
  // LOADING
  // ==========================================================

  loadingBox: {
    background: "#ffffff",
    padding: "60px 30px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow:
      "0 3px 14px rgba(15,23,42,0.06)",
  },

  loadingIcon: {
    fontSize: "42px",
    marginBottom: "14px",
  },

  loadingTitle: {
    margin: "0 0 8px",
    color: "#1e293b",
    fontSize: "21px",
  },

  loadingText: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },
};