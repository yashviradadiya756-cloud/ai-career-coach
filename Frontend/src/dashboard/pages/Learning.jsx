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
  const [adminCourses, setAdminCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =========================================================
  // UI STATE
  // =========================================================

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const [favorites, setFavorites] = useState([]);

  // =========================================================
  // PREMIUM USER CHECK
  // =========================================================

  const isPremiumUser = useMemo(() => {
    try {
      const storedUser =
        localStorage.getItem("user") ||
        localStorage.getItem("currentUser");

      if (!storedUser) return false;

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
  // ADMIN COURSES -> FRONTEND FORMAT
  // =========================================================

  const allCourses = useMemo(() => {
    return adminCourses.map((course, index) => ({
      id: course._id || `course-${index}`,

      title: course.title || "Untitled Course",

      category: course.category || "Development",

      icon:
        course.type === "Video Course"
          ? "🎥"
          : course.type === "Project"
          ? "💻"
          : "📚",

      description:
        course.description ||
        "Premium course curated by CareerPilot instructors.",

      duration: course.duration || "Self-Paced",

      level: course.level || "Beginner",

      premium:
        course.isPremium !== undefined
          ? Boolean(course.isPremium)
          : true,

      isPremium:
        course.isPremium !== undefined
          ? Boolean(course.isPremium)
          : true,

      url: course.url || "",

      provider: course.provider || "CareerPilot",

      skills: Array.isArray(course.skills)
        ? course.skills
        : [],
    }));
  }, [adminCourses]);

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
  // LOAD LEARNING DATA
  // =========================================================

  const loadLearningData = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      let latestSkillGap = null;
      let existingLearning = null;

      // -------------------------------------------------------
      // 1. ADMIN COURSES
      // -------------------------------------------------------

      try {
        const courseRes = await api.get("/api/courses");

        console.log(
          "========== USER COURSES RESPONSE =========="
        );

        console.log(courseRes.data);

        if (courseRes.data?.success) {
          setAdminCourses(
            Array.isArray(courseRes.data.courses)
              ? courseRes.data.courses
              : []
          );
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

      // -------------------------------------------------------
      // 2. SKILL GAP
      // -------------------------------------------------------

      try {
        const response = await getLatestSkillGap();

        const payload = response?.data ?? response;

        if (
          payload?.success &&
          payload?.skillGap
        ) {
          latestSkillGap = payload.skillGap;

          setSkillGap(latestSkillGap);
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

      // -------------------------------------------------------
      // 3. EXISTING LEARNING
      // -------------------------------------------------------

      try {
        const response = await getLearning();

        const payload = response?.data ?? response;

        if (
          payload?.success &&
          payload?.learning
        ) {
          existingLearning = payload.learning;

          setLearning(existingLearning);
        } else {
          existingLearning = null;

          setLearning(null);
        }
      } catch (err) {
        console.error(
          "Learning API Error:",
          err.response?.data || err.message
        );

        existingLearning = null;

        setLearning(null);
      }

      // -------------------------------------------------------
      // 4. AUTO GENERATE
      // -------------------------------------------------------

      if (
        latestSkillGap &&
        !existingLearning
      ) {
        const role =
          latestSkillGap?.targetRole;

        const missing =
          Array.isArray(
            latestSkillGap?.missingSkills
          )
            ? latestSkillGap.missingSkills
            : [];

        if (
          role &&
          missing.length > 0
        ) {
          try {
            setGenerating(true);

            const generatedResponse =
              await generateLearning(role);

            const generatedPayload =
              generatedResponse?.data ??
              generatedResponse;

            if (
              generatedPayload?.success &&
              generatedPayload?.learning
            ) {
              setLearning(
                generatedPayload.learning
              );

              setMessage(
                "AI Learning Plan generated successfully!"
              );
            }
          } catch (err) {
            console.error(
              "Auto Generate Error:",
              err.response?.data ||
                err.message
            );
          } finally {
            setGenerating(false);
          }
        }
      }
    } catch (err) {
      console.error(
        "Learning Error:",
        err
      );

      setError(
        "Failed to load learning dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DERIVED DATA
  // =========================================================

  const targetRole =
    learning?.targetRole ||
    skillGap?.targetRole ||
    "";

  const missingSkills =
    Array.isArray(skillGap?.missingSkills)
      ? skillGap.missingSkills
      : [];

  const recommendations =
    Array.isArray(
      learning?.recommendations
    )
      ? learning.recommendations
      : [];

  // =========================================================
  // FILTER COURSES
  // =========================================================

  const filteredCourses = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    return allCourses.filter((course) => {
      const categoryMatch =
        selectedCategory === "All" ||
        (course.category || "")
          .toLowerCase()
          .includes(
            selectedCategory
              .toLowerCase()
          );

      const searchMatch =
        !search ||
        course.title
          .toLowerCase()
          .includes(search) ||
        course.description
          .toLowerCase()
          .includes(search) ||
        course.provider
          .toLowerCase()
          .includes(search) ||
        course.skills.some((skill) =>
          String(skill)
            .toLowerCase()
            .includes(search)
        );

      return (
        categoryMatch &&
        searchMatch
      );
    });
  }, [
    allCourses,
    selectedCategory,
    searchTerm,
  ]);

  const favoriteCourses =
    allCourses.filter((course) =>
      favorites.includes(course.id)
    );

  // =========================================================
  // GENERATE LEARNING PLAN
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

        const payload =
          response?.data ?? response;

        if (
          payload?.success &&
          payload?.learning
        ) {
          setLearning(
            payload.learning
          );

          setMessage(
            "AI Learning Plan generated successfully!"
          );
        } else {
          setError(
            payload?.message ||
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

  const handleCourseClick = (
    course
  ) => {
    if (!course) return;

    const locked =
      (course.premium ||
        course.isPremium) &&
      !isPremiumUser;

    if (locked) {
      setSelectedCourse(course);
      setShowPremiumModal(true);
      return;
    }

    if (!course.url) {
      setError(
        "Course link is not available."
      );
      return;
    }

    window.open(
      course.url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =========================================================
  // FAVORITES
  // =========================================================

  const toggleFavorite = (
    courseId
  ) => {
    setFavorites((previous) => {
      let updated;

      if (
        previous.includes(courseId)
      ) {
        updated =
          previous.filter(
            (id) =>
              id !== courseId
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
  // SCROLL
  // =========================================================

  const scrollToSection = (
    id
  ) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  // =========================================================
  // UPGRADE
  // =========================================================

  const handleUpgrade = () => {
    setShowPremiumModal(false);
    setSelectedCourse(null);

    window.location.href =
      "/pricing";
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingSpinner}>
            📚
          </div>

          <h2>
            Preparing your Learning Center
          </h2>

          <p>
            Loading courses, skill gaps
            and personalized resources...
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
          HERO
      ===================================================== */}

      <section style={styles.hero}>

        <div style={styles.heroLeft}>

          <div style={styles.heroBadge}>
            ✨ AI POWERED LEARNING
          </div>

          <h1 style={styles.heroTitle}>
            Learn skills that move
            your career forward.
          </h1>

          <p style={styles.heroDescription}>
            Build the right skills with
            AI-powered recommendations,
            instructor courses and
            personalized learning resources.
          </p>

          {targetRole && (
            <div style={styles.rolePill}>
              🎯 Preparing for
              <strong>
                {targetRole}
              </strong>
            </div>
          )}

          <div style={styles.heroActions}>

            <button
              style={styles.primaryButton}
              onClick={() =>
                scrollToSection(
                  "instructor-courses"
                )
              }
            >
              🚀 Explore Courses
            </button>

            <button
              style={styles.secondaryButton}
              onClick={() =>
                scrollToSection(
                  "ai-learning"
                )
              }
            >
              🤖 AI Learning Plan
            </button>

          </div>

        </div>

        <div style={styles.heroRight}>

          <div style={styles.heroOrb}>
            📚
          </div>

          {/* <div style={styles.floatingCard}>
            <span>Skills to Learn</span>
            <strong>
              {missingSkills.length}
            </strong>
          </div> */}

          {/* <div
            style={{
              ...styles.floatingCard,
              right: "-15px",
              bottom: "15px",
            }}
          >
            <span>Courses Available</span>
            <strong>
              {allCourses.length}
            </strong>
          </div> */}

        </div>

      </section>

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

      <section style={styles.statsGrid}>

        <StatCard
          icon="🧠"
          title="Skills to Learn"
          value={missingSkills.length}
          description="From your skill gap"
          iconBackground="#eff6ff"
          valueColor="#2563eb"
        />

        <StatCard
          icon="📚"
          title="Available Courses"
          value={allCourses.length}
          description="Instructor resources"
          iconBackground="#ecfdf5"
          valueColor="#16a34a"
        />

        <StatCard
          icon="⭐"
          title="Saved Courses"
          value={favorites.length}
          description="Your favorites"
          iconBackground="#fffbeb"
          valueColor="#f59e0b"
        />

        <StatCard
          icon={isPremiumUser ? "👑" : "🔓"}
          title="Membership"
          value={
            isPremiumUser
              ? "PRO"
              : "FREE"
          }
          description={
            isPremiumUser
              ? "Full access"
              : "Upgrade for more"
          }
          iconBackground={
            isPremiumUser
              ? "#fef3c7"
              : "#f1f5f9"
          }
          valueColor={
            isPremiumUser
              ? "#d97706"
              : "#64748b"
          }
        />

      </section>

      {/* =====================================================
          SKILLS
      ===================================================== */}

      {skillGap && (
        <section style={styles.whiteSection}>

          <div style={styles.sectionHeader}>

            <div>
              <span style={styles.sectionEyebrow}>
                YOUR SKILL GAP
              </span>

              <h2 style={styles.sectionTitle}>
                Skills you need to learn
              </h2>

              <p style={styles.sectionSubtitle}>
                These skills were identified
                from your latest analysis.
              </p>
            </div>

            <div style={styles.countBadge}>
              {missingSkills.length}
              {" "}
              Skills
            </div>

          </div>

          {missingSkills.length > 0 ? (
            <div style={styles.skillGrid}>
              {missingSkills.map(
                (skill, index) => (
                  <div
                    key={index}
                    style={styles.skillItem}
                  >
                    <span>
                      ✓
                    </span>

                    {skill}
                  </div>
                )
              )}
            </div>
          ) : (
            <div style={styles.emptySmall}>
              🎉 No missing skills found.
            </div>
          )}

        </section>
      )}

      {/* =====================================================
          AI LEARNING
      ===================================================== */}

      <section
        id="ai-learning"
        style={styles.aiSection}
      >

        <div style={styles.aiHeader}>

          <div>
            <div style={styles.aiTitleRow}>
              <span style={styles.aiIcon}>
                🤖
              </span>

              <div>
                <span style={styles.aiLabel}>
                  AI CAREER COACH
                </span>

                <h2 style={styles.sectionTitle}>
                  Personalized Learning Plan
                </h2>
              </div>
            </div>

            <p style={styles.sectionSubtitle}>
              AI recommendations based on
              your target role and skill gaps.
            </p>
          </div>

          <button
            onClick={
              handleGenerateLearning
            }
            disabled={
              generating ||
              !targetRole ||
              missingSkills.length === 0
            }
            style={{
              ...styles.aiGenerateButton,
              opacity:
                generating ||
                !targetRole ||
                missingSkills.length === 0
                  ? 0.5
                  : 1,
            }}
          >
            {generating
              ? "Generating..."
              : "✨ Generate Plan"}
          </button>

        </div>

        {recommendations.length ===
        0 ? (
          <div style={styles.aiEmpty}>

            <div style={styles.aiEmptyIcon}>
              🤖
            </div>

            <h3>
              Your AI learning plan
              is waiting
            </h3>

            <p>
              Complete your Skill Gap
              Analysis and generate a
              personalized learning plan.
            </p>

            {targetRole && (
              <button
                onClick={
                  handleGenerateLearning
                }
                disabled={generating}
                style={styles.primaryButton}
              >
                {generating
                  ? "Generating..."
                  : "Generate AI Plan"}
              </button>
            )}

          </div>
        ) : (
          <div style={styles.recommendationGrid}>

            {recommendations.map(
              (item, index) => (
                <div
                  key={index}
                  style={styles.recommendationCard}
                >

                  <div style={styles.recommendationTop}>

                    <div style={styles.recommendationIcon}>
                      🤖
                    </div>

                    <div style={{ flex: 1 }}>

                      <h3
                        style={
                          styles.recommendationTitle
                        }
                      >
                        {item.course ||
                          "AI Recommended Course"}
                      </h3>

                      {item.skill && (
                        <span
                          style={
                            styles.skillTag
                          }
                        >
                          {item.skill}
                        </span>
                      )}

                    </div>

                  </div>

                  <div
                    style={
                      styles.recommendationMeta
                    }
                  >
                    <span>
                      🌐{" "}
                      {item.platform ||
                        "Online"}
                    </span>

                    <span>
                      ⏱{" "}
                      {item.duration ||
                        "Self-Paced"}
                    </span>

                    <span>
                      📊{" "}
                      {item.level ||
                        "Beginner"}
                    </span>
                  </div>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.resourceButton}
                    >
                      View Resource →
                    </a>
                  )}

                </div>
              )
            )}

          </div>
        )}

      </section>

      {/* =====================================================
          INSTRUCTOR COURSES
      ===================================================== */}

      <section
        id="instructor-courses"
        style={styles.whiteSection}
      >

        <div style={styles.sectionHeader}>

          <div>

            <div style={styles.headingWithBadge}>

              <h2 style={styles.sectionTitle}>
                Instructor Courses
              </h2>

              <span style={styles.curatedBadge}>
                🌟 CURATED
              </span>

            </div>

            <p style={styles.sectionSubtitle}>
              Courses uploaded by CareerPilot
              instructors and mentors.
            </p>

          </div>

          <div style={styles.courseTotal}>
            {filteredCourses.length}
            {" "}
            Courses
          </div>

        </div>

        {/* SEARCH */}

        <div style={styles.searchBar}>

          <span style={styles.searchIcon}>
            🔎
          </span>

          <input
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            placeholder="Search courses, skills or providers..."
            style={styles.searchInput}
          />

          {searchTerm && (
            <button
              onClick={() =>
                setSearchTerm("")
              }
              style={styles.clearSearch}
            >
              ×
            </button>
          )}

        </div>

        {/* CATEGORY */}

        <div style={styles.categoryRow}>

          {categories.map(
            (category) => (
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
            )
          )}

        </div>

        {/* COURSE GRID */}

        {filteredCourses.length === 0 ? (
          <div style={styles.noCourses}>

            <div style={styles.noCoursesIcon}>
              📚
            </div>

            <h3>
              No courses found
            </h3>

            <p>
              Try another category
              or search keyword.
            </p>

            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory(
                  "All"
                );
              }}
              style={styles.primaryButton}
            >
              Clear Filters
            </button>

          </div>
        ) : (
          <div style={styles.courseGrid}>

            {filteredCourses.map(
              (course) => {

                const favorite =
                  favorites.includes(
                    course.id
                  );

                const locked =
                  (course.premium ||
                    course.isPremium) &&
                  !isPremiumUser;

                return (
                  <article
                    key={course.id}
                    style={{
                      ...styles.courseCard,
                      ...(locked
                        ? styles.lockedCard
                        : {}),
                    }}
                  >

                    {/* TOP */}

                    <div
                      style={
                        styles.courseCardTop
                      }
                    >

                      <div
                        style={
                          styles.courseCardIcon
                        }
                      >
                        {course.icon}
                      </div>

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
                            : "#94a3b8",
                        }}
                        title={
                          favorite
                            ? "Remove favorite"
                            : "Add favorite"
                        }
                      >
                        {favorite
                          ? "★"
                          : "☆"}
                      </button>

                    </div>

                    {/* BADGE */}

                    <div style={styles.courseBadge}>
                      {locked
                        ? "🔒 PRO"
                        : "✓ AVAILABLE"}
                    </div>

                    {/* CONTENT */}

                    <h3
                      style={
                        styles.courseCardTitle
                      }
                    >
                      {course.title}
                    </h3>

                    <p
                      style={
                        styles.courseCardDescription
                      }
                    >
                      {course.description}
                    </p>

                    {/* META */}

                    <div
                      style={
                        styles.courseInformation
                      }
                    >

                      <span>
                        🌐{" "}
                        {course.provider}
                      </span>

                      <span>
                        ⏱{" "}
                        {course.duration}
                      </span>

                      <span>
                        📈{" "}
                        {course.level}
                      </span>

                    </div>

                    {/* SKILLS */}

                    {course.skills.length >
                      0 && (
                      <div
                        style={
                          styles.courseSkills
                        }
                      >
                        {course.skills
                          .slice(0, 3)
                          .map(
                            (
                              skill,
                              index
                            ) => (
                              <span
                                key={index}
                              >
                                {skill}
                              </span>
                            )
                          )}
                      </div>
                    )}

                    {/* LOCK */}

                    {locked && (
                      <div
                        style={
                          styles.lockMessage
                        }
                      >
                        🔒 Pro membership
                        required
                      </div>
                    )}

                    {/* BUTTON */}

                    <button
                      onClick={() =>
                        handleCourseClick(
                          course
                        )
                      }
                      style={{
                        ...styles.courseButton,
                        ...(locked
                          ? styles.unlockButton
                          : {}),
                      }}
                    >
                      {locked
                        ? "👑 Unlock Course"
                        : "🚀 Start Learning"}
                    </button>

                  </article>
                );
              }
            )}

          </div>
        )}

      </section>

      {/* =====================================================
          MY COURSES
      ===================================================== */}

      <section
        id="my-courses"
        style={styles.whiteSection}
      >

        <div style={styles.sectionHeader}>

          <div>
            <span style={styles.sectionEyebrow}>
              YOUR LIBRARY
            </span>

            <h2 style={styles.sectionTitle}>
              ⭐ Saved Courses
            </h2>

            <p style={styles.sectionSubtitle}>
              Quickly access the courses
              you saved.
            </p>
          </div>

          <div style={styles.countBadge}>
            {favoriteCourses.length}
            {" "}
            Saved
          </div>

        </div>

        {favoriteCourses.length ===
        0 ? (
          <div style={styles.noCourses}>

            <div style={styles.noCoursesIcon}>
              ⭐
            </div>

            <h3>
              No saved courses yet
            </h3>

            <p>
              Click the ☆ icon on any
              course to save it here.
            </p>

            <button
              onClick={() =>
                scrollToSection(
                  "instructor-courses"
                )
              }
              style={styles.primaryButton}
            >
              Explore Courses
            </button>

          </div>
        ) : (
          <div style={styles.savedList}>

            {favoriteCourses.map(
              (course) => (
                <div
                  key={course.id}
                  style={styles.savedCourse}
                >

                  <div
                    style={
                      styles.savedCourseIcon
                    }
                  >
                    {course.icon}
                  </div>

                  <div
                    style={
                      styles.savedCourseContent
                    }
                  >

                    <h3>
                      {course.title}
                    </h3>

                    <p>
                      {course.category}
                      {" • "}
                      {course.duration}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      handleCourseClick(
                        course
                      )
                    }
                    style={
                      styles.openButton
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
          PREMIUM MODAL
          IMPORTANT: THIS MUST BE INSIDE THE COMPONENT
      ===================================================== */}

      {showPremiumModal &&
        selectedCourse && (
          <div
            style={styles.modalOverlay}
            onClick={() => {
              setShowPremiumModal(false);
              setSelectedCourse(null);
            }}
          >

            <div
              style={styles.premiumModal}
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <button
                onClick={() => {
                  setShowPremiumModal(
                    false
                  );
                  setSelectedCourse(
                    null
                  );
                }}
                style={styles.modalClose}
              >
                ×
              </button>

              <div
                style={
                  styles.modalIcon
                }
              >
                👑
              </div>

              <span
                style={
                  styles.modalBadge
                }
              >
                PREMIUM COURSE
              </span>

              <h2
                style={
                  styles.modalTitle
                }
              >
                {selectedCourse.title}
              </h2>

              <p
                style={
                  styles.modalDescription
                }
              >
                This instructor course
                is available exclusively
                for CareerPilot Pro members.
              </p>

              <div
                style={
                  styles.modalInfo
                }
              >

                <div>
                  <span>
                    Level
                  </span>

                  <strong>
                    {selectedCourse.level}
                  </strong>
                </div>

                <div>
                  <span>
                    Duration
                  </span>

                  <strong>
                    {selectedCourse.duration}
                  </strong>
                </div>

                <div>
                  <span>
                    Provider
                  </span>

                  <strong>
                    {selectedCourse.provider}
                  </strong>
                </div>

              </div>

              <div
                style={
                  styles.benefits
                }
              >
                <div>
                  ✓ Access premium
                  instructor courses
                </div>

                <div>
                  ✓ Learn curated
                  career skills
                </div>

                <div>
                  ✓ Unlock premium
                  learning resources
                </div>

                <div>
                  ✓ Continue your
                  personalized career path
                </div>
              </div>

              <div
                style={
                  styles.modalActions
                }
              >

                <button
                  onClick={() => {
                    setShowPremiumModal(
                      false
                    );
                    setSelectedCourse(
                      null
                    );
                  }}
                  style={
                    styles.modalCancel
                  }
                >
                  Maybe Later
                </button>

                <button
                  onClick={
                    handleUpgrade
                  }
                  style={
                    styles.modalUpgrade
                  }
                >
                  👑 Upgrade to Pro
                </button>

              </div>

            </div>

          </div>
        )}

    </div>
  );
}

// =========================================================
// STAT CARD
// =========================================================

function StatCard({
  icon,
  title,
  value,
  description,
  iconBackground,
  valueColor,
}) {
  return (
    <div style={styles.statCard}>

      <div
        style={{
          ...styles.statIcon,
          background:
            iconBackground,
        }}
      >
        {icon}
      </div>

      <div style={styles.statContent}>

        <span style={styles.statTitle}>
          {title}
        </span>

        <strong
          style={{
            ...styles.statValue,
            color: valueColor,
          }}
        >
          {value}
        </strong>

        <span
          style={
            styles.statDescription
          }
        >
          {description}
        </span>

      </div>

    </div>
  );
}

// =========================================================
// STYLES
// =========================================================

const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    background: "#f6f8fc",
    padding: "24px",
    boxSizing: "border-box",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif',
  },

  // =======================================================
  // HERO
  // =======================================================

  hero: {
    minHeight: "330px",
    background:
      "linear-gradient(135deg,#172554 0%,#1e3a8a 45%,#312e81 100%)",
    borderRadius: "24px",
    padding: "42px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "30px",
    overflow: "hidden",
    position: "relative",
    marginBottom: "22px",
  },

  heroLeft: {
    maxWidth: "700px",
    position: "relative",
    zIndex: 2,
  },

  heroBadge: {
    display: "inline-block",
    padding: "7px 12px",
    background: "rgba(255,255,255,0.12)",
    border:
      "1px solid rgba(255,255,255,0.18)",
    color: "#dbeafe",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "0.7px",
    marginBottom: "14px",
  },

  heroTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "38px",
    lineHeight: "1.12",
    fontWeight: "850",
    maxWidth: "650px",
  },

  heroDescription: {
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: "1.7",
    maxWidth: "620px",
    margin: "16px 0",
  },

  rolePill: {
    display: "inline-flex",
    gap: "7px",
    alignItems: "center",
    padding: "8px 13px",
    borderRadius: "20px",
    background:
      "rgba(255,255,255,0.12)",
    color: "#e0e7ff",
    fontSize: "12px",
  },

  heroActions: {
    display: "flex",
    gap: "10px",
    marginTop: "22px",
    flexWrap: "wrap",
  },

  primaryButton: {
    border: "none",
    background: "#ffffff",
    color: "#1e3a8a",
    padding: "11px 17px",
    borderRadius: "9px",
    fontSize: "12px",
    fontWeight: "800",
    cursor: "pointer",
  },

  secondaryButton: {
    border:
      "1px solid rgba(255,255,255,0.3)",
    background:
      "rgba(255,255,255,0.08)",
    color: "#ffffff",
    padding: "11px 17px",
    borderRadius: "9px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  heroRight: {
    width: "280px",
    height: "240px",
    position: "relative",
    flexShrink: 0,
  },

  heroOrb: {
    width: "170px",
    height: "170px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg,#60a5fa,#8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "70px",
    position: "absolute",
    left: "45px",
    top: "25px",
    boxShadow:
      "0 20px 60px rgba(96,165,250,0.3)",
  },

  floatingCard: {
    position: "absolute",
    top: "0",
    right: "5px",
    background: "#ffffff",
    padding: "11px 14px",
    borderRadius: "10px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },

  // =======================================================
  // ALERT
  // =======================================================

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    border:
      "1px solid #fecaca",
    padding: "13px 16px",
    borderRadius: "10px",
    marginBottom: "18px",
    fontSize: "13px",
  },

  success: {
    background: "#dcfce7",
    color: "#166534",
    border:
      "1px solid #bbf7d0",
    padding: "13px 16px",
    borderRadius: "10px",
    marginBottom: "18px",
    fontSize: "13px",
  },

  // =======================================================
  // STATS
  // =======================================================

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(210px,1fr))",
    gap: "15px",
    marginBottom: "22px",
  },

  statCard: {
    background: "#ffffff",
    border:
      "1px solid #e5e7eb",
    borderRadius: "15px",
    padding: "18px",
    display: "flex",
    gap: "13px",
    alignItems: "center",
  },

  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    flexShrink: 0,
  },

  statContent: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },

  statTitle: {
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "600",
  },

  statValue: {
    fontSize: "25px",
    fontWeight: "850",
  },

  statDescription: {
    color: "#94a3b8",
    fontSize: "10px",
  },

  // =======================================================
  // COMMON SECTIONS
  // =======================================================

  whiteSection: {
    background: "#ffffff",
    border:
      "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "25px",
    marginBottom: "22px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
    marginBottom: "20px",
  },

  sectionEyebrow: {
    color: "#6366f1",
    fontSize: "9px",
    fontWeight: "850",
    letterSpacing: "1px",
  },

  sectionTitle: {
    margin: "4px 0 0",
    color: "#111827",
    fontSize: "21px",
    fontWeight: "800",
  },

  sectionSubtitle: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "12px",
    lineHeight: "1.5",
  },

  countBadge: {
    background: "#eff6ff",
    color: "#2563eb",
    padding: "7px 11px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  // =======================================================
  // SKILLS
  // =======================================================

  skillGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "9px",
  },

  skillItem: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    background: "#f8fafc",
    border:
      "1px solid #e2e8f0",
    padding: "9px 13px",
    borderRadius: "9px",
    color: "#334155",
    fontSize: "12px",
    fontWeight: "650",
  },

  emptySmall: {
    padding: "20px",
    background: "#f8fafc",
    borderRadius: "10px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "12px",
  },

  // =======================================================
  // AI
  // =======================================================

  aiSection: {
    background:
      "linear-gradient(135deg,#eef2ff,#f8f7ff)",
    border:
      "1px solid #ddd6fe",
    borderRadius: "18px",
    padding: "25px",
    marginBottom: "22px",
  },

  aiHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },

  aiTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  aiIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
    boxShadow:
      "0 5px 15px rgba(79,70,229,0.08)",
  },

  aiLabel: {
    color: "#6366f1",
    fontSize: "9px",
    fontWeight: "850",
    letterSpacing: "1px",
  },

  aiGenerateButton: {
    border: "none",
    background:
      "linear-gradient(135deg,#4f46e5,#7c3aed)",
    color: "#ffffff",
    padding: "11px 17px",
    borderRadius: "9px",
    fontSize: "12px",
    fontWeight: "800",
    cursor: "pointer",
  },

  aiEmpty: {
    background: "#ffffff",
    border:
      "1px dashed #c4b5fd",
    borderRadius: "13px",
    padding: "35px",
    textAlign: "center",
  },

  aiEmptyIcon: {
    fontSize: "38px",
    marginBottom: "10px",
  },

  recommendationGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(280px,1fr))",
    gap: "14px",
  },

  recommendationCard: {
    background: "#ffffff",
    border:
      "1px solid #e5e7eb",
    borderRadius: "13px",
    padding: "17px",
  },

  recommendationTop: {
    display: "flex",
    gap: "10px",
  },

  recommendationIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },

  recommendationTitle: {
    margin: "2px 0 6px",
    fontSize: "14px",
    color: "#1e293b",
  },

  skillTag: {
    display: "inline-block",
    background: "#eff6ff",
    color: "#2563eb",
    padding: "4px 7px",
    borderRadius: "10px",
    fontSize: "9px",
    fontWeight: "700",
  },

  recommendationMeta: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "15px",
    color: "#64748b",
    fontSize: "10px",
  },

  resourceButton: {
    display: "inline-block",
    marginTop: "14px",
    color: "#4f46e5",
    textDecoration: "none",
    fontSize: "11px",
    fontWeight: "800",
  },

  // =======================================================
  // COURSES
  // =======================================================

  headingWithBadge: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    flexWrap: "wrap",
  },

  curatedBadge: {
    background: "#ede9fe",
    color: "#6d28d9",
    padding: "5px 8px",
    borderRadius: "10px",
    fontSize: "9px",
    fontWeight: "800",
  },

  courseTotal: {
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "700",
  },

  searchBar: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border:
      "1px solid #e2e8f0",
    background: "#f8fafc",
    borderRadius: "10px",
    padding: "0 12px",
    marginBottom: "13px",
  },

  searchIcon: {
    fontSize: "15px",
  },

  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    padding: "11px 0",
    fontSize: "12px",
    color: "#334155",
  },

  clearSearch: {
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    fontSize: "20px",
    cursor: "pointer",
  },

  categoryRow: {
    display: "flex",
    gap: "7px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },

  categoryButton: {
    border:
      "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#64748b",
    padding: "7px 11px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: "700",
  },

  activeCategory: {
    background: "#4f46e5",
    color: "#ffffff",
    border:
      "1px solid #4f46e5",
  },

  courseGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill,minmax(250px,1fr))",
    gap: "15px",
  },

  courseCard: {
    border:
      "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "17px",
    background: "#ffffff",
    position: "relative",
    transition:
      "transform .2s ease,box-shadow .2s ease",
    display: "flex",
    flexDirection: "column",
    minHeight: "330px",
  },

  lockedCard: {
    background:
      "linear-gradient(145deg,#ffffff,#faf9ff)",
    border:
      "1px solid #c4b5fd",
  },

  courseCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  courseCardIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "11px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
  },

  favoriteButton: {
    border: "none",
    background: "transparent",
    fontSize: "22px",
    cursor: "pointer",
  },

  courseBadge: {
    display: "inline-block",
    alignSelf: "flex-start",
    marginTop: "12px",
    padding: "4px 7px",
    borderRadius: "6px",
    background: "#f1f5f9",
    color: "#64748b",
    fontSize: "8px",
    fontWeight: "850",
  },

  courseCardTitle: {
    margin: "11px 0 7px",
    color: "#1e293b",
    fontSize: "15px",
    lineHeight: "1.4",
  },

  courseCardDescription: {
    color: "#64748b",
    fontSize: "11px",
    lineHeight: "1.6",
    margin: 0,
    minHeight: "52px",
  },

  courseInformation: {
    display: "flex",
    flexWrap: "wrap",
    gap: "7px",
    marginTop: "13px",
    color: "#64748b",
    fontSize: "9px",
  },

  courseSkills: {
    display: "flex",
    gap: "5px",
    flexWrap: "wrap",
    marginTop: "12px",
  },

  lockMessage: {
    marginTop: "12px",
    background: "#fef3c7",
    color: "#92400e",
    padding: "7px",
    borderRadius: "7px",
    fontSize: "9px",
    fontWeight: "700",
  },

  courseButton: {
    marginTop: "auto",
    width: "100%",
    border: "none",
    background: "#4f46e5",
    color: "#ffffff",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "800",
    cursor: "pointer",
  },

  unlockButton: {
    background:
      "linear-gradient(135deg,#7c3aed,#4f46e5)",
  },

  // =======================================================
  // EMPTY
  // =======================================================

  noCourses: {
    textAlign: "center",
    padding: "45px 20px",
    background: "#f8fafc",
    borderRadius: "12px",
    border:
      "1px dashed #cbd5e1",
  },

  noCoursesIcon: {
    fontSize: "40px",
    marginBottom: "8px",
  },

  // =======================================================
  // SAVED
  // =======================================================

  savedList: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
  },

  savedCourse: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    background: "#f8fafc",
    border:
      "1px solid #e5e7eb",
    borderRadius: "10px",
  },

  savedCourseIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "9px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
  },

  savedCourseContent: {
    flex: 1,
  },

  openButton: {
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    padding: "8px 13px",
    borderRadius: "7px",
    fontSize: "10px",
    fontWeight: "800",
    cursor: "pointer",
  },

  // =======================================================
  // MODAL
  // =======================================================

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(15,23,42,.68)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 99999,
    backdropFilter: "blur(5px)",
  },

  premiumModal: {
    width: "100%",
    maxWidth: "480px",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "30px",
    boxSizing: "border-box",
    position: "relative",
    textAlign: "center",
    boxShadow:
      "0 30px 80px rgba(0,0,0,.3)",
  },

  modalClose: {
    position: "absolute",
    top: "13px",
    right: "15px",
    width: "32px",
    height: "32px",
    border: "none",
    borderRadius: "50%",
    background: "#f1f5f9",
    color: "#475569",
    fontSize: "20px",
    cursor: "pointer",
  },

  modalIcon: {
    width: "68px",
    height: "68px",
    borderRadius: "18px",
    margin: "0 auto 12px",
    background:
      "linear-gradient(135deg,#fef3c7,#fde68a)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "31px",
  },

  modalBadge: {
    display: "inline-block",
    background: "#ede9fe",
    color: "#6d28d9",
    padding: "6px 11px",
    borderRadius: "20px",
    fontSize: "9px",
    fontWeight: "850",
  },

  modalTitle: {
    margin: "15px 0 8px",
    color: "#111827",
    fontSize: "21px",
    fontWeight: "850",
  },

  modalDescription: {
    color: "#64748b",
    fontSize: "12px",
    lineHeight: "1.6",
    maxWidth: "390px",
    margin: "0 auto",
  },

  modalInfo: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3,minmax(0,1fr))",
    gap: "8px",
    marginTop: "20px",
  },

  modalInfoBox: {
    background: "#f8fafc",
    padding: "10px",
    borderRadius: "8px",
  },

  benefits: {
    textAlign: "left",
    marginTop: "18px",
    padding: "14px",
    background: "#f8f7ff",
    borderRadius: "10px",
    color: "#475569",
    fontSize: "11px",
    lineHeight: "2",
  },

  modalActions: {
    display: "flex",
    gap: "9px",
    marginTop: "20px",
  },

  modalCancel: {
    flex: 1,
    border:
      "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#64748b",
    padding: "11px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
  },

  modalUpgrade: {
    flex: 1,
    border: "none",
    background:
      "linear-gradient(135deg,#7c3aed,#4f46e5)",
    color: "#ffffff",
    padding: "11px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "800",
  },

  // =======================================================
  // LOADING
  // =======================================================

  loadingCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "70px 25px",
    textAlign: "center",
    border:
      "1px solid #e5e7eb",
  },

  loadingSpinner: {
    fontSize: "45px",
    marginBottom: "12px",
  },
};