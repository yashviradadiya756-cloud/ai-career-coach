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
      <div style={styles.loading}>
        <h3>Loading your assessments...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.error}>
        <p>{error}</p>
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

      {/* Header */}
      <div style={styles.header}>
        <h1>📊 Assessment Dashboard</h1>

        <p>
          Welcome {user?.name || "User"}! Evaluate your skills
          and discover areas for improvement.
        </p>
      </div>

      {/* Summary Cards */}
      <div style={styles.summary}>

        <div style={styles.summaryCard}>
          <h3>Total Assessments</h3>
          <h1>{summary.totalAssessments}</h1>
        </div>

        <div style={styles.summaryCard}>
          <h3>Completed</h3>

          <h1 style={{ color: "#16a34a" }}>
            {summary.completed}
          </h1>
        </div>

        <div style={styles.summaryCard}>
          <h3>Average Score</h3>

          <h1 style={{ color: "#2563eb" }}>
            {summary.averageScore}%
          </h1>
        </div>

        <div style={styles.summaryCard}>
          <h3>Rank</h3>

          <h1 style={{ color: "#f59e0b" }}>
            {summary.rank}
          </h1>
        </div>

      </div>

      {/* Available Assessments */}
      <h2 style={{ marginBottom: 20 }}>
        Available Assessments
      </h2>

      <div style={styles.grid}>

        {tests.map((test) => (
          <div
            key={test.id}
            style={styles.card}
          >

            <h3 style={{ color: test.color }}>
              {test.title}
            </h3>

            <p>{test.description}</p>

            <p>
              <strong>
                {test.questions} Questions
              </strong>
            </p>

            <p>
              {test.time} Min
            </p>

            <button
              style={styles.button}
              onClick={() => handleStartTest(test)}
            >
              Start Test
            </button>

          </div>
        ))}

      </div>

      {/* Results */}
      <div style={styles.results}>

        <h2>📈 Previous Results</h2>

        {results.length === 0 ? (
          <p style={styles.noResults}>
            No assessments completed yet.
            Start your first assessment to see your results here.
          </p>
        ) : (
          results.map((item) => (
            <div
              key={item.name}
              style={styles.resultRow}
            >
              <span>{item.name}</span>

              <strong>{item.score}%</strong>
            </div>
          ))
        )}

      </div>

      {/* AI Recommendation */}
      <div style={styles.ai}>

        <h2>🤖 AI Recommendation</h2>

        <p>{recommendation}</p>

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

  loading: {
    padding: "40px",
    textAlign: "center",
  },

  error: {
    margin: "20px",
    padding: "20px",
    background: "#fee2e2",
    color: "#b91c1c",
    borderRadius: "10px",
  },

  header: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
  },

  summary: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "20px",
    marginBottom: "30px",
  },

  summaryCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(260px,1fr))",
    gap: "20px",
  },

  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
  },

  button: {
    marginTop: "15px",
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#fff",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: "600",
  },

  results: {
    marginTop: "35px",
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
  },

  resultRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px 0",
    borderBottom: "1px solid #e5e7eb",
  },

  noResults: {
    color: "#6b7280",
    padding: "10px 0",
  },

  ai: {
    marginTop: "25px",
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
  },
};