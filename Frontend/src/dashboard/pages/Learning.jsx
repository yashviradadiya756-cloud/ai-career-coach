import React, { useEffect, useState } from "react";

import { getLearning, generateLearning, } from "../../api/learningApi";

import { getLatestSkillGap } from "../../api/skillGapApi";

export default function Learning() {
  const [learning, setLearning] = useState(null);
  const [skillGap, setSkillGap] = useState(null);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ==========================================
  // LOAD LEARNING + SKILL GAP
  // ==========================================

  useEffect(() => {
    loadLearningData();
  }, []);

  const loadLearningData = async () => {
    try {
      setLoading(true);
      setError("");

      // ==========================================
      // GET EXISTING LEARNING
      // ==========================================

      try {
        const learningResponse = await getLearning();

        console.log(
          "LEARNING API RESPONSE:",
          JSON.stringify(learningResponse, null, 2)
        );

        if (
          learningResponse?.success &&
          learningResponse?.learning
        ) {
          setLearning(learningResponse.learning);
        } else {
          setLearning(null);
        }
      } catch (error) {
        console.error(
          "Learning API Error:",
          error.response?.data || error.message
        );

        // 404 means learning plan has not been generated yet.
        // This is NOT a fatal error.
        setLearning(null);
      }

      // ==========================================
      // GET LATEST SKILL GAP
      // ==========================================

      try {
        const skillGapResponse = await getLatestSkillGap();

        console.log(
          "SKILL GAP RESPONSE:",
          JSON.stringify(skillGapResponse, null, 2)
        );

        if (
          skillGapResponse?.success &&
          skillGapResponse?.skillGap
        ) {
          setSkillGap(skillGapResponse.skillGap);
        } else {
          setSkillGap(null);
        }
      } catch (error) {
        console.error(
          "Skill Gap API Error:",
          error.response?.data || error.message
        );

        setSkillGap(null);
      }
    } catch (error) {
      console.error("Learning Error:", error);

      setError("Failed to load learning dashboard.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // TARGET ROLE
  // ==========================================

  const targetRole =
    learning?.targetRole ||
    skillGap?.targetRole ||
    "";

  // ==========================================
  // MISSING SKILLS
  // ==========================================

  const missingSkills =
    Array.isArray(skillGap?.missingSkills)
      ? skillGap.missingSkills
      : [];

  // ==========================================
  // RECOMMENDATIONS
  // ==========================================

  const recommendations =
    Array.isArray(learning?.recommendations)
      ? learning.recommendations
      : [];

  // ==========================================
  // GENERATE LEARNING PLAN
  // ==========================================

  const handleGenerateLearning = async () => {
    try {
      setGenerating(true);
      setError("");
      setMessage("");

      const role =
        learning?.targetRole ||
        skillGap?.targetRole;

      console.log("Target Role:", role);

      // ------------------------------------------
      // CHECK SKILL GAP
      // ------------------------------------------

      if (!role) {
        setError(
          "Please complete Skill Gap Analysis first."
        );
        return;
      }

      // ------------------------------------------
      // CHECK MISSING SKILLS
      // ------------------------------------------

      if (missingSkills.length === 0) {
        setError(
          "No missing skills found in your Skill Gap Analysis."
        );
        return;
      }

      console.log(
        "Generating learning plan for:",
        role
      );

      // ------------------------------------------
      // API REQUEST
      // ------------------------------------------

      const response = await generateLearning(role);

      console.log(
        "GENERATED LEARNING:",
        JSON.stringify(response, null, 2)
      );

      // ------------------------------------------
      // SUCCESS
      // ------------------------------------------

      if (
        response?.success &&
        response?.learning
      ) {
        setLearning(response.learning);

        setMessage(
          "Learning plan generated successfully!"
        );
      } else {
        setError(
          response?.message ||
            "Failed to generate learning plan."
        );
      }
    } catch (error) {
      console.error(
        "Generate Learning Error:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
          "Failed to generate learning plan."
      );
    } finally {
      setGenerating(false);
    }
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <div style={styles.loadingIcon}>📚</div>

          <h2 style={styles.loadingTitle}>
            Loading Learning Center...
          </h2>

          <p style={styles.loadingText}>
            Preparing your personalized learning dashboard.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div style={styles.container}>

      {/* ==========================================
          HEADER
      ========================================== */}

      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>
            📚 Learning Center
          </h1>

          <p style={styles.headerDescription}>
            Learn new technologies, track your progress,
            and become job-ready with AI-recommended
            learning resources.
          </p>

          {targetRole && (
            <p style={styles.targetRole}>
              <strong>Target Role:</strong>{" "}
              {targetRole}
            </p>
          )}
        </div>
      </div>

      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <div style={styles.error}>
          ⚠️ {error}
        </div>
      )}

      {/* ==========================================
          SUCCESS
      ========================================== */}

      {message && (
        <div style={styles.success}>
          ✅ {message}
        </div>
      )}

      {/* ==========================================
          DASHBOARD CARDS
      ========================================== */}

      <div style={styles.cards}>

        {/* Recommended Skills */}

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

        {/* Completed */}

        <div style={styles.card}>
          <div style={styles.cardIconGreen}>
            ✅
          </div>

          <div>
            <h3 style={styles.cardTitle}>
              Completed
            </h3>

            <h1
              style={{
                ...styles.cardNumber,
                color: "#16a34a",
              }}
            >
              0
            </h1>
          </div>
        </div>

        {/* Certificates */}

        <div style={styles.card}>
          <div style={styles.cardIconYellow}>
            🏆
          </div>

          <div>
            <h3 style={styles.cardTitle}>
              Certificates
            </h3>

            <h1
              style={{
                ...styles.cardNumber,
                color: "#f59e0b",
              }}
            >
              0
            </h1>
          </div>
        </div>

        {/* Learning Time */}

        <div style={styles.card}>
          <div style={styles.cardIconRed}>
            ⏱️
          </div>

          <div>
            <h3 style={styles.cardTitle}>
              Learning Time
            </h3>

            <h1
              style={{
                ...styles.cardNumber,
                color: "#dc2626",
              }}
            >
              0{" "}
              <span style={styles.hours}>
                hrs
              </span>
            </h1>
          </div>
        </div>

      </div>

      {/* ==========================================
          SKILL GAP
      ========================================== */}

      {skillGap && (
        <div style={styles.section}>

          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                🧩 Skills You Need to Learn
              </h2>

              <p style={styles.sectionSubtitle}>
                Based on your latest Skill Gap Analysis
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

      {/* ==========================================
          AI LEARNING PLAN
      ========================================== */}

      <div style={styles.generateBox}>

        <div style={styles.generateContent}>

          <h2 style={styles.generateTitle}>
            🤖 AI Learning Plan
          </h2>

          <p style={styles.generateDescription}>
            Generate personalized learning resources
            based on your Skill Gap Analysis.
          </p>

          {targetRole && (
            <p style={styles.roleText}>
              <strong>Target Role:</strong>{" "}
              {targetRole}
            </p>
          )}

          {!targetRole && (
            <p style={styles.warningText}>
              ⚠️ Please complete Skill Gap Analysis first.
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

      {/* ==========================================
          RECOMMENDED COURSES
      ========================================== */}

      <div style={styles.section}>

        <h2 style={styles.sectionTitle}>
          🚀 Recommended Courses
        </h2>

        <p style={styles.sectionSubtitle}>
          AI-selected resources based on your skill gaps.
        </p>

        {recommendations.length === 0 ? (

          <div style={styles.empty}>

            <div style={styles.emptyIcon}>
              📚
            </div>

            <h3 style={styles.emptyTitle}>
              No learning recommendations found.
            </h3>

            <p style={styles.emptyDescription}>
              Complete your Skill Gap Analysis and
              generate your personalized learning plan.
            </p>

            {targetRole && (
              <button
                onClick={handleGenerateLearning}
                disabled={generating}
                style={{
                  ...styles.smallButton,
                  opacity: generating ? 0.6 : 1,
                }}
              >
                {generating
                  ? "Generating..."
                  : "Generate Now"}
              </button>
            )}

          </div>

        ) : (

          <div style={styles.courseGrid}>

            {recommendations.map(
              (item, index) => (

                <div
                  key={index}
                  style={styles.courseCard}
                >

                  {/* Course header */}

                  <div style={styles.courseHeader}>

                    <div style={styles.courseInfo}>

                      <div style={styles.courseIcon}>
                        🎓
                      </div>

                      <div>

                        <h3 style={styles.courseTitle}>
                          {item.course ||
                            "Recommended Course"}
                        </h3>

                        {item.skill && (
                          <span style={styles.courseSkill}>
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

                  {/* Course Details */}

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

                  {/* Course URL */}

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.link}
                    >
                      View Course →
                    </a>
                  )}

                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* ==========================================
          AI RECOMMENDATION
      ========================================== */}

      <div style={styles.section}>

        <h2 style={styles.sectionTitle}>
          🤖 AI Recommendation
        </h2>

        {recommendations.length > 0 ? (

          <p style={styles.recommendationText}>
            Based on your Skill Gap Analysis for{" "}
            <strong style={styles.highlight}>
              {targetRole}
            </strong>
            , focus on completing the recommended
            resources above. After completing them,
            update your progress and continue with
            the next skill.
          </p>

        ) : targetRole ? (

          <p style={styles.recommendationText}>
            Based on your{" "}
            <strong style={styles.highlight}>
              {targetRole}
            </strong>{" "}
            career goal, click{" "}
            <strong>
              Generate Learning Plan
            </strong>{" "}
            to receive personalized learning
            resources for your missing skills.
          </p>

        ) : (

          <p style={styles.recommendationText}>
            Complete your Skill Gap Analysis first.
            Then generate a personalized learning
            plan based on your target career.
          </p>

        )}

      </div>

    </div>
  );
}


// ======================================================
// STYLES
// ======================================================

const styles = {

  // ==========================================
  // MAIN CONTAINER
  // ==========================================

  container: {
    width: "100%",
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "28px",
    boxSizing: "border-box",
  },

  // ==========================================
  // LOADING
  // ==========================================

  loadingBox: {
    background: "#ffffff",
    padding: "50px 30px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  loadingIcon: {
    fontSize: "40px",
    marginBottom: "15px",
  },

  loadingTitle: {
    margin: "0 0 8px",
    color: "#1e293b",
    fontSize: "22px",
  },

  loadingText: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },

  // ==========================================
  // HEADER
  // ==========================================

  header: {
    background: "#ffffff",
    padding: "28px 30px",
    borderRadius: "14px",
    marginBottom: "22px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  headerTitle: {
    margin: "0 0 10px",
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827",
  },

  headerDescription: {
    margin: 0,
    maxWidth: "850px",
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#64748b",
  },

  targetRole: {
    marginTop: "16px",
    marginBottom: 0,
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "8px",
    background: "#eff6ff",
    color: "#2563eb",
    fontSize: "14px",
  },

  // ==========================================
  // ERROR / SUCCESS
  // ==========================================

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "14px 18px",
    borderRadius: "10px",
    marginBottom: "20px",
    border: "1px solid #fecaca",
    fontSize: "14px",
  },

  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "14px 18px",
    borderRadius: "10px",
    marginBottom: "20px",
    border: "1px solid #bbf7d0",
    fontSize: "14px",
  },

  // ==========================================
  // STATISTICS
  // ==========================================

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "20px",
    marginBottom: "22px",
  },

  card: {
    background: "#ffffff",
    padding: "22px",
    borderRadius: "14px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    minHeight: "105px",
    boxSizing: "border-box",
  },

  cardTitle: {
    margin: "0 0 6px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#64748b",
  },

  cardNumber: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "700",
  },

  hours: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#64748b",
  },

  cardIconBlue: {
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
    flexShrink: 0,
  },

  cardIconGreen: {
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    background: "#f0fdf4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
    flexShrink: 0,
  },

  cardIconYellow: {
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    background: "#fffbeb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
    flexShrink: 0,
  },

  cardIconRed: {
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    background: "#fef2f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
    flexShrink: 0,
  },

  // ==========================================
  // SECTION
  // ==========================================

  section: {
    background: "#ffffff",
    padding: "26px",
    borderRadius: "14px",
    marginBottom: "22px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "20px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
  },

  sectionSubtitle: {
    margin: "7px 0 0",
    fontSize: "14px",
    color: "#64748b",
  },

  skillCount: {
    background: "#eff6ff",
    color: "#2563eb",
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  // ==========================================
  // SKILLS
  // ==========================================

  skillList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },

  skillBadge: {
    background: "#eff6ff",
    color: "#2563eb",
    border: "1px solid #dbeafe",
    padding: "9px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },

  emptyText: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },

  // ==========================================
  // GENERATE BOX
  // ==========================================

  generateBox: {
    background: "#ffffff",
    padding: "26px",
    borderRadius: "14px",
    marginBottom: "22px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
    flexWrap: "wrap",
  },

  generateContent: {
    flex: 1,
    minWidth: "250px",
  },

  generateTitle: {
    margin: "0 0 10px",
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
  },

  generateDescription: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#64748b",
  },

  roleText: {
    margin: "14px 0 0",
    fontSize: "14px",
    color: "#475569",
  },

  warningText: {
    margin: "14px 0 0",
    fontSize: "14px",
    color: "#dc2626",
  },

  button: {
    padding: "12px 20px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    minWidth: "190px",
  },

  // ==========================================
  // EMPTY
  // ==========================================

  empty: {
    background: "#f8fafc",
    border: "1px dashed #cbd5e1",
    padding: "35px 20px",
    borderRadius: "10px",
    marginTop: "18px",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "38px",
    marginBottom: "10px",
  },

  emptyTitle: {
    margin: "0 0 8px",
    color: "#334155",
    fontSize: "17px",
  },

  emptyDescription: {
    margin: "0 auto",
    maxWidth: "550px",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  smallButton: {
    marginTop: "18px",
    padding: "10px 18px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  // ==========================================
  // COURSES
  // ==========================================

  courseGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "18px",
    marginTop: "20px",
  },

  courseCard: {
    padding: "20px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    background: "#fafafa",
    transition: "all 0.2s ease",
  },

  courseHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
    marginBottom: "18px",
  },

  courseInfo: {
    display: "flex",
    gap: "12px",
    minWidth: 0,
  },

  courseIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  courseTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
    color: "#1e293b",
    lineHeight: "1.4",
  },

  courseSkill: {
    display: "inline-block",
    marginTop: "7px",
    background: "#eff6ff",
    color: "#2563eb",
    padding: "4px 9px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "600",
  },

  duration: {
    background: "#ffffff",
    color: "#64748b",
    padding: "5px 9px",
    borderRadius: "15px",
    fontSize: "11px",
    whiteSpace: "nowrap",
    border: "1px solid #e5e7eb",
  },

  courseDetails: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  },

  detailBox: {
    background: "#ffffff",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #f1f5f9",
  },

  detailLabel: {
    display: "block",
    fontSize: "11px",
    color: "#94a3b8",
    marginBottom: "5px",
  },

  detailValue: {
    fontSize: "13px",
    color: "#334155",
  },

  link: {
    display: "inline-block",
    marginTop: "18px",
    color: "#2563eb",
    fontSize: "14px",
    fontWeight: "600",
    textDecoration: "none",
  },

  // ==========================================
  // AI RECOMMENDATION
  // ==========================================

  recommendationText: {
    margin: "14px 0 0",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.8",
  },

  highlight: {
    color: "#2563eb",
  },
};