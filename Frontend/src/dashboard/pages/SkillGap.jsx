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

      console.log("Skill Gap response:", response);

      if (response?.success && response?.skillGap) {
        setSkillGap(response.skillGap);
        setTargetRole(response.skillGap.targetRole || "");
      } else {
        setSkillGap(null);
      }
    } catch (error) {
      console.error(
        "Skill Gap API Error:",
        error.response?.data || error.message
      );

      // 404 means no Skill Gap exists yet
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
        setError("Please enter a target career role.");
        return;
      }

      setAnalyzing(true);
      setError("");

      console.log("Analyzing Skill Gap for:", targetRole);

      const response = await analyzeSkillGap(targetRole.trim());

      console.log("Skill Gap Analyze Result:", response);

      if (response?.success && response?.skillGap) {
        setSkillGap(response.skillGap);
      } else {
        setError(
          response?.message || "Skill Gap Analysis failed."
        );
      }
    } catch (error) {
      console.error(
        "Skill Gap Analyze Error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to analyze Skill Gap."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div style={styles.loadingState}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>
          Loading Skill Gap Analysis...
        </p>
      </div>
    );
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
  // UI
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
        <h1 style={styles.headerTitle}>
          🎯 Skill Gap Analysis
        </h1>

        <p style={styles.headerSubtitle}>
          Identify the skills you already have and discover
          what you need to learn for your target career.
        </p>
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

        <div style={styles.inputRow}>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="Example: Full Stack Developer"
            style={styles.input}
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
            {analyzing
              ? "Analyzing..."
              : "Analyze Skill Gap"}
          </button>
        </div>
      </div>

      {/* ==================================
          NO DATA
      ================================== */}
      {!skillGap ? (
        <div style={styles.emptyCard}>
          <h2 style={styles.emptyTitle}>
            No Skill Gap Analysis Found
          </h2>

          <p style={styles.emptyText}>
            Enter your target role and click
            "Analyze Skill Gap".
          </p>
        </div>
      ) : (
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
              </div>

              <div style={styles.listContainer}>
                {roadmap.map((step, index) => (
                  <div
                    className="roadmap-item"
                    key={index}
                    style={styles.roadmapRow}
                  >
                    <div style={styles.roadmapBadge}>
                      {index + 1}
                    </div>

                    <div style={styles.roadmapContent}>
                      <p style={styles.roadmapText}>
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ==================================
          RESPONSIVE CSS
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

          @media (max-width: 768px) {
            .skill-gap-container {
              padding: 20px 16px !important;
            }

            .skill-gap-container .input-row {
              flex-direction: column;
              align-items: stretch;
            }
          }

          @media (max-width: 480px) {
            .skill-gap-container {
              padding: 16px 12px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

// ==========================================
// INLINE STYLES
// ==========================================
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
  // LOADING
  // ==========================================
  loadingState: {
    width: "100%",
    minHeight: "60vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    boxSizing: "border-box",
  },

  loadingSpinner: {
    width: "36px",
    height: "36px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  loadingText: {
    fontSize: "17px",
    fontWeight: "600",
    color: "#475569",
    marginTop: "16px",
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
    margin: "0 0 8px 0",
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
    margin: "0 0 16px 0",
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
  },

  // ==========================================
  // INPUT
  // ==========================================
  inputRow: {
    display: "flex",
    width: "100%",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
    boxSizing: "border-box",
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

  emptyTitle: {
    margin: "0 0 8px 0",
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
    margin: "0 0 8px 0",
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
  // SECTION HEADER
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
};

export default SkillGap;