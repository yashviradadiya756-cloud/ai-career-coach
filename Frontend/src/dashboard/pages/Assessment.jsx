import React from "react";

export default function Assessment() {
  const tests = [
    {
      title: "Technical Skills",
      description: "Java, Python, React, Node.js",
      questions: "25 Questions",
      time: "30 Min",
      color: "#2563eb",
    },
    {
      title: "Aptitude Test",
      description: "Logical & Quantitative",
      questions: "20 Questions",
      time: "20 Min",
      color: "#16a34a",
    },
    {
      title: "Communication",
      description: "English & Soft Skills",
      questions: "15 Questions",
      time: "15 Min",
      color: "#f59e0b",
    },
    {
      title: "Personality Test",
      description: "Career Behaviour Analysis",
      questions: "20 Questions",
      time: "20 Min",
      color: "#dc2626",
    },
  ];

  const results = [
    { name: "Technical Skills", score: "88%" },
    { name: "Aptitude Test", score: "81%" },
    { name: "Communication", score: "91%" },
    { name: "Personality Test", score: "85%" },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1>📊 Assessment Dashboard</h1>
        <p>Evaluate your skills and discover areas for improvement.</p>
      </div>

      {/* Summary Cards */}
      <div style={styles.summary}>
        <div style={styles.summaryCard}>
          <h3>Total Assessments</h3>
          <h1>12</h1>
        </div>

        <div style={styles.summaryCard}>
          <h3>Completed</h3>
          <h1 style={{ color: "#16a34a" }}>8</h1>
        </div>

        <div style={styles.summaryCard}>
          <h3>Average Score</h3>
          <h1 style={{ color: "#2563eb" }}>86%</h1>
        </div>

        <div style={styles.summaryCard}>
          <h3>Rank</h3>
          <h1 style={{ color: "#f59e0b" }}>Top 15%</h1>
        </div>
      </div>

      {/* Test Cards */}
      <h2 style={{ marginBottom: 20 }}>Available Assessments</h2>

      <div style={styles.grid}>
        {tests.map((test, index) => (
          <div key={index} style={styles.card}>
            <h3 style={{ color: test.color }}>{test.title}</h3>

            <p>{test.description}</p>

            <p>
              <strong>{test.questions}</strong>
            </p>

            <p>{test.time}</p>

            <button style={styles.button}>Start Test</button>
          </div>
        ))}
      </div>

      {/* Results */}
      <div style={styles.results}>
        <h2>📈 Previous Results</h2>

        {results.map((item, index) => (
          <div key={index} style={styles.resultRow}>
            <span>{item.name}</span>

            <strong>{item.score}</strong>
          </div>
        ))}
      </div>

      {/* AI Recommendation */}
      <div style={styles.ai}>
        <h2>🤖 AI Recommendation</h2>

        <p>
          Your communication skills are excellent. Focus on improving Data
          Structures, Algorithms, and System Design to increase your interview
          success rate.
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
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
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

  ai: {
    marginTop: "25px",
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
  },
};