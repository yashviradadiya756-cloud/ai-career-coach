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

      // 404 simply means no Skill Gap yet.
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
      <div style={styles.container}>
        <div style={styles.loadingState}>
          <div style={styles.spinner}></div>
          <h2 style={styles.loadingText}>Loading Skill Gap Analysis...</h2>
        </div>
      </div>
    );
  }

  // ==========================================
  // DATA
  // ==========================================

  const currentSkills = skillGap?.currentSkills || [];
  const missingSkills = skillGap?.missingSkills || [];
  const recommendedCourses = skillGap?.recommendedCourses || [];
  const roadmap = skillGap?.roadmap || [];
  const readinessScore = Number(skillGap?.readinessScore) || 0;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="skill-gap-page" style={styles.container}>
      {/* ================================== */}
      {/* HEADER */}
      {/* ================================== */}

      <div className="skill-gap-header" style={styles.header}>
        <h1 style={styles.headerTitle}>🎯 Skill Gap Analysis</h1>
        <p style={styles.headerSubtitle}>
          Identify the skills you already have and discover what you need to
          learn for your target career.
        </p>
      </div>

      {/* ================================== */}
      {/* ERROR */}
      {/* ================================== */}

      {error && (
        <div className="skill-gap-error" style={styles.errorBox}>
          ⚠️ {error}
        </div>
      )}

      {/* ================================== */}
      {/* TARGET ROLE */}
      {/* ================================== */}

      <div className="skill-gap-input-card" style={styles.card}>
        <h2 style={styles.cardTitle}>Target Career Role</h2>

        <div className="skill-gap-input-row" style={styles.inputRow}>
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
              cursor: analyzing ? "not-allowed" : "pointer",
            }}
          >
            {analyzing ? "Analyzing..." : "Analyze Skill Gap"}
          </button>
        </div>
      </div>

      {/* ================================== */}
      {/* NO DATA */}
      {/* ================================== */}

      {!skillGap ? (
        <div className="skill-gap-empty" style={styles.emptyCard}>
          <h2 style={styles.emptyTitle}>No Skill Gap Analysis Found</h2>
          <p style={styles.emptyText}>
            Enter your target role and click "Analyze Skill Gap".
          </p>
        </div>
      ) : (
        <>
          {/* ================================== */}
          {/* TARGET ROLE + SCORE */}
          {/* ================================== */}

          <div className="skill-gap-overview" style={styles.overviewGrid}>
            <div className="skill-gap-role-card" style={styles.overviewCard}>
              <h3 style={styles.cardMetaTitle}>Target Role</h3>
              <h2 style={styles.roleTitle}>{skillGap.targetRole}</h2>
            </div>

            <div className="skill-gap-score-card" style={styles.overviewCard}>
              <h3 style={styles.cardMetaTitle}>Readiness Score</h3>
              <h1 style={styles.scoreText}>{readinessScore}%</h1>
            </div>
          </div>

          {/* ================================== */}
          {/* CURRENT SKILLS */}
          {/* ================================== */}

          <div className="skill-section" style={styles.card}>
            <div className="skill-section-header" style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>✅ Current Skills</h2>
              <span style={styles.badgeSuccess}>{currentSkills.length}</span>
            </div>

            {currentSkills.length === 0 ? (
              <p style={styles.emptyText}>No current skills found.</p>
            ) : (
              <div className="skill-list" style={styles.skillTagGrid}>
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

          {/* ================================== */}
          {/* MISSING SKILLS */}
          {/* ================================== */}

          <div className="skill-section" style={styles.card}>
            <div className="skill-section-header" style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>⚠️ Missing Skills</h2>
              <span style={styles.badgeDanger}>{missingSkills.length}</span>
            </div>

            {missingSkills.length === 0 ? (
              <p style={styles.successText}>
                🎉 No major skill gaps found!
              </p>
            ) : (
              <div className="skill-list" style={styles.skillTagGrid}>
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

          {/* ================================== */}
          {/* RECOMMENDED COURSES */}
          {/* ================================== */}

          {/* <div className="skill-section" style={styles.card}>
            <h2 style={styles.sectionTitle}>📚 Recommended Courses</h2>

            {recommendedCourses.length === 0 ? (
              <p style={styles.emptyText}>No recommended courses found.</p>
            ) : (
              <div className="course-list" style={styles.listContainer}>
                {recommendedCourses.map((course, index) => (
                  <div
                    className="course-item"
                    key={index}
                    style={styles.courseRow}
                  >
                    <span style={styles.listBadge}>{index + 1}</span>
                    <p style={styles.courseText}>{course}</p>
                  </div>
                ))}
              </div>
            )}
          </div> */}

          {/* ================================== */}
          {/* ROADMAP */}
          {/* ================================== */}

          {/* <div className="skill-section" style={styles.card}>
            <h2 style={styles.sectionTitle}>🗺️ Recommended Roadmap</h2>

            {roadmap.length === 0 ? (
              <p style={styles.emptyText}>No roadmap available.</p>
            ) : (
              <div className="roadmap-list" style={styles.listContainer}>
                {roadmap.map((step, index) => (
                  <div
                    className="roadmap-item"
                    key={index}
                    style={styles.roadmapRow}
                  >
                    <div className="roadmap-number" style={styles.roadmapBadge}>
                      {index + 1}
                    </div>
                    <div className="roadmap-content" style={styles.roadmapContent}>
                      <p style={styles.roadmapText}>{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div> */}
        </>
      )}
    </div>
  );
};

// ==========================================
// INLINE STYLES
// ==========================================

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "32px 20px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: "#0f172a",
  },

  loadingState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 20px",
  },

  loadingText: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#475569",
    marginTop: "16px",
  },

  header: {
    backgroundColor: "#ffffff",
    padding: "28px 32px",
    borderRadius: "16px",
    marginBottom: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
    border: "1px solid #e2e8f0",
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

  errorBox: {
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    padding: "14px 20px",
    borderRadius: "12px",
    border: "1px solid #fecaca",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "24px",
  },

  card: {
    backgroundColor: "#ffffff",
    padding: "28px 32px",
    borderRadius: "16px",
    marginBottom: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
    border: "1px solid #e2e8f0",
  },

  cardTitle: {
    margin: "0 0 16px 0",
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
  },

  inputRow: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  input: {
    flex: 1,
    minWidth: "260px",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    color: "#0f172a",
    outline: "none",
    backgroundColor: "#ffffff",
  },

  primaryButton: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "12px 24px",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    transition: "background-color 0.2s ease",
  },

  emptyCard: {
    backgroundColor: "#ffffff",
    padding: "48px 32px",
    borderRadius: "16px",
    textAlign: "center",
    border: "1px dashed #cbd5e1",
    marginBottom: "24px",
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

  overviewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },

  overviewCard: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
    border: "1px solid #e2e8f0",
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
  },

  scoreText: {
    margin: 0,
    fontSize: "36px",
    fontWeight: "800",
    color: "#2563eb",
    letterSpacing: "-0.03em",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },

  sectionTitle: {
    margin: "0 0 16px 0",
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
  },

  badgeSuccess: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "700",
  },

  badgeDanger: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "700",
  },

  skillTagGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },

  currentSkillTag: {
    backgroundColor: "#f0fdf4",
    color: "#166534",
    border: "1px solid #bbf7d0",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
  },

  missingSkillTag: {
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
  },

  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  courseRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px 18px",
    backgroundColor: "#f8fafc",
    borderRadius: "10px",
    border: "1px solid #f1f5f9",
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
  },

  roadmapRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    padding: "16px 18px",
    backgroundColor: "#f8fafc",
    borderRadius: "10px",
    border: "1px solid #f1f5f9",
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
  },

  roadmapText: {
    margin: 0,
    fontSize: "14px",
    color: "#334155",
    lineHeight: "1.5",
  },
};

export default SkillGap;