import React from "react";

export default function SkillGap() {
  const skills = [
    {
      name: "React.js",
      current: 85,
      target: 95,
      color: "#2563eb",
    },
    {
      name: "Node.js",
      current: 70,
      target: 90,
      color: "#16a34a",
    },
    {
      name: "MongoDB",
      current: 65,
      target: 90,
      color: "#f59e0b",
    },
    {
      name: "Express.js",
      current: 72,
      target: 90,
      color: "#dc2626",
    },
  ];

  const missingSkills = [
    "Data Structures & Algorithms",
    "System Design",
    "REST API Development",
    "Docker",
    "AWS Basics",
  ];

  const recommendations = [
    "Complete MERN Stack Projects",
    "Practice 100+ DSA Problems",
    "Learn Docker & Deployment",
    "Build REST APIs using Express",
    "Practice Mock Interviews",
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1>🧠 Skill Gap Analysis</h1>
        <p>
          Compare your current skills with industry requirements and improve
          your career readiness.
        </p>
      </div>

      {/* Summary Cards */}
      <div style={styles.cards}>
        <div style={styles.card}>
          <h3>Skill Match</h3>
          <h1 style={{ color: "#2563eb" }}>78%</h1>
        </div>

        <div style={styles.card}>
          <h3>Skills Learned</h3>
          <h1 style={{ color: "#16a34a" }}>14</h1>
        </div>

        <div style={styles.card}>
          <h3>Missing Skills</h3>
          <h1 style={{ color: "#dc2626" }}>5</h1>
        </div>

        <div style={styles.card}>
          <h3>Career Readiness</h3>
          <h1 style={{ color: "#f59e0b" }}>82%</h1>
        </div>
      </div>

      {/* Progress Bars */}
      <div style={styles.section}>
        <h2>📊 Skill Progress</h2>

        {skills.map((skill, index) => (
          <div key={index} style={{ marginBottom: 25 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <strong>{skill.name}</strong>
              <span>
                {skill.current}% / {skill.target}%
              </span>
            </div>

            <div style={styles.progressBackground}>
              <div
                style={{
                  width: `${skill.current}%`,
                  background: skill.color,
                  height: "100%",
                  borderRadius: "20px",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Missing Skills */}
      <div style={styles.section}>
        <h2>❌ Missing Skills</h2>

        <ul>
          {missingSkills.map((item, index) => (
            <li key={index} style={styles.listItem}>
              • {item}
            </li>
          ))}
        </ul>
      </div>

      {/* AI Recommendation */}
      <div style={styles.section}>
        <h2>🤖 AI Recommendations</h2>

        <ul>
          {recommendations.map((item, index) => (
            <li key={index} style={styles.listItem}>
              ✅ {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Career Suggestion */}
      <div style={styles.section}>
        <h2>🎯 Suggested Career</h2>

        <p>
          Based on your skills, you are best suited for a
          <strong> Full Stack MERN Developer</strong> role. Improve Docker,
          System Design, and AWS to become industry-ready.
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
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "20px",
    marginBottom: "20px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
  },

  section: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
  },

  progressBackground: {
    width: "100%",
    height: "12px",
    background: "#ddd",
    borderRadius: "20px",
    marginTop: "8px",
  },

  listItem: {
    marginBottom: "12px",
    fontSize: "16px",
  },
};