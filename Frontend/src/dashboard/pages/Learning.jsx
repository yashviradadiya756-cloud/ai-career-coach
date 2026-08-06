import React, { useEffect, useState } from "react";

import {
  getLearning,
  generateLearning,
} from "../../api/learningApi";

import { getLatestSkillGap } from "../../api/skillGapApi";

export default function Learning() {
  const [learning, setLearning] = useState(null);
  const [skillGap, setSkillGap] = useState(null);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadLearning();
  }, []);

  const loadLearning = async () => {
    try {
      setLoading(true);
      setError("");

      // First try existing learning recommendations
      try {
        const learningResponse = await getLearning();

        if (learningResponse.success) {
          setLearning(learningResponse.learning);
        }
      } catch (error) {
        // 404 means learning hasn't been generated yet
        if (error.response?.status !== 404) {
          throw error;
        }
      }

      // Get latest Skill Gap
      try {
        const skillGapResponse = await getLatestSkillGap();

        if (skillGapResponse.success) {
          setSkillGap(skillGapResponse.skillGap);
        }
      } catch (error) {
        console.log(
          "Skill Gap API Error:",
          error.response?.data || error.message
        );
      }
    } catch (error) {
      console.error(
        "Learning API Error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Failed to load learning dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLearning = async () => {
    try {
      setGenerating(true);
      setError("");
      setMessage("");

      // Get target role from latest Skill Gap
      const targetRole = skillGap?.targetRole;

      if (!targetRole) {
        setError(
          "Please complete Skill Gap Analysis first and select a target role."
        );
        return;
      }

      console.log("Generating learning for:", targetRole);

      const response = await generateLearning(targetRole);

      if (response.success) {
        setLearning(response.learning);

        setMessage(
          "Learning recommendations generated successfully!"
        );
      }
    } catch (error) {
      console.error(
        "Generate Learning Error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Failed to generate learning recommendations"
      );
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.section}>
          <h3>Loading Learning Center...</h3>
        </div>
      </div>
    );
  }

  const recommendations =
    learning?.recommendations || [];

  const targetRole =
    learning?.targetRole ||
    skillGap?.targetRole ||
    "";

  return (
    <div style={styles.container}>

      {/* Header */}

      <div style={styles.header}>
        <h1>📚 Learning Center</h1>

        <p>
          Learn new technologies, track your progress,
          and become job-ready with AI-recommended
          learning resources.
        </p>

        {targetRole && (
          <p>
            <strong>Target Role:</strong> {targetRole}
          </p>
        )}
      </div>

      {/* Error */}

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* Success */}

      {message && (
        <div style={styles.success}>
          {message}
        </div>
      )}

      {/* Dashboard Cards */}

      <div style={styles.cards}>

        <div style={styles.card}>
          <h3>Recommended Skills</h3>
          <h1 style={{ color: "#2563eb" }}>
            {recommendations.length}
          </h1>
        </div>

        <div style={styles.card}>
          <h3>Completed</h3>
          <h1 style={{ color: "#16a34a" }}>
            0
          </h1>
        </div>

        <div style={styles.card}>
          <h3>Certificates</h3>
          <h1 style={{ color: "#f59e0b" }}>
            0
          </h1>
        </div>

        <div style={styles.card}>
          <h3>Learning Time</h3>
          <h1 style={{ color: "#dc2626" }}>
            0 hrs
          </h1>
        </div>

      </div>

      {/* Generate */}

      <div style={styles.generateBox}>

        <div>
          <h2>🤖 AI Learning Plan</h2>

          <p>
            Generate personalized learning resources
            based on your Skill Gap Analysis.
          </p>
        </div>

        <button
          style={{
            ...styles.button,
            opacity: generating ? 0.6 : 1,
          }}
          onClick={handleGenerateLearning}
          disabled={generating}
        >
          {generating
            ? "Generating..."
            : "Generate Learning Plan"}
        </button>

      </div>

      {/* Recommendations */}

      <div style={styles.section}>

        <h2>🚀 Recommended Courses</h2>

        {recommendations.length === 0 ? (

          <div style={styles.empty}>
            <p>
              No learning recommendations found.
            </p>

            <p>
              Complete Skill Gap Analysis and generate
              your personalized learning plan.
            </p>

          </div>

        ) : (

          recommendations.map((item, index) => (

            <div
              key={index}
              style={styles.courseCard}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  gap: "20px",
                }}
              >

                <div>
                  <h3>
                    {item.course}
                  </h3>

                  <p>
                    <strong>Skill:</strong>{" "}
                    {item.skill}
                  </p>
                </div>

                <span>
                  {item.duration}
                </span>

              </div>

              <p>
                <strong>Platform:</strong>{" "}
                {item.platform}
              </p>

              <p>
                <strong>Level:</strong>{" "}
                {item.level}
              </p>

              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.link}
                >
                  View Course →
                </a>
              )}

            </div>

          ))

        )}

      </div>

      {/* AI Recommendation */}

      <div style={styles.section}>

        <h2>🤖 AI Recommendation</h2>

        {recommendations.length > 0 ? (

          <p>
            Based on your Skill Gap Analysis for{" "}
            <strong>{targetRole}</strong>, focus on
            completing the recommended resources above.
            After completing them, update your progress
            and continue with the next skill.
          </p>

        ) : (

          <p>
            Complete your Skill Gap Analysis first.
            Then generate a personalized learning plan
            based on your target career.
          </p>

        )}

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

  generateBox: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  courseCard: {
    padding: "20px",
    marginTop: "20px",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    background: "#fafafa",
  },

  button: {
    padding: "12px 20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  link: {
    display: "inline-block",
    marginTop: "10px",
    color: "#2563eb",
    fontWeight: "600",
    textDecoration: "none",
  },

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  empty: {
    background: "#f8fafc",
    padding: "20px",
    borderRadius: "8px",
    marginTop: "15px",
  },
};