import React, { useEffect, useState } from "react";
import { getAssessmentOverview } from "../../api/assessmentApi";

export default function Assessment() {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAssessmentOverview();

        console.log("Assessment API:", data);

        if (data.success) {
          setAssessment(data);
        } else {
          setError(
            data.message || "Failed to load assessment dashboard"
          );
        }
      } catch (error) {
        console.error(
          "Assessment API Error:",
          error.response?.data || error.message
        );

        setError(
          error.response?.data?.message ||
            "Failed to load assessment dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingIcon}>📊</div>

          <h2>Loading Assessments...</h2>

          <p>
            Preparing your assessment dashboard.
          </p>

          <div style={styles.loader}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorPage}>
        <div style={styles.error}>
          <div style={styles.errorIcon}>⚠️</div>

          <div>
            <h3>Unable to load assessments</h3>

            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return null;
  }

  const {
    user,
    summary,
    tests,
    results,
    recommendation,
  } = assessment;

  const handleStartTest = (test) => {
    console.log("Starting test:", test);

    // Later we will navigate to the actual test page.
    alert(`Starting ${test.title}`);
  };

  return (
    <div style={styles.container}>

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div style={styles.header}>

        <div style={styles.headerContent}>

          <div>
            <div style={styles.headerBadge}>
              🎯 CareerPilot Assessment Center
            </div>

            <h1 style={styles.headerTitle}>
              📊 Assessment Dashboard
            </h1>

            <p style={styles.headerText}>
              Welcome{" "}
              <strong>
                {user?.name || "User"}
              </strong>
              ! Evaluate your skills, measure your
              knowledge, and discover areas for improvement.
            </p>
          </div>

          <div style={styles.headerIcon}>
            📈
          </div>

        </div>

      </div>


      {/* ========================================= */}
      {/* SUMMARY */}
      {/* ========================================= */}

      <div style={styles.summary}>

        {/* Total */}

        <div
          style={{
            ...styles.summaryCard,
            borderTop: "4px solid #6366f1",
          }}
        >
          <div style={styles.statTop}>
            <div
              style={{
                ...styles.statIcon,
                background: "#eef2ff",
              }}
            >
              📚
            </div>

            <span style={styles.statLabel}>
              Total Assessments
            </span>
          </div>

          <h1
            style={{
              ...styles.statValue,
              color: "#4f46e5",
            }}
          >
            {summary.totalAssessments}
          </h1>

          <p style={styles.statDescription}>
            Available assessments
          </p>
        </div>


        {/* Completed */}

        <div
          style={{
            ...styles.summaryCard,
            borderTop: "4px solid #22c55e",
          }}
        >
          <div style={styles.statTop}>
            <div
              style={{
                ...styles.statIcon,
                background: "#ecfdf5",
              }}
            >
              ✅
            </div>

            <span style={styles.statLabel}>
              Completed
            </span>
          </div>

          <h1
            style={{
              ...styles.statValue,
              color: "#16a34a",
            }}
          >
            {summary.completed}
          </h1>

          <p style={styles.statDescription}>
            Tests completed
          </p>
        </div>


        {/* Average */}

        <div
          style={{
            ...styles.summaryCard,
            borderTop: "4px solid #3b82f6",
          }}
        >
          <div style={styles.statTop}>
            <div
              style={{
                ...styles.statIcon,
                background: "#eff6ff",
              }}
            >
              ⭐
            </div>

            <span style={styles.statLabel}>
              Average Score
            </span>
          </div>

          <h1
            style={{
              ...styles.statValue,
              color: "#2563eb",
            }}
          >
            {summary.averageScore}%
          </h1>

          <p style={styles.statDescription}>
            Overall performance
          </p>
        </div>


        {/* Rank */}

        <div
          style={{
            ...styles.summaryCard,
            borderTop: "4px solid #f59e0b",
          }}
        >
          <div style={styles.statTop}>
            <div
              style={{
                ...styles.statIcon,
                background: "#fffbeb",
              }}
            >
              🏆
            </div>

            <span style={styles.statLabel}>
              Rank
            </span>
          </div>

          <h1
            style={{
              ...styles.statValue,
              color: "#d97706",
            }}
          >
            {summary.rank}
          </h1>

          <p style={styles.statDescription}>
            Current performance rank
          </p>
        </div>

      </div>


      {/* ========================================= */}
      {/* AVAILABLE ASSESSMENTS */}
      {/* ========================================= */}

      <div style={styles.sectionHeader}>

        <div>
          <h2 style={styles.sectionTitle}>
            Available Assessments
          </h2>

          <p style={styles.sectionSubtitle}>
            Choose an assessment and test your current knowledge.
          </p>
        </div>

        <div style={styles.availableBadge}>
          {tests.length} Assessments
        </div>

      </div>


      {/* TEST CARDS */}

      <div style={styles.grid}>

        {tests.map((test, index) => (

          <div
            key={test.id}
            style={styles.card}
          >

            {/* Card Top */}

            <div style={styles.cardTop}>

              <div
                style={{
                  ...styles.testIcon,
                  background:
                    index % 3 === 0
                      ? "#eef2ff"
                      : index % 3 === 1
                      ? "#ecfdf5"
                      : "#fff7ed",
                }}
              >
                {index % 3 === 0
                  ? "💻"
                  : index % 3 === 1
                  ? "🧠"
                  : "🚀"}
              </div>

              <span
                style={{
                  ...styles.statusBadge,
                  color: test.color,
                  background: `${test.color}15`,
                }}
              >
                Available
              </span>

            </div>


            {/* Title */}

            <h3
              style={{
                ...styles.testTitle,
                color: test.color,
              }}
            >
              {test.title}
            </h3>


            {/* Description */}

            <p style={styles.description}>
              {test.description}
            </p>


            {/* Test Info */}

            <div style={styles.testInfo}>

              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>
                  ❓
                </span>

                <div>
                  <small>Questions</small>
                  <strong>
                    {test.questions}
                  </strong>
                </div>
              </div>


              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>
                  ⏱️
                </span>

                <div>
                  <small>Duration</small>
                  <strong>
                    {test.time} Min
                  </strong>
                </div>
              </div>

            </div>


            {/* Extra UI information */}

            <div style={styles.testFooter}>

              <span>
                📝 Skill Evaluation
              </span>

              <span>
                🎯 Career Growth
              </span>

            </div>


            {/* Button */}

            <button
              style={styles.button}
              onClick={() =>
                handleStartTest(test)
              }
            >
              Start Test
              <span style={styles.buttonArrow}>
                →
              </span>
            </button>

          </div>

        ))}

      </div>


      {/* ========================================= */}
      {/* RESULTS */}
      {/* ========================================= */}

      <div style={styles.results}>

        <div style={styles.resultsHeader}>

          <div>
            <h2 style={styles.sectionTitle}>
              📈 Previous Results
            </h2>

            <p style={styles.sectionSubtitle}>
              Track your assessment performance over time.
            </p>
          </div>

          <div style={styles.resultCount}>
            {results.length} Results
          </div>

        </div>


        {results.length === 0 ? (

          <div style={styles.noResults}>

            <div style={styles.noResultIcon}>
              📋
            </div>

            <h3>
              No assessments completed yet
            </h3>

            <p>
              Start your first assessment to see
              your results here.
            </p>

          </div>

        ) : (

          <div style={styles.resultList}>

            {results.map((item) => (

              <div
                key={item.name}
                style={styles.resultRow}
              >

                <div style={styles.resultName}>

                  <div style={styles.resultIcon}>
                    📝
                  </div>

                  <div>
                    <strong>
                      {item.name}
                    </strong>

                    <small>
                      Assessment Result
                    </small>
                  </div>

                </div>


                <div style={styles.scoreArea}>

                  <div style={styles.scoreBarBackground}>

                    <div
                      style={{
                        ...styles.scoreBar,
                        width: `${item.score}%`,
                      }}
                    />

                  </div>

                  <strong
                    style={{
                      color:
                        item.score >= 70
                          ? "#16a34a"
                          : item.score >= 40
                          ? "#d97706"
                          : "#dc2626",
                    }}
                  >
                    {item.score}%
                  </strong>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* ========================================= */}
      {/* AI RECOMMENDATION */}
      {/* ========================================= */}

      <div style={styles.ai}>

        <div style={styles.aiIcon}>
          🤖
        </div>

        <div style={styles.aiContent}>

          <div style={styles.aiTitleRow}>

            <h2>
              AI Recommendation
            </h2>

            <span style={styles.aiBadge}>
              CareerPilot AI
            </span>

          </div>

          <p>
            {recommendation}
          </p>

        </div>

      </div>

    </div>
  );
}


/* ================================================= */
/* STYLES */
/* ================================================= */

const styles = {

  container: {
    width: "100%",
    minHeight: "100vh",
    padding: "28px",
    background: "#f8fafc",
    boxSizing: "border-box",
  },


  /* Loading */

  loadingPage: {
    minHeight: "400px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8fafc",
  },

  loadingCard: {
    background: "#fff",
    padding: "40px",
    borderRadius: "18px",
    textAlign: "center",
    boxShadow: "0 8px 30px rgba(15,23,42,.08)",
  },

  loadingIcon: {
    fontSize: "42px",
    marginBottom: "10px",
  },

  loader: {
    width: "30px",
    height: "30px",
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #4f46e5",
    borderRadius: "50%",
    margin: "20px auto 0",
  },


  /* Error */

  errorPage: {
    padding: "30px",
    background: "#f8fafc",
  },

  error: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "18px 20px",
    background: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: "14px",
  },

  errorIcon: {
    fontSize: "28px",
  },


  /* Header */

  header: {
    background:
      "linear-gradient(135deg, #312e81 0%, #4f46e5 50%, #6366f1 100%)",
    color: "#fff",
    padding: "30px",
    borderRadius: "22px",
    marginBottom: "25px",
    boxShadow: "0 12px 35px rgba(79,70,229,.20)",
  },

  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
  },

  headerBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    background: "rgba(255,255,255,.15)",
    fontSize: "13px",
    marginBottom: "12px",
  },

  headerTitle: {
    margin: "0 0 10px",
    fontSize: "30px",
    fontWeight: "800",
  },

  headerText: {
    margin: 0,
    maxWidth: "700px",
    color: "#e0e7ff",
    lineHeight: "1.7",
  },

  headerIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,.15)",
    fontSize: "38px",
    flexShrink: 0,
  },


  /* Summary */

  summary: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "18px",
    marginBottom: "32px",
  },

  summaryCard: {
    minHeight: "155px",
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
    boxSizing: "border-box",
    boxShadow: "0 5px 20px rgba(15,23,42,.06)",
    border: "1px solid #e5e7eb",
  },

  statTop: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  statIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  statLabel: {
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "600",
  },

  statValue: {
    margin: "15px 0 3px",
    fontSize: "30px",
    fontWeight: "800",
  },

  statDescription: {
    margin: 0,
    fontSize: "12px",
    color: "#94a3b8",
  },


  /* Section Header */

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "18px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "21px",
    fontWeight: "750",
    color: "#0f172a",
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  availableBadge: {
    padding: "8px 14px",
    background: "#eef2ff",
    color: "#4f46e5",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "700",
  },


  /* Test Cards */

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "35px",
  },

  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 5px 20px rgba(15,23,42,.05)",
    transition: "all .2s ease",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },

  testIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
  },

  statusBadge: {
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
  },

  testTitle: {
    margin: "0 0 10px",
    fontSize: "19px",
    fontWeight: "750",
  },

  description: {
    minHeight: "48px",
    margin: "0 0 18px",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  testInfo: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "15px",
  },

  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "11px",
    background: "#f8fafc",
    borderRadius: "10px",
  },

  infoIcon: {
    fontSize: "17px",
  },

  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "11px",
    background: "#f8fafc",
    borderRadius: "10px",
  },

  testFooter: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderTop: "1px solid #f1f5f9",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "11px",
    color: "#64748b",
    marginBottom: "15px",
  },

  button: {
    width: "100%",
    padding: "12px 15px",
    border: "none",
    borderRadius: "10px",
    background: "#4f46e5",
    color: "#fff",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },

  buttonArrow: {
    fontSize: "18px",
  },


  /* Results */

  results: {
    background: "#fff",
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "24px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 5px 20px rgba(15,23,42,.05)",
  },

  resultsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  resultCount: {
    padding: "7px 12px",
    background: "#f1f5f9",
    borderRadius: "20px",
    color: "#475569",
    fontSize: "12px",
    fontWeight: "700",
  },

  resultList: {
    borderTop: "1px solid #f1f5f9",
  },

  resultRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    padding: "16px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  resultName: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  resultIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  scoreArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: "220px",
  },

  scoreBarBackground: {
    flex: 1,
    height: "7px",
    borderRadius: "10px",
    background: "#e2e8f0",
    overflow: "hidden",
  },

  scoreBar: {
    height: "100%",
    borderRadius: "10px",
    background: "#4f46e5",
  },


  /* Empty Results */

  noResults: {
    textAlign: "center",
    padding: "35px 20px",
    color: "#64748b",
  },

  noResultIcon: {
    fontSize: "40px",
    marginBottom: "10px",
  },


  /* AI */

  ai: {
    display: "flex",
    alignItems: "flex-start",
    gap: "18px",
    background:
      "linear-gradient(135deg, #eef2ff, #f5f3ff)",
    border: "1px solid #ddd6fe",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 5px 20px rgba(79,70,229,.06)",
  },

  aiIcon: {
    width: "52px",
    height: "52px",
    flexShrink: 0,
    borderRadius: "14px",
    background: "#4f46e5",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },

  aiContent: {
    flex: 1,
  },

  aiTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },

  aiTitleRowh2: {
    margin: 0,
    color: "#1e1b4b",
    fontSize: "20px",
  },

  aiBadge: {
    padding: "4px 9px",
    borderRadius: "20px",
    background: "#ddd6fe",
    color: "#5b21b6",
    fontSize: "10px",
    fontWeight: "700",
  },

};