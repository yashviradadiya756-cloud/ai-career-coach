import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

import {
  getLearning,
  generateLearning,
} from "../../api/learningApi";

import { getLatestSkillGap } from "../../api/skillGapApi";

export default function Learning() {
  // =========================================================
  // BACKEND STATE
  // =========================================================

  const [learning, setLearning] = useState(null);
  const [skillGap, setSkillGap] = useState(null);
  const [adminCourses, setAdminCourses] = useState([]); // 🌟 LIVE COURSES FROM ADMIN

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =========================================================
  // UI STATE
  // =========================================================

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [activeQuickPanel, setActiveQuickPanel] = useState("");

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
  // LIVE ADMIN COURSES (REPLACED HARDCODED CATALOG)
  // =========================================================

  const allCourses = useMemo(() => {
  return adminCourses.map((c, index) => ({
    id: c._id || `course-${index}`,
    title: c.title,
    category: c.category || "Development",
    icon: c.type === "Video Course" ? "🎥" : c.type === "Project" ? "💻" : "📚",
    description: c.description || `Curated course by instructors.`,
    videos: c.duration || "Self-Paced",
    level: c.level || "Beginner",
    duration: c.duration || "Self-Paced",
    premium: false,
    url: c.url,
    provider: c.provider || "Online",
    skills: Array.isArray(c.skills) ? c.skills : [],
  }));
}, [adminCourses]);

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
  // LOAD DATA FROM BACKEND
  // =========================================================

  useEffect(() => {
    loadLearningData();

    const savedFavorites = localStorage.getItem("learningFavorites");

    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  const loadLearningData = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      let latestSkillGap = null;
      let existingLearning = null;

      // -----------------------------------------------------
      // 1. FETCH LIVE ADMIN-CREATED COURSES
      // -----------------------------------------------------
      try {
  const courseRes = await api.get("/api/courses");

  console.log("========== USER COURSES RESPONSE ==========");
  console.log(courseRes.data);

  if (courseRes.data?.success) {
    setAdminCourses(courseRes.data.courses || []);
  } else {
    setAdminCourses([]);
  }
} catch (err) {
  console.error(
    "Fetch courses error:",
    err.response?.data || err.message
  );

  setAdminCourses([]);
}

      // -----------------------------------------------------
      // 2. SKILL GAP API FIRST
      // -----------------------------------------------------
      try {
        const response = await getLatestSkillGap();
        const payload = response?.data ?? response;

        if (payload?.success && payload?.skillGap) {
          latestSkillGap = payload.skillGap;
          setSkillGap(latestSkillGap);
        } else {
          setSkillGap(null);
        }
      } catch (err) {
        console.error("Skill Gap API Error:", err.response?.data || err.message);
        setSkillGap(null);
      }

      // -----------------------------------------------------
      // 3. LEARNING API
      // -----------------------------------------------------
      try {
        const response = await getLearning();
        const payload = response?.data ?? response;

        if (payload?.success && payload?.learning) {
          existingLearning = payload.learning;
          setLearning(existingLearning);
        } else {
          existingLearning = null;
          setLearning(null);
        }
      } catch (err) {
        console.error("Learning API Error:", err.response?.data || err.message);
        existingLearning = null;
        setLearning(null);
      }

      // -----------------------------------------------------
      // 4. AUTO GENERATE LEARNING PLAN
      // -----------------------------------------------------
      if (latestSkillGap && !existingLearning) {
        const role = latestSkillGap?.targetRole;
        const missing = Array.isArray(latestSkillGap?.missingSkills)
          ? latestSkillGap.missingSkills
          : [];

        if (role && missing.length > 0) {
          try {
            setGenerating(true);
            const generatedResponse = await generateLearning(role);
            const generatedPayload = generatedResponse?.data ?? generatedResponse;

            if (generatedPayload?.success && generatedPayload?.learning) {
              setLearning(generatedPayload.learning);
              setMessage("AI Learning Plan generated successfully!");
            }
          } catch (err) {
            console.error("Auto Generate Error:", err.response?.data || err.message);
          } finally {
            setGenerating(false);
          }
        }
      }
    } catch (err) {
      console.error("Learning Error:", err);
      setError("Failed to load learning dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const targetRole = learning?.targetRole || skillGap?.targetRole || "";
  const missingSkills = Array.isArray(skillGap?.missingSkills) ? skillGap.missingSkills : [];
  const recommendations = Array.isArray(learning?.recommendations) ? learning.recommendations : [];

  // =========================================================
  // FILTER COURSES (FLEXIBLE MATCHING FOR ADMIN CATEGORIES)
  // =========================================================

 const filteredCourses = useMemo(() => {
  if (selectedCategory === "All") return allCourses;

  return allCourses.filter((course) => {
    const cCat = (course.category || "").toLowerCase().trim();
    const sCat = selectedCategory.toLowerCase().trim();
    return cCat === sCat || cCat.includes(sCat) || sCat.includes(cCat);
  });
}, [allCourses, selectedCategory]);

  // Favorite Courses
  const favoriteCourses = allCourses.filter((course) => favorites.includes(course.id));

  // =========================================================
  // GENERATE AI LEARNING PLAN
  // =========================================================

  const handleGenerateLearning = async () => {
    try {
      setGenerating(true);
      setError("");
      setMessage("");

      const role = learning?.targetRole || skillGap?.targetRole;

      if (!role) {
        setError("Please complete Skill Gap Analysis first.");
        return;
      }

      if (missingSkills.length === 0) {
        setError("No missing skills found in your Skill Gap Analysis.");
        return;
      }

      const response = await generateLearning(role);
      const payload = response?.data ?? response;

      if (payload?.success && payload?.learning) {
        setLearning(payload.learning);
        setMessage("AI Learning Plan generated successfully!");
      } else {
        setError(payload?.message || "Failed to generate learning plan.");
      }
    } catch (err) {
      console.error("Generate Learning Error:", err);
      setError(err.response?.data?.message || "Failed to generate learning plan.");
    } finally {
      setGenerating(false);
    }
  };

  // =========================================================
  // COURSE CLICK (DIRECT OPEN)
  // =========================================================

  const handleCourseClick = (course) => {
    if (!course?.url) return;
    window.open(course.url, "_blank", "noopener,noreferrer");
  };

  // =========================================================
  // FAVORITE
  // =========================================================

  const toggleFavorite = (courseId) => {
    setFavorites((previous) => {
      let updated;

      if (previous.includes(courseId)) {
        updated = previous.filter((id) => id !== courseId);
      } else {
        updated = [...previous, courseId];
      }

      localStorage.setItem("learningFavorites", JSON.stringify(updated));
      return updated;
    });
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleUpgrade = () => {
    setShowPremiumModal(false);
    window.location.href = "/pricing";
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <div style={styles.loadingIcon}>📚</div>
          <h2 style={styles.loadingTitle}>Loading Learning Center...</h2>
          <p style={styles.loadingText}>Preparing your personalized learning dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>📚 Learning Center</h1>
          <p style={styles.headerDescription}>
            Learn new IT skills, explore curated courses from instructors, and track your AI career roadmap.
          </p>
          {targetRole && (
            <span style={styles.targetRole}>
              🎯 Target Role: <strong>{targetRole}</strong>
            </span>
          )}
        </div>

        <div style={isPremiumUser ? styles.proStatus : styles.freeStatus}>
          {isPremiumUser ? "👑 PRO MEMBER" : "FREE PLAN"}
        </div>
      </div>

      {/* ALERTS */}
      {error && <div style={styles.error}>⚠️ {error}</div>}
      {message && <div style={styles.success}>✅ {message}</div>}

      {/* STATS */}
      <div style={styles.cards}>
        <div style={styles.card}>
          <div style={styles.cardIconBlue}>🧠</div>
          <div>
            <h3 style={styles.cardTitle}>Recommended Skills</h3>
            <h1 style={{ ...styles.cardNumber, color: "#2563eb" }}>{missingSkills.length}</h1>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIconGreen}>📚</div>
          <div>
            <h3 style={styles.cardTitle}>Total Courses</h3>
            <h1 style={{ ...styles.cardNumber, color: "#16a34a" }}>{allCourses.length}</h1>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIconYellow}>⭐</div>
          <div>
            <h3 style={styles.cardTitle}>Favorites</h3>
            <h1 style={{ ...styles.cardNumber, color: "#f59e0b" }}>{favorites.length}</h1>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIconRed}>👑</div>
          <div>
            <h3 style={styles.cardTitle}>Access</h3>
            <h1 style={{ ...styles.cardNumber, color: isPremiumUser ? "#16a34a" : "#dc2626" }}>
              {isPremiumUser ? "PRO" : "FREE"}
            </h1>
          </div>
        </div>
      </div>

      {/* AI LEARNING PLAN */}
      <div style={styles.generateBox}>
        <div style={styles.generateContent}>
          <h2 style={styles.generateTitle}>🤖 AI Learning Plan</h2>
          <p style={styles.generateDescription}>
            Generate personalized learning resources based on your Skill Gap Analysis.
          </p>
          {targetRole ? (
            <p style={styles.roleText}>
              <strong>Target Role:</strong> {targetRole}
            </p>
          ) : (
            <p style={styles.warningText}>⚠️ Please complete Skill Gap Analysis first.</p>
          )}
        </div>

        <button
          onClick={handleGenerateLearning}
          disabled={generating || !targetRole || missingSkills.length === 0}
          style={{
            ...styles.button,
            opacity: generating || !targetRole || missingSkills.length === 0 ? 0.6 : 1,
            cursor:
              generating || !targetRole || missingSkills.length === 0
                ? "not-allowed"
                : "pointer",
          }}
        >
          {generating ? "Generating..." : "Generate Learning Plan"}
        </button>
      </div>

      {/* SKILLS YOU NEED */}
      {skillGap && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>🧩 Skills You Need to Learn</h2>
              <p style={styles.sectionSubtitle}>Based on your latest Skill Gap Analysis.</p>
            </div>
            <span style={styles.skillCount}>{missingSkills.length} skills</span>
          </div>

          {missingSkills.length > 0 ? (
            <div style={styles.skillList}>
              {missingSkills.map((skill, index) => (
                <span key={index} style={styles.skillBadge}>
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p style={styles.emptyText}>No missing skills were found.</p>
          )}
        </div>
      )}

      {/* AI RECOMMENDED COURSES */}
      <div id="ai-recommendations" style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>🤖 AI Recommended Learning</h2>
            <p style={styles.sectionSubtitle}>
              Personalized resources based on your Skill Gap Analysis.
            </p>
          </div>
          <span style={styles.aiBadge}>AI POWERED</span>
        </div>

        {recommendations.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🤖</div>
            <h3 style={styles.emptyTitle}>No AI recommendations yet</h3>
            <p style={styles.emptyDescription}>
              Complete your Skill Gap Analysis and generate your personalized AI learning plan.
            </p>
            {targetRole && (
              <button
                onClick={handleGenerateLearning}
                disabled={generating}
                style={styles.smallButton}
              >
                {generating ? "Generating..." : "Generate AI Plan"}
              </button>
            )}
          </div>
        ) : (
          <div style={styles.courseGrid}>
            {recommendations.map((item, index) => (
              <div key={index} style={styles.aiCourseCard}>
                <div style={styles.courseHeader}>
                  <div style={styles.courseInfo}>
                    <div style={styles.courseIcon}>🤖</div>
                    <div>
                      <h3 style={styles.courseTitle}>{item.course || "AI Recommended Course"}</h3>
                      {item.skill && <span style={styles.courseSkill}>{item.skill}</span>}
                    </div>
                  </div>
                  {item.duration && <span style={styles.duration}>⏱ {item.duration}</span>}
                </div>

                <div style={styles.courseDetails}>
                  <div style={styles.detailBox}>
                    <span style={styles.detailLabel}>Platform</span>
                    <strong style={styles.detailValue}>{item.platform || "Online"}</strong>
                  </div>
                  <div style={styles.detailBox}>
                    <span style={styles.detailLabel}>Level</span>
                    <strong style={styles.detailValue}>{item.level || "Beginner"}</strong>
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
            ))}
          </div>
        )}
      </div>

      {/* 🌟 LIVE INSTRUCTOR COURSES SECTION */}
      <section id="premium-courses" style={styles.learnSection}>
        <div style={styles.learnSectionHeader}>
          <div>
            <div style={styles.premiumHeadingRow}>
              <h2 style={styles.learnSectionTitle}>Instructor Courses</h2>
              <span style={styles.premiumLabel}>🌟 CURATED</span>
            </div>
            <p style={styles.learnSectionSubtitle}>
              Browse learning resources uploaded by instructors and mentors.
            </p>
          </div>

          <button
            style={styles.exploreButton}
            onClick={() => scrollToSection("premium-courses")}
          >
            + Explore More
          </button>
        </div>

        {/* CATEGORY FILTER */}
        <div style={styles.categoryRow}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                ...styles.categoryButton,
                ...(selectedCategory === category ? styles.activeCategory : {}),
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* COURSE CARDS */}
        {filteredCourses.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>📚</div>
            <h3 style={styles.emptyTitle}>No courses found</h3>
            <p style={styles.emptyDescription}>
              {adminCourses.length === 0
                ? "No courses have been published by the admin yet."
                : "No courses found in this category. Try choosing 'All'."}
            </p>
          </div>
        ) : (
          <div style={styles.courseShowcase}>
            {filteredCourses.map((course) => {
              const favorite = favorites.includes(course.id);

              return (
                <div key={course.id} style={styles.showcaseCard}>
                  <div style={styles.adminBadge}>🌟 CURATED</div>
                  <div style={styles.showcaseIcon}>{course.icon}</div>
                  <h3 style={styles.showcaseTitle}>{course.title}</h3>
                  <p style={styles.showcaseDescription}>{course.description}</p>

                  <div style={styles.courseMetaRow}>
                    <span>🌐 {course.provider}</span>
                    <span>⏱ {course.duration}</span>
                  </div>

                  <div style={styles.levelBadge}>{course.level}</div>

                  <div style={styles.showcaseBottom}>
                    <button
                      onClick={() => handleCourseClick(course)}
                      style={styles.learnMoreFree}
                    >
                      🚀 Start Learning
                    </button>

                    <button
                      onClick={() => toggleFavorite(course.id)}
                      style={{
                        ...styles.favoriteButton,
                        color: favorite ? "#f59e0b" : "#64748b",
                      }}
                      title={favorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      {favorite ? "★" : "☆"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* MY COURSES */}
      <section id="my-courses" style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>📚 My Saved Courses</h2>
            <p style={styles.sectionSubtitle}>Your favorite courses are saved here for quick access.</p>
          </div>
          <span style={styles.skillCount}>{favoriteCourses.length} SAVED</span>
        </div>

        {favoriteCourses.length === 0 ? (
          <div style={styles.noFavorites}>
            <div style={styles.noFavoriteIcon}>⭐</div>
            <h3>No favorite courses yet</h3>
            <p>Click the ☆ icon on any course to save it here.</p>
            <button
              style={styles.smallButton}
              onClick={() => scrollToSection("premium-courses")}
            >
              Explore Courses
            </button>
          </div>
        ) : (
          <div style={styles.myCourseGrid}>
            {favoriteCourses.map((course) => (
              <div key={course.id} style={styles.myCourseCard}>
                <div style={styles.myCourseIcon}>{course.icon}</div>
                <div style={styles.myCourseContent}>
                  <div style={styles.myCourseTitleRow}>
                    <h3>{course.title}</h3>
                    <span style={styles.miniCurated}>CURATED</span>
                  </div>
                  <p>
                    {course.category} • {course.duration}
                  </p>
                </div>

                <button
                  style={styles.openCourseButton}
                  onClick={() => handleCourseClick(course)}
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
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
  header: {
    background: "#ffffff",
    padding: "24px 28px",
    borderRadius: "16px",
    marginBottom: "20px",
    boxShadow: "0 3px 14px rgba(15,23,42,0.06)",
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
    background: "linear-gradient(135deg,#fff7d6,#fef3a7)",
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
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
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
  courseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
    gap: "16px",
  },
  aiCourseCard: {
    padding: "18px",
    border: "1px solid #dbeafe",
    borderRadius: "12px",
    background: "linear-gradient(145deg,#ffffff,#f8fbff)",
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
    gridTemplateColumns: "repeat(2,minmax(0,1fr))",
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
  learnSection: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "16px",
    marginBottom: "20px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 3px 14px rgba(15,23,42,0.05)",
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
    background: "linear-gradient(135deg,#e0e7ff,#c7d2fe)",
    color: "#3730a3",
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
    background: "linear-gradient(135deg,#173bff,#2448ff)",
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
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "16px",
  },
  showcaseCard: {
    position: "relative",
    minHeight: "245px",
    border: "1px solid #d8dfff",
    borderRadius: "12px",
    overflow: "hidden",
    background: "#ffffff",
    boxShadow: "0 3px 12px rgba(37,99,235,0.05)",
  },
  adminBadge: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "#4f46e5",
    color: "#ffffff",
    padding: "4px 8px",
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
  learnMoreFree: {
    border: "none",
    background: "#4f46e5",
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
  miniCurated: {
    background: "#4f46e5",
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
  loadingBox: {
    background: "#ffffff",
    padding: "60px 30px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 3px 14px rgba(15,23,42,0.06)",
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