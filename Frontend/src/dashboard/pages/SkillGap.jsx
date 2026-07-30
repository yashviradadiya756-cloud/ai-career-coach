import { useEffect, useState } from "react";
import {
  analyzeSkillGap,
  getLatestSkillGap,
} from "../../api/skillGapApi";

export default function SkillGap() {
  const [targetRole, setTargetRole] = useState("");
  const [skillGap, setSkillGap] = useState(null);

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch Latest Skill Gap
  const fetchSkillGap = async () => {
    try {
      setDataLoading(true);

      const res = await getLatestSkillGap();

      console.log(res.data);

      setSkillGap(res.data.skillGap);
    } catch (error) {
      console.log(error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillGap();
  }, []);

  // Analyze Skill Gap
  const handleAnalyze = async () => {
    if (!targetRole) {
      alert("Please enter your target role.");
      return;
    }

    try {
      setLoading(true);

      await analyzeSkillGap(targetRole);

      alert("Skill Gap Analysis Completed");

      await fetchSkillGap();

      setTargetRole("");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Analysis Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}

      <div style={styles.header}>
        <h1>🧠 Skill Gap Analysis</h1>

        <p>
          Compare your current skills with industry requirements and
          receive AI-powered recommendations.
        </p>

        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Target Role (Example: Full Stack Developer)"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            style={styles.input}
          />

          <button
            onClick={handleAnalyze}
            style={styles.button}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </div>

      {/* Summary Cards */}

      <div style={styles.cards}>
        <div style={styles.card}>
          <h3>Career Readiness</h3>

          <h1 style={{ color: "#2563eb" }}>
            {dataLoading
              ? "..."
              : `${skillGap?.readinessScore || 0}%`}
          </h1>
        </div>

        <div style={styles.card}>
          <h3>Current Skills</h3>

          <h1 style={{ color: "#16a34a" }}>
            {dataLoading
              ? "..."
              : skillGap?.currentSkills?.length || 0}
          </h1>
        </div>

        <div style={styles.card}>
          <h3>Missing Skills</h3>

          <h1 style={{ color: "#dc2626" }}>
            {dataLoading
              ? "..."
              : skillGap?.missingSkills?.length || 0}
          </h1>
        </div>

        <div style={styles.card}>
          <h3>Courses</h3>

          <h1 style={{ color: "#f59e0b" }}>
            {dataLoading
              ? "..."
              : skillGap?.recommendedCourses?.length || 0}
          </h1>
        </div>
      </div>

      {/* ===== PART 2 STARTS HERE ===== */}
            {/* Skill Progress */}

      <div style={styles.section}>
        <h2>📊 Current Skills</h2>

        {skillGap?.currentSkills?.length > 0 ? (
          skillGap.currentSkills.map((skill, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <strong>{skill}</strong>

                <span>Industry Ready</span>
              </div>

              <div style={styles.progressBackground}>
                <div
                  style={{
                    width: "85%",
                    height: "100%",
                    background: "#2563eb",
                    borderRadius: "20px",
                  }}
                ></div>
              </div>
            </div>
          ))
        ) : (
          <p>No Skills Found</p>
        )}
      </div>

      {/* Missing Skills */}

      <div style={styles.section}>
        <h2>❌ Missing Skills</h2>

        <ul>
          {skillGap?.missingSkills?.length > 0 ? (
            skillGap.missingSkills.map((item, index) => (
              <li key={index} style={styles.listItem}>
                ❌ {item}
              </li>
            ))
          ) : (
            <li>No Missing Skills</li>
          )}
        </ul>
      </div>

      {/* Recommended Courses */}

      <div style={styles.section}>
        <h2>📚 Recommended Courses</h2>

        <ul>
          {skillGap?.recommendedCourses?.length > 0 ? (
            skillGap.recommendedCourses.map((item, index) => (
              <li key={index} style={styles.listItem}>
                📖 {item}
              </li>
            ))
          ) : (
            <li>No Recommendations</li>
          )}
        </ul>
      </div>

      {/* Roadmap */}

      <div style={styles.section}>
        <h2>🚀 Learning Roadmap</h2>

        <ul>
          {skillGap?.roadmap?.length > 0 ? (
            skillGap.roadmap.map((item, index) => (
              <li key={index} style={styles.listItem}>
                🚀 {item}
              </li>
            ))
          ) : (
            <li>No Roadmap Generated</li>
          )}
        </ul>
      </div>

      {/* Target Role */}

      <div style={styles.section}>
        <h2>🎯 Target Career</h2>

        <p>
          You are preparing for the role of{" "}
          <strong>
            {skillGap?.targetRole || "Not Selected"}
          </strong>
        </p>

        <p style={{ marginTop: "10px" }}>
          Your current readiness score is{" "}
          <strong>
            {skillGap?.readinessScore || 0}%
          </strong>.
          Continue following the recommended roadmap and complete the suggested
          courses to improve your chances of becoming job-ready.
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

  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginTop: "20px",
    flexWrap: "wrap",
  },

  input: {
    width: "350px",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
  },

  button: {
    padding: "12px 24px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
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
    background: "#e5e7eb",
    borderRadius: "20px",
    overflow: "hidden",
  },

  listItem: {
    marginBottom: "12px",
    fontSize: "16px",
    lineHeight: "1.6",
  },
};