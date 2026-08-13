import React, { useEffect, useState } from "react";
import {
  analyzeSkillGap,
  getLatestSkillGap,
} from "../../api/skillGapApi";

const SkillGap = () => {
  const [skillGap, setSkillGap] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD LATEST SKILL GAP
  // ==========================================
  useEffect(() => {
    loadSkillGap();
  }, []);

  const loadSkillGap = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getLatestSkillGap();

      console.log("Skill Gap RAW response:", response);

      const data = response?.data || response;

      console.log("Skill Gap NORMALIZED response:", data);

      if (data?.success && data?.skillGap) {
        setSkillGap(data.skillGap);
        setTargetRole(data.skillGap.targetRole || "");
      } else {
        setSkillGap(null);
      }
    } catch (error) {
      console.error(
        "Skill Gap API Error:",
        error.response?.data || error.message
      );

      if (error.response?.status === 404) {
        setSkillGap(null);
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to load Skill Gap Analysis."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ANALYZE SKILL GAP
  // ==========================================
  const handleAnalyze = async () => {
  try {
    if (!targetRole.trim()) {
      setError(
        "Please enter your target career role."
      );
      return;
    }

    setAnalyzing(true);
    setError("");

    console.log(
      "================================"
    );

    console.log(
      "SKILL GAP ANALYSIS STARTED"
    );

    console.log(
      "TARGET ROLE:",
      targetRole
    );

    console.log(
      "================================"
    );

    const response =
      await analyzeSkillGap(
        targetRole.trim()
      );

    console.log(
      "SKILL GAP RESPONSE:",
      response?.data
    );

    const data =
      response?.data || response;

    if (
      data?.success &&
      data?.skillGap
    ) {
      setSkillGap(
        data.skillGap
      );

      setTargetRole(
        data.skillGap.targetRole ||
          targetRole
      );

      console.log(
        "SKILL GAP ANALYSIS SUCCESS"
      );
    } else {
      throw new Error(
        data?.message ||
          "Skill Gap Analysis Failed"
      );
    }
  } catch (error) {
    console.error(
      "================================"
    );

    console.error(
      "SKILL GAP ANALYZE ERROR"
    );

    console.error(
      error.response?.data ||
        error.message
    );

    console.error(
      "================================"
    );

    setError(
      error.response?.data
        ?.message ||
        error.message ||
        "Skill Gap Analysis Failed"
    );
  } finally {
    setAnalyzing(false);
  }
};

  // ==========================================
  // SMALL CLEAN LOADING SCREEN
  // ==========================================
  if (loading) {
    return <SkillGapLoading />;
  }

  // ==========================================
  // DATA
  // ==========================================
  const currentSkills = Array.isArray(skillGap?.currentSkills)
    ? skillGap.currentSkills
    : [];

  const missingSkills = Array.isArray(skillGap?.missingSkills)
    ? skillGap.missingSkills
    : [];

  const recommendedCourses = Array.isArray(
    skillGap?.recommendedCourses
  )
    ? skillGap.recommendedCourses
    : [];

  const roadmap = Array.isArray(skillGap?.roadmap)
    ? skillGap.roadmap
    : [];

  const readinessScore =
    Number(skillGap?.readinessScore) || 0;

  // ==========================================
  // MAIN UI
  // ==========================================
  return (
    <div
      className="skill-gap-container"
      style={styles.container}
    >
      {/* ==================================
          HEADER
      ================================== */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>
            🎯 Skill Gap Analysis
          </h1>

          <p style={styles.headerSubtitle}>
            Identify the skills you already have and discover
            what you need to learn for your target career.
          </p>
        </div>
      </div>

      {/* ==================================
          ERROR
      ================================== */}
      {error && (
        <div style={styles.errorBox}>
          ⚠️ {error}
        </div>
      )}

      {/* ==================================
          TARGET ROLE
      ================================== */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>
          Target Career Role
        </h2>

        <div className="input-row" style={styles.inputRow}>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="Example: Full Stack Developer"
            style={styles.input}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAnalyze();
              }
            }}
          />

          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            style={{
              ...styles.primaryButton,
              opacity: analyzing ? 0.7 : 1,
              cursor: analyzing
                ? "not-allowed"
                : "pointer",
            }}
          >
            {analyzing ? (
              <>
                <span style={styles.buttonSpinner}></span>
                Analyzing...
              </>
            ) : (
              "Analyze Skill Gap"
            )}
          </button>
        </div>
      </div>

      {/* ==================================
          ANALYZING LOADING
      ================================== */}
      {analyzing && (
        <div style={styles.analyzingLoading}>
          <SmallLoadingCircle />

          <h3 style={styles.analyzingTitle}>
            Preparing your skill gap
          </h3>

          <p style={styles.analyzingSubtitle}>
            Setting up your skill analysis and
            preparing your personalized insights...
          </p>
        </div>
      )}

      {/* ==================================
          NO DATA
      ================================== */}
      {!skillGap && !analyzing ? (
        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>🎯</div>

          <h2 style={styles.emptyTitle}>
            No Skill Gap Analysis Found
          </h2>

          <p style={styles.emptyText}>
            Enter your target role and click
            "Analyze Skill Gap".
          </p>
        </div>
      ) : (
        !analyzing && (
          <>
            {/* ==================================
                TARGET ROLE + SCORE
            ================================== */}
            <div style={styles.overviewGrid}>
              <div style={styles.overviewCard}>
                <p style={styles.cardMetaTitle}>
                  Target Role
                </p>

                <h2 style={styles.roleTitle}>
                  {skillGap.targetRole || targetRole}
                </h2>
              </div>

              <div style={styles.overviewCard}>
                <p style={styles.cardMetaTitle}>
                  Readiness Score
                </p>

                <p style={styles.scoreText}>
                  {readinessScore}%
                </p>

                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${Math.min(
                        Math.max(readinessScore, 0),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ==================================
                CURRENT SKILLS
            ================================== */}
            <div style={styles.card}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>
                  ✅ Current Skills
                </h2>

                <span style={styles.badgeSuccess}>
                  {currentSkills.length}
                </span>
              </div>

              {currentSkills.length === 0 ? (
                <p style={styles.emptyText}>
                  No current skills found.
                </p>
              ) : (
                <div style={styles.skillTagGrid}>
                  {currentSkills.map((skill, index) => (
                    <span
                      className="skill-tag current"
                      key={index}
                      style={styles.currentSkillTag}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ==================================
                MISSING SKILLS
            ================================== */}
            <div style={styles.card}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>
                  ⚠️ Missing Skills
                </h2>

                <span style={styles.badgeDanger}>
                  {missingSkills.length}
                </span>
              </div>

              {missingSkills.length === 0 ? (
                <p style={styles.successText}>
                  🎉 No major skill gaps found!
                </p>
              ) : (
                <div style={styles.skillTagGrid}>
                  {missingSkills.map((skill, index) => (
                    <span
                      className="skill-tag missing"
                      key={index}
                      style={styles.missingSkillTag}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ==================================
                RECOMMENDED COURSES
            ================================== */}
            {recommendedCourses.length > 0 && (
              <div style={styles.card}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>
                    📚 Recommended Courses
                  </h2>
                </div>

                <div style={styles.listContainer}>
                  {recommendedCourses.map((course, index) => (
                    <div
                      className="course-item"
                      key={index}
                      style={styles.courseRow}
                    >
                      <div style={styles.listBadge}>
                        {index + 1}
                      </div>

                      <p style={styles.courseText}>
                        {course}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================================
                ROADMAP
            ================================== */}

{roadmap.length > 0 && (
  <div style={styles.card}>
    <div style={styles.sectionHeader}>
      <h2 style={styles.sectionTitle}>
        🗺️ Recommended Roadmap
      </h2>

      <span style={styles.badgeSuccess}>
        {roadmap.length} Phases
      </span>
    </div>

    <div style={styles.listContainer}>
      {roadmap.map(
        (step, index) => (
          <div
            className="roadmap-item"
            key={index}
            style={styles.roadmapRow}
          >
            {/* NUMBER */}
            <div
              style={styles.roadmapBadge}
            >
              {index + 1}
            </div>

            {/* CONTENT */}
            <div
              style={styles.roadmapContent}
            >
              {/* PHASE */}
              <h3
                style={
                  styles.roadmapPhase
                }
              >
                {step?.phase ||
                  `Phase ${
                    index + 1
                  }`}
              </h3>

              {/* DURATION */}
              {step?.duration && (
                <div
                  style={
                    styles.roadmapDuration
                  }
                >
                  ⏱ {step.duration}
                </div>
              )}

              {/* ACTION ITEMS */}
              {Array.isArray(
                step?.actionItems
              ) &&
                step.actionItems
                  .length > 0 && (
                  <div
                    style={
                      styles.actionItems
                    }
                  >
                    {step.actionItems.map(
                      (
                        action,
                        actionIndex
                      ) => (
                        <div
                          key={
                            actionIndex
                          }
                          style={
                            styles.actionItem
                          }
                        >
                          <span
                            style={
                              styles.actionCheck
                            }
                          >
                            ✓
                          </span>

                          <span>
                            {action}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>
          </div>
        )
      )}
    </div>
  </div>
)}
          </>
        )
      )}

      {/* ==================================
          RESPONSIVE CSS + ANIMATIONS
      ================================== */}
      <style>
        {`
          .skill-gap-container {
            width: 100%;
            max-width: none;
            box-sizing: border-box;
          }

          .skill-gap-container * {
            box-sizing: border-box;
          }

          .skill-gap-container input:focus {
            border-color: #10b981 !important;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.10);
          }

          .skill-gap-container button:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 5px 15px rgba(37, 99, 235, 0.20);
          }

          .skill-tag {
            transition: all 0.2s ease;
          }

          .skill-tag:hover {
            transform: translateY(-2px);
          }

          .course-item {
            transition: all 0.2s ease;
          }

          .course-item:hover {
            transform: translateX(3px);
            border-color: #cbd5e1 !important;
          }

          .roadmap-item {
            transition: all 0.2s ease;
          }

          .roadmap-item:hover {
            transform: translateX(3px);
          }

          @keyframes circleRotate {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          @keyframes circleRotateReverse {
            from {
              transform: rotate(360deg);
            }

            to {
              transform: rotate(0deg);
            }
          }

          @keyframes centerPulse {
            0% {
              transform: scale(1);
            }

            50% {
              transform: scale(1.06);
            }

            100% {
              transform: scale(1);
            }
          }

          @keyframes dotPulse {
            0%,
            100% {
              opacity: 0.35;
            }

            50% {
              opacity: 1;
            }
          }

          @media (max-width: 768px) {
            .skill-gap-container {
              padding: 20px 16px !important;
            }

            .skill-gap-container .input-row {
              flex-direction: column;
              align-items: stretch;
            }

            .skill-gap-container .input-row button {
              width: 100%;
            }
          }

          @media (max-width: 480px) {
            .skill-gap-container {
              padding: 16px 12px !important;
            }

            .skill-gap-container .overview-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
};

// =====================================================
// SMALL LOADING CIRCLE
// =====================================================

const SmallLoadingCircle = () => {
  return (
    <div style={styles.loaderCircleWrapper}>
      <div style={styles.loaderCircle}>
        <div style={styles.loaderCenter}>
          <div style={styles.loaderBars}>
            <span style={styles.loaderBar}></span>
            <span
              style={{
                ...styles.loaderBar,
                height: "9px",
                animationDelay: "0.15s",
              }}
            ></span>
            <span
              style={{
                ...styles.loaderBar,
                height: "12px",
                animationDelay: "0.3s",
              }}
            ></span>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// INITIAL PAGE LOADING
// =====================================================

const SkillGapLoading = () => {
  return (
    <div className="skill-gap-loading" style={styles.loadingPage}>
      <SmallLoadingCircle />

      <h2 style={styles.loadingTitle}>
        Preparing your skill gap
      </h2>

      <p style={styles.loadingSubtitle}>
        Setting up your skill analysis and
        analyzing your profile...
      </p>

      <div style={styles.loadingDots}>
        <span style={styles.loadingDot}></span>

        <span
          style={{
            ...styles.loadingDot,
            animationDelay: "0.15s",
          }}
        ></span>

        <span
          style={{
            ...styles.loadingDot,
            animationDelay: "0.3s",
          }}
        ></span>
      </div>
    </div>
  );
};

// =====================================================
// STYLES
// =====================================================

const styles = {
  // ==========================================
  // MAIN CONTAINER
  // ==========================================

  container: {
    width: "100%",
    maxWidth: "none",
    margin: 0,
    padding: "24px 28px",
    boxSizing: "border-box",
    backgroundColor: "#f8fafc",
    minHeight: "100%",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: "#0f172a",
  },

  // ==========================================
  // SMALL LOADING PAGE
  // ==========================================

  loadingPage: {
    width: "100%",
    minHeight: "60vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    textAlign: "center",
  },

  loadingTitle: {
    margin: "20px 0 5px",
    fontSize: "15px",
    lineHeight: "1.4",
    fontWeight: "700",
    color: "#111827",
    letterSpacing: "-0.01em",
  },

  loadingSubtitle: {
    width: "100%",
    maxWidth: "270px",
    margin: 0,
    fontSize: "10px",
    lineHeight: "1.5",
    color: "#9ca3af",
  },

  loadingDots: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    marginTop: "13px",
  },

  loadingDot: {
    width: "3px",
    height: "3px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
    animation: "dotPulse 1.1s ease-in-out infinite",
  },

  // ==========================================
  // SMALL CIRCLE LOADER
  // ==========================================

  loaderCircleWrapper: {
    width: "58px",
    height: "58px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  loaderCircle: {
    position: "relative",
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    border: "1px solid #d7eee6",
    animation:
      "circleRotate 1.4s linear infinite",
  },

  loaderCenter: {
    position: "absolute",
    width: "32px",
    height: "32px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "50%",
    backgroundColor: "#22b573",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow:
      "0 3px 10px rgba(34, 181, 115, 0.20)",
    animation:
      "centerPulse 1.5s ease-in-out infinite",
  },

  loaderBars: {
    height: "15px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: "2px",
    transform: "rotate(-360deg)",
  },

  loaderBar: {
    width: "2px",
    height: "6px",
    borderRadius: "2px",
    backgroundColor: "#ffffff",
    display: "block",
    animation:
      "centerPulse 0.8s ease-in-out infinite",
  },

  // ==========================================
  // HEADER
  // ==========================================

  header: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: "24px 28px",
    borderRadius: "16px",
    marginBottom: "20px",
    boxShadow:
      "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
    border: "1px solid #e2e8f0",
    boxSizing: "border-box",
  },

  headerTitle: {
    margin: "0 0 8px",
    fontSize: "26px",
    fontWeight: "700",
    letterSpacing: "-0.02em",
    color: "#0f172a",
  },

  headerSubtitle: {
    margin: 0,
    fontSize: "15px",
    color: "#64748b",
    lineHeight: "1.5",
  },

  // ==========================================
  // ERROR
  // ==========================================

  errorBox: {
    width: "100%",
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    padding: "14px 20px",
    borderRadius: "12px",
    border: "1px solid #fecaca",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "20px",
    boxSizing: "border-box",
  },

  // ==========================================
  // CARD
  // ==========================================

  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: "24px 28px",
    borderRadius: "16px",
    marginBottom: "20px",
    boxShadow:
      "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
    border: "1px solid #e2e8f0",
    boxSizing: "border-box",
  },

  cardTitle: {
    margin: "0 0 16px",
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
  },

  inputRow: {
    display: "flex",
    width: "100%",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  input: {
    flex: "1 1 300px",
    width: "100%",
    minWidth: 0,
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    color: "#0f172a",
    outline: "none",
    backgroundColor: "#ffffff",
    boxSizing: "border-box",
  },

  primaryButton: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "12px 24px",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    minHeight: "46px",
  },

  buttonSpinner: {
    width: "15px",
    height: "15px",
    border: "2px solid rgba(255,255,255,0.4)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
    display: "inline-block",
    animation: "circleRotate 0.7s linear infinite",
  },

  // ==========================================
  // ANALYZING
  // ==========================================

  analyzingLoading: {
    width: "100%",
    minHeight: "260px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    textAlign: "center",
  },

  analyzingTitle: {
    margin: "20px 0 5px",
    fontSize: "15px",
    fontWeight: "700",
    color: "#111827",
  },

  analyzingSubtitle: {
    maxWidth: "300px",
    margin: 0,
    fontSize: "10px",
    lineHeight: "1.5",
    color: "#9ca3af",
  },

  // ==========================================
  // EMPTY
  // ==========================================

  emptyCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: "48px 32px",
    borderRadius: "16px",
    textAlign: "center",
    border: "1px dashed #cbd5e1",
    marginBottom: "20px",
    boxSizing: "border-box",
  },

  emptyIcon: {
    fontSize: "30px",
    marginBottom: "12px",
  },

  emptyTitle: {
    margin: "0 0 8px",
    fontSize: "20px",
    fontWeight: "700",
    color: "#334155",
  },

  emptyText: {
    margin: 0,
    fontSize: "14px",
    color: "#64748b",
  },

  successText: {
    margin: 0,
    fontSize: "14px",
    color: "#16a34a",
    fontWeight: "500",
  },

  // ==========================================
  // OVERVIEW
  // ==========================================

  overviewGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
    marginBottom: "20px",
    width: "100%",
  },

  overviewCard: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow:
      "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
    border: "1px solid #e2e8f0",
    minWidth: 0,
  },

  cardMetaTitle: {
    margin: "0 0 8px",
    fontSize: "13px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#64748b",
  },

  roleTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
    overflowWrap: "break-word",
  },

  scoreText: {
    margin: 0,
    fontSize: "36px",
    fontWeight: "800",
    color: "#2563eb",
    letterSpacing: "-0.03em",
  },

  progressBar: {
    width: "100%",
    height: "7px",
    backgroundColor: "#e2e8f0",
    borderRadius: "10px",
    marginTop: "12px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#2563eb",
    borderRadius: "10px",
    transition: "width 0.5s ease",
  },

  // ==========================================
  // SECTION
  // ==========================================

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    gap: "12px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
  },

  // ==========================================
  // BADGES
  // ==========================================

  badgeSuccess: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "700",
    flexShrink: 0,
  },

  badgeDanger: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "700",
    flexShrink: 0,
  },

  // ==========================================
  // SKILLS
  // ==========================================

  skillTagGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    width: "100%",
  },

  currentSkillTag: {
    backgroundColor: "#f0fdf4",
    color: "#166534",
    border: "1px solid #bbf7d0",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    overflowWrap: "break-word",
  },

  missingSkillTag: {
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    overflowWrap: "break-word",
  },

  // ==========================================
  // LIST
  // ==========================================

  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "100%",
  },

  courseRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px 18px",
    backgroundColor: "#f8fafc",
    borderRadius: "10px",
    border: "1px solid #f1f5f9",
    width: "100%",
    boxSizing: "border-box",
  },

  listBadge: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "#e2e8f0",
    color: "#334155",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
    flexShrink: 0,
  },

  courseText: {
    margin: 0,
    fontSize: "14px",
    color: "#334155",
    fontWeight: "500",
    overflowWrap: "break-word",
  },

  // ==========================================
  // ROADMAP
  // ==========================================

  roadmapRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    padding: "16px 18px",
    backgroundColor: "#f8fafc",
    borderRadius: "10px",
    border: "1px solid #f1f5f9",
    width: "100%",
    boxSizing: "border-box",
  },

  roadmapBadge: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "700",
    flexShrink: 0,
  },

  roadmapContent: {
    flex: 1,
    minWidth: 0,
  },

  roadmapText: {
    margin: 0,
    fontSize: "14px",
    color: "#334155",
    lineHeight: "1.5",
    overflowWrap: "break-word",
  },
    // ==========================================
  // ROADMAP
  // ==========================================

  roadmapContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
  },

  roadmapCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    padding: "20px",
    backgroundColor: "#f8fafc",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    width: "100%",
    boxSizing: "border-box",
  },

  roadmapBadge: {
    width: "38px",
    height: "38px",
    minWidth: "38px",
    borderRadius: "10px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "700",
  },

  roadmapContent: {
    flex: 1,
    minWidth: 0,
  },

  roadmapHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "12px",
  },

  roadmapPhase: {
  margin: "0 0 6px",
  fontSize: "16px",
  fontWeight: "700",
  color: "#0f172a",
  lineHeight: "1.4",
},

roadmapDuration: {
  display: "inline-block",
  marginBottom: "12px",
  padding: "4px 10px",
  borderRadius: "20px",
  backgroundColor: "#eff6ff",
  color: "#2563eb",
  fontSize: "12px",
  fontWeight: "600",
},

actionItems: {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
},

actionItem: {
  display: "flex",
  alignItems: "flex-start",
  gap: "8px",
  fontSize: "13px",
  lineHeight: "1.5",
  color: "#475569",
},

actionCheck: {
  width: "18px",
  height: "18px",
  minWidth: "18px",
  borderRadius: "50%",
  backgroundColor: "#dcfce7",
  color: "#15803d",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "11px",
  fontWeight: "700",
  marginTop: "1px",
},
};

export default SkillGap;