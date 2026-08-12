import React, { useEffect, useState } from "react";
import { getProgress, updateProgress } from "../../api/progressApi";

export default function Progress() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD PROGRESS
  // ==========================================

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError("");

      // Update latest progress first
      await updateProgress();

      // Get updated progress
      const response = await getProgress();

      console.log("Progress API response:", response.data);

      setProgress(response.data.progress);
    } catch (error) {
      console.error(
        "Progress API Error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load progress."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>

          <h3>Loading Progress...</h3>

          <p>
            Please wait while we calculate your career progress.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>⚠️</div>

          <h2>Unable to Load Progress</h2>

          <p>{error}</p>

          <button
            onClick={loadProgress}
            style={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // NO DATA
  // ==========================================

  if (!progress) {
    return (
      <div style={styles.page}>
        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>📊</div>

          <h2>No Progress Data Found</h2>

          <p>
            Start using CareerPilot features to build
            your career progress.
          </p>

          <button
            onClick={loadProgress}
            style={styles.retryButton}
          >
            Refresh Progress
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // SAFE VALUES
  // ==========================================

  const overallProgress =
    Number(progress.overallProgress) || 0;

  const resumeScore =
    Number(progress.resumeScore) || 0;

  const interviewScore =
    Number(progress.interviewScore) || 0;

  const roadmapCompleted =
    Number(progress.roadmapCompleted) || 0;

  const learningCompleted =
    Number(progress.learningCompleted) || 0;

  // ==========================================
  // CAREER PERFORMANCE DATA
  // ==========================================

  const performanceData = [
    {
      name: "Resume",
      value: resumeScore,
      icon: "📄",
      label: "Resume Score",
    },
    {
      name: "Interview",
      value: interviewScore,
      icon: "🎤",
      label: "Interview Score",
    },
    {
      name: "Roadmap",
      value: roadmapCompleted,
      icon: "🗺️",
      label: "Roadmap Progress",
    },
    {
      name: "Learning",
      value: learningCompleted,
      icon: "📚",
      label: "Learning Progress",
    },
  ];

  // ==========================================
  // FIND BEST AREA
  // ==========================================

  const bestPerformance = performanceData.reduce(
    (best, current) =>
      current.value > best.value ? current : best,
    performanceData[0]
  );

  // ==========================================
  // FIND WEAKER AREA
  // ==========================================

  const weakestPerformance = performanceData.reduce(
    (weakest, current) =>
      current.value < weakest.value
        ? current
        : weakest,
    performanceData[0]
  );

  // ==========================================
  // STATUS
  // ==========================================

  const getPerformanceStatus = (value) => {
    if (value >= 80) {
      return "Excellent";
    }

    if (value >= 60) {
      return "Good";
    }

    if (value >= 40) {
      return "Average";
    }

    return "Needs Work";
  };

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div style={styles.page}>

      {/* ======================================
          HEADER
      ====================================== */}

      <div style={styles.header}>

        <div>
          <div style={styles.headerBadge}>
            📈 CAREER ANALYTICS
          </div>

          <h1 style={styles.title}>
            Progress Dashboard
          </h1>

          <p style={styles.subtitle}>
            Track your career development and see
            how you are progressing across different areas.
          </p>
        </div>

        <button
          onClick={loadProgress}
          style={styles.refreshButton}
        >
          ↻ Refresh
        </button>

      </div>


      {/* ======================================
          TOP KPI CARDS
      ====================================== */}

      <div style={styles.kpiGrid}>

        <div style={styles.kpiCard}>
          <div style={styles.kpiIconBlue}>
            🎯
          </div>

          <div>
            <p style={styles.kpiLabel}>
              Overall Progress
            </p>

            <h2 style={styles.kpiValueBlue}>
              {overallProgress}%
            </h2>

            <span style={styles.kpiSmallText}>
              Career readiness
            </span>
          </div>
        </div>


        <div style={styles.kpiCard}>
          <div style={styles.kpiIconGreen}>
            📄
          </div>

          <div>
            <p style={styles.kpiLabel}>
              Resume Score
            </p>

            <h2 style={styles.kpiValueGreen}>
              {resumeScore}%
            </h2>

            <span style={styles.kpiSmallText}>
              Resume strength
            </span>
          </div>
        </div>


        <div style={styles.kpiCard}>
          <div style={styles.kpiIconOrange}>
            🎤
          </div>

          <div>
            <p style={styles.kpiLabel}>
              Interview Score
            </p>

            <h2 style={styles.kpiValueOrange}>
              {interviewScore}%
            </h2>

            <span style={styles.kpiSmallText}>
              Interview readiness
            </span>
          </div>
        </div>


        <div style={styles.kpiCard}>
          <div style={styles.kpiIconPurple}>
            🗺️
          </div>

          <div>
            <p style={styles.kpiLabel}>
              Roadmap
            </p>

            <h2 style={styles.kpiValuePurple}>
              {roadmapCompleted}%
            </h2>

            <span style={styles.kpiSmallText}>
              Roadmap completed
            </span>
          </div>
        </div>

      </div>


      {/* ======================================
          MAIN ANALYTICS GRID
      ====================================== */}

      <div style={styles.analyticsGrid}>

        {/* ====================================
            CAREER PERFORMANCE
        ==================================== */}

        <div style={styles.performanceCard}>

          <div style={styles.cardHeader}>

            <div>
              <h2 style={styles.cardTitle}>
                Career Performance
              </h2>

              <p style={styles.cardSubtitle}>
                Your progress across major career areas
              </p>
            </div>

            <div style={styles.performanceBadge}>
              4 Areas
            </div>

          </div>


          {/* VERTICAL BAR CHART */}

          <div style={styles.chartContainer}>

            <div style={styles.chartArea}>

              {/* Y AXIS */}

              <div style={styles.yAxis}>

                <span>100%</span>
                <span>80%</span>
                <span>60%</span>
                <span>40%</span>
                <span>20%</span>
                <span>0%</span>

              </div>


              {/* CHART */}

              <div style={styles.chart}>

                {/* GRID LINES */}

                <div
                  style={{
                    ...styles.gridLine,
                    bottom: "100%",
                  }}
                />

                <div
                  style={{
                    ...styles.gridLine,
                    bottom: "80%",
                  }}
                />

                <div
                  style={{
                    ...styles.gridLine,
                    bottom: "60%",
                  }}
                />

                <div
                  style={{
                    ...styles.gridLine,
                    bottom: "40%",
                  }}
                />

                <div
                  style={{
                    ...styles.gridLine,
                    bottom: "20%",
                  }}
                />

                {/* BARS */}

                {performanceData.map(
                  (item, index) => {

                    const barHeight =
                      Math.max(
                        item.value,
                        item.value > 0 ? 5 : 0
                      );

                    return (
                      <div
                        key={index}
                        style={styles.barColumn}
                      >

                        {/* VALUE */}

                        <div style={styles.barValue}>
                          {item.value}%
                        </div>


                        {/* BAR */}

                        <div style={styles.barTrack}>

                          <div
                            style={{
                              ...styles.bar,
                              height: `${barHeight}%`,
                              background:
                                index === 0
                                  ? "linear-gradient(180deg,#60a5fa,#2563eb)"
                                  : index === 1
                                  ? "linear-gradient(180deg,#4ade80,#16a34a)"
                                  : index === 2
                                  ? "linear-gradient(180deg,#fbbf24,#f59e0b)"
                                  : "linear-gradient(180deg,#c084fc,#9333ea)",
                            }}
                          >

                            <div
                              style={styles.barGlow}
                            />

                          </div>

                        </div>


                        {/* LABEL */}

                        <div style={styles.barLabel}>
                          <div style={styles.barIcon}>
                            {item.icon}
                          </div>

                          <strong>
                            {item.name}
                          </strong>
                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

          </div>


          {/* CHART LEGEND */}

          <div style={styles.chartLegend}>

            {performanceData.map(
              (item, index) => (
                <div
                  key={index}
                  style={styles.legendItem}
                >

                  <span
                    style={{
                      ...styles.legendDot,
                      background:
                        index === 0
                          ? "#2563eb"
                          : index === 1
                          ? "#16a34a"
                          : index === 2
                          ? "#f59e0b"
                          : "#9333ea",
                    }}
                  />

                  <span>
                    {item.name}
                  </span>

                </div>
              )
            )}

          </div>

        </div>


        {/* ====================================
            PERFORMANCE SUMMARY
        ==================================== */}

        <div style={styles.summaryCard}>

          <h2 style={styles.cardTitle}>
            Performance Summary
          </h2>

          <p style={styles.cardSubtitle}>
            Quick overview of your career journey
          </p>


          {/* BEST AREA */}

          <div style={styles.summaryBoxGreen}>

            <div style={styles.summaryIcon}>
              🏆
            </div>

            <div style={styles.summaryContent}>

              <span style={styles.summaryLabel}>
                Strongest Area
              </span>

              <h3>
                {bestPerformance.icon}{" "}
                {bestPerformance.name}
              </h3>

              <p>
                {bestPerformance.value}% performance
              </p>

            </div>

          </div>


          {/* WEAK AREA */}

          <div style={styles.summaryBoxOrange}>

            <div style={styles.summaryIcon}>
              💡
            </div>

            <div style={styles.summaryContent}>

              <span style={styles.summaryLabel}>
                Focus Area
              </span>

              <h3>
                {weakestPerformance.icon}{" "}
                {weakestPerformance.name}
              </h3>

              <p>
                {weakestPerformance.value}% performance
              </p>

            </div>

          </div>


          {/* OVERALL */}

          <div style={styles.overallBox}>

            <div style={styles.overallCircle}>

              <span>
                {overallProgress}%
              </span>

            </div>

            <div>

              <h3 style={{ margin: 0 }}>
                Overall Career Progress
              </h3>

              <p style={styles.overallText}>
                {getPerformanceStatus(
                  overallProgress
                )}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ======================================
          WEEKLY ACTIVITY
      ====================================== */}

      <div style={styles.activityCard}>

        <div>
          <h2 style={styles.cardTitle}>
            🔥 Career Activity
          </h2>

          <p style={styles.cardSubtitle}>
            Keep working consistently to improve your score.
          </p>
        </div>


        <div style={styles.activityGrid}>

          <div style={styles.activityItem}>
            <span>📄</span>

            <div>
              <strong>
                Resume Analysis
              </strong>

              <small>
                Resume performance tracked
              </small>
            </div>

            <div style={styles.completed}>
              ✓
            </div>
          </div>


          <div style={styles.activityItem}>
            <span>🎤</span>

            <div>
              <strong>
                Interview Practice
              </strong>

              <small>
                Interview performance tracked
              </small>
            </div>

            <div style={styles.completed}>
              ✓
            </div>
          </div>


          <div style={styles.activityItem}>
            <span>🗺️</span>

            <div>
              <strong>
                Career Roadmap
              </strong>

              <small>
                Roadmap progress calculated
              </small>
            </div>

            <div style={styles.completed}>
              ✓
            </div>
          </div>


          <div style={styles.activityItem}>
            <span>📚</span>

            <div>
              <strong>
                Learning
              </strong>

              <small>
                Learning progress calculated
              </small>
            </div>

            <div style={styles.completed}>
              ✓
            </div>
          </div>

        </div>

      </div>


      {/* ======================================
          AI SUGGESTION
      ====================================== */}

      <div style={styles.aiCard}>

        <div style={styles.aiIcon}>
          🤖
        </div>

        <div style={{ flex: 1 }}>

          <h2 style={styles.aiTitle}>
            AI Career Suggestion
          </h2>

          <p style={styles.aiText}>

            Your strongest area is{" "}
            <strong>
              {bestPerformance.name}
            </strong>
            . Focus more on{" "}
            <strong>
              {weakestPerformance.name}
            </strong>{" "}
            to create a balanced career profile.

          </p>

        </div>

      </div>

    </div>
  );
}


// ==========================================
// STYLES
// ==========================================

const styles = {

  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "24px",
    boxSizing: "border-box",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    color: "#111827",
  },

  // HEADER

  header: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "24px 28px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 4px 15px rgba(15,23,42,0.05)",
  },

  headerBadge: {
    fontSize: "11px",
    fontWeight: "800",
    color: "#2563eb",
    letterSpacing: "1px",
    marginBottom: "6px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  refreshButton: {
    border: "1px solid #dbeafe",
    background: "#eff6ff",
    color: "#2563eb",
    borderRadius: "9px",
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },


  // KPI

  kpiGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "20px",
  },

  kpiCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "15px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    boxShadow:
      "0 4px 15px rgba(15,23,42,0.04)",
  },

  kpiIconBlue: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eff6ff",
    fontSize: "22px",
  },

  kpiIconGreen: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ecfdf5",
    fontSize: "22px",
  },

  kpiIconOrange: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fffbeb",
    fontSize: "22px",
  },

  kpiIconPurple: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#faf5ff",
    fontSize: "22px",
  },

  kpiLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "600",
  },

  kpiValueBlue: {
    margin: "4px 0 0",
    fontSize: "25px",
  },

  kpiValueGreen: {
    margin: "4px 0 0",
    fontSize: "25px",
    color: "#16a34a",
  },

  kpiValueOrange: {
    margin: "4px 0 0",
    fontSize: "25px",
    color: "#f59e0b",
  },

  kpiValuePurple: {
    margin: "4px 0 0",
    fontSize: "25px",
    color: "#9333ea",
  },

  kpiSmallText: {
    color: "#94a3b8",
    fontSize: "11px",
  },


  // ANALYTICS

  analyticsGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 2fr) minmax(280px, 1fr)",
    gap: "20px",
    marginBottom: "20px",
  },

  performanceCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "24px",
    boxShadow:
      "0 4px 15px rgba(15,23,42,0.04)",
    minWidth: 0,
  },

  summaryCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "24px",
    boxShadow:
      "0 4px 15px rgba(15,23,42,0.04)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
    marginBottom: "10px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "19px",
    fontWeight: "750",
    color: "#111827",
  },

  cardSubtitle: {
    margin: "5px 0 0",
    color: "#94a3b8",
    fontSize: "13px",
  },

  performanceBadge: {
    background: "#f1f5f9",
    color: "#475569",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
  },


  // VERTICAL CHART

  chartContainer: {
    marginTop: "15px",
    padding: "10px 5px 0",
  },

  chartArea: {
    height: "350px",
    display: "flex",
    position: "relative",
  },

  yAxis: {
    width: "42px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    paddingBottom: "72px",
    paddingTop: "5px",
    color: "#94a3b8",
    fontSize: "10px",
    textAlign: "right",
    paddingRight: "8px",
    boxSizing: "border-box",
  },

  chart: {
    flex: 1,
    position: "relative",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "space-around",
    gap: "18px",
    borderBottom: "1px solid #cbd5e1",
  },

  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: "1px",
    background: "#eef2f7",
    zIndex: 0,
  },

  barColumn: {
    flex: 1,
    maxWidth: "90px",
    minWidth: "55px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 1,
  },

  barValue: {
    height: "25px",
    fontSize: "13px",
    fontWeight: "800",
    color: "#334155",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  barTrack: {
    width: "48px",
    height: "240px",
    background:
      "repeating-linear-gradient(to top, #f8fafc 0px, #f8fafc 47px, #f1f5f9 48px)",
    borderRadius: "10px 10px 0 0",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },

  bar: {
    width: "100%",
    minHeight: "4px",
    borderRadius: "9px 9px 0 0",
    position: "relative",
    transition:
      "height 0.7s cubic-bezier(.4,0,.2,1)",
    boxShadow:
      "0 -5px 15px rgba(37,99,235,0.08)",
  },

  barGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "5px",
    background: "rgba(255,255,255,0.35)",
    borderRadius: "10px",
  },

  barLabel: {
    height: "60px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "3px",
    color: "#334155",
    fontSize: "12px",
  },

  barIcon: {
    fontSize: "15px",
  },

  chartLegend: {
    display: "flex",
    flexWrap: "wrap",
    gap: "18px",
    borderTop: "1px solid #f1f5f9",
    marginTop: "10px",
    paddingTop: "15px",
    color: "#64748b",
    fontSize: "12px",
  },

  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  legendDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },


  // SUMMARY

  summaryBoxGreen: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px",
    background: "#f0fdf4",
    border: "1px solid #dcfce7",
    borderRadius: "12px",
    marginTop: "20px",
  },

  summaryBoxOrange: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px",
    background: "#fffbeb",
    border: "1px solid #fef3c7",
    borderRadius: "12px",
    marginTop: "12px",
  },

  summaryIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    flexShrink: 0,
  },

  summaryContent: {
    minWidth: 0,
  },

  summaryLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "11px",
    marginBottom: "3px",
  },

  overallBox: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginTop: "15px",
    padding: "15px",
    borderRadius: "12px",
    background: "#f8fafc",
  },

  overallCircle: {
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    background:
      "conic-gradient(#2563eb 0deg, #2563eb 250deg, #e2e8f0 250deg, #e2e8f0 360deg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  overallCircleInner: {
    background: "#ffffff",
  },

  overallText: {
    margin: "4px 0 0",
    color: "#16a34a",
    fontSize: "13px",
    fontWeight: "700",
  },


  // DETAILS

  detailsCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow:
      "0 4px 15px rgba(15,23,42,0.04)",
  },

  detailGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },

  detailItem: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "16px",
  },

  detailTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },

  detailName: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  detailIcon: {
    width: "38px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    background: "#ffffff",
    fontSize: "18px",
  },


  detailPercent: {
    fontSize: "17px",
  },

  miniTrack: {
    width: "100%",
    height: "7px",
    background: "#e2e8f0",
    borderRadius: "20px",
    marginTop: "14px",
    overflow: "hidden",
  },

  miniBar: {
    height: "100%",
    borderRadius: "20px",
    transition: "width 0.6s ease",
  },

  detailBottom: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px",
    color: "#94a3b8",
    fontSize: "11px",
  },


  // ACTIVITY

  activityCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow:
      "0 4px 15px rgba(15,23,42,0.04)",
  },

  activityGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "12px",
    marginTop: "20px",
  },

  activityItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    background: "#f8fafc",
    borderRadius: "10px",
    border: "1px solid #f1f5f9",
  },

  completed: {
    marginLeft: "auto",
    width: "25px",
    height: "25px",
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },


  // AI

  aiCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    background:
      "linear-gradient(135deg,#eff6ff,#f8fafc)",
    border: "1px solid #dbeafe",
    borderRadius: "16px",
    padding: "22px",
    marginBottom: "20px",
  },

  aiIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    flexShrink: 0,
  },

  aiTitle: {
    margin: 0,
    fontSize: "17px",
  },

  aiText: {
    margin: "7px 0 0",
    color: "#475569",
    fontSize: "14px",
    lineHeight: "1.6",
  },


  // LOADING / ERROR

  loadingCard: {
    maxWidth: "500px",
    margin: "100px auto",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.06)",
  },

  spinner: {
    width: "38px",
    height: "38px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    margin: "0 auto 20px",
    animation: "spin 1s linear infinite",
  },

  errorCard: {
    maxWidth: "500px",
    margin: "100px auto",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
    color: "#991b1b",
  },

  errorIcon: {
    fontSize: "45px",
  },

  emptyCard: {
    maxWidth: "500px",
    margin: "100px auto",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "50px",
  },

  retryButton: {
    marginTop: "15px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    padding: "11px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
  },
};