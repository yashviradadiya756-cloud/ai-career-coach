import React, { useEffect, useState } from "react";
import { getProgress, updateProgress } from "../../api/progressApi";

export default function Progress() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError("");

      // First calculate/update latest progress
      await updateProgress();

      // Then get updated progress
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

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          Loading your progress...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          {error}
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          No progress data found.
        </div>
      </div>
    );
  }

  const subjects = [
    {
      name: "Resume",
      progress: progress.resumeScore || 0,
      color: "#2563eb",
    },
    {
      name: "Interview",
      progress: progress.interviewScore || 0,
      color: "#16a34a",
    },
    {
      name: "Roadmap",
      progress: progress.roadmapCompleted || 0,
      color: "#f59e0b",
    },
    {
      name: "Learning",
      progress: progress.learningCompleted || 0,
      color: "#dc2626",
    },
  ];

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h1>📈 Progress Dashboard</h1>
        <p>
          Track your learning performance and career growth.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={styles.cards}>

        <div style={styles.card}>
          <h3>Overall Progress</h3>
          <h1 style={{ color: "#2563eb" }}>
            {progress.overallProgress || 0}%
          </h1>
        </div>

        <div style={styles.card}>
          <h3>Resume Score</h3>
          <h1 style={{ color: "#16a34a" }}>
            {progress.resumeScore || 0}%
          </h1>
        </div>

        <div style={styles.card}>
          <h3>Interview Score</h3>
          <h1 style={{ color: "#f59e0b" }}>
            {progress.interviewScore || 0}%
          </h1>
        </div>

        <div style={styles.card}>
          <h3>Roadmap</h3>
          <h1 style={{ color: "#dc2626" }}>
            {progress.roadmapCompleted || 0}%
          </h1>
        </div>

      </div>

      {/* Learning Progress */}
      <div style={styles.section}>

        <h2>📊 Career Progress</h2>

        {subjects.map((item, index) => (
          <div
            key={index}
            style={{ marginBottom: 20 }}
          >

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <strong>{item.name}</strong>

              <span>
                {item.progress}%
              </span>
            </div>

            <div style={styles.progress}>

              <div
                style={{
                  width: `${item.progress}%`,
                  background: item.color,
                  height: "100%",
                  borderRadius: "20px",
                  transition: "width 0.5s ease",
                }}
              />

            </div>

          </div>
        ))}

      </div>

      {/* Weekly Activity */}
      <div style={styles.section}>

        <h2>🔥 Weekly Activity</h2>

        <ul style={styles.activityList}>
          <li>Resume analysis completed</li>
          <li>Interview performance tracked</li>
          <li>Career roadmap updated</li>
          <li>Learning progress calculated</li>
        </ul>

      </div>

      {/* AI Suggestion */}
      <div style={styles.section}>

        <h2>🤖 AI Suggestion</h2>

        <p>
          Continue improving your weaker areas.
          Focus on interview practice, roadmap activities,
          and completing your recommended learning resources.
        </p>

      </div>

    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    background: "#f5f7fb",
    minHeight: "100vh",
  },

  header: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "20px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    textAlign: "center",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
  },

  section: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
  },

  progress: {
    width: "100%",
    height: "12px",
    background: "#ddd",
    borderRadius: "20px",
    marginTop: "8px",
    overflow: "hidden",
  },

  activityList: {
    lineHeight: "2",
  },

  loading: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
  },

  error: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
    color: "#dc2626",
  },
};