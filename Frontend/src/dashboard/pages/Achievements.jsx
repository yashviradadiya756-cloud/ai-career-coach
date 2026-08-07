import React, { useEffect, useState } from "react";
import {
  getAchievements,
  updateAchievements,
} from "../../api/achievementApi";

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAchievements = async () => {
    try {
      setLoading(true);
      setError("");

      // First generate/update achievements
      await updateAchievements();

      // Then fetch latest achievements
      const response = await getAchievements();

      console.log("Achievements API response:", response.data);

      const badges =
        response.data?.achievement?.badges || [];

      setAchievements(badges);
    } catch (error) {
      console.error(
        "Achievements API Error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load achievements."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.message}>
          Loading achievements...
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

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h1>🏅 Achievements</h1>

        <p>
          Your certificates, badges and career milestones.
        </p>
      </div>

      {/* Achievement Cards */}
      <div style={styles.cards}>

        <div style={styles.card}>
          <h3>Badges</h3>

          <h1 style={{ color: "#2563eb" }}>
            {achievements.length}
          </h1>
        </div>

        <div style={styles.card}>
          <h3>Certificates</h3>

          <h1 style={{ color: "#16a34a" }}>
            0
          </h1>
        </div>

        <div style={styles.card}>
          <h3>Courses</h3>

          <h1 style={{ color: "#f59e0b" }}>
            0
          </h1>
        </div>

        <div style={styles.card}>
          <h3>Projects</h3>

          <h1 style={{ color: "#dc2626" }}>
            0
          </h1>
        </div>

      </div>

      {/* Achievement Timeline */}
      <div style={styles.section}>

        <h2>🎖 Achievement Timeline</h2>

        {achievements.length === 0 ? (
          <p>
            No achievements yet. Complete activities
            to unlock your first badge.
          </p>
        ) : (
          achievements.map((item, index) => (
            <div
              key={index}
              style={styles.achievement}
            >

              <div style={styles.badgeIcon}>
                {item.icon || "🏆"}
              </div>

              <h3>
                {item.title}
              </h3>

              <p>
                <strong>Description:</strong>{" "}
                {item.description}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {item.earnedAt
                  ? new Date(
                      item.earnedAt
                    ).toLocaleDateString()
                  : "Recently earned"}
              </p>

              <button
                style={styles.button}
                onClick={() =>
                  alert(
                    `${item.title}\n\n${item.description}`
                  )
                }
              >
                View Achievement
              </button>

            </div>
          ))
        )}

      </div>

      {/* Next Milestones */}
      <div style={styles.section}>

        <h2>⭐ Next Milestones</h2>

        <ul>
          <li>Complete AWS Course</li>
          <li>Build 3 MERN Projects</li>
          <li>Reach 95% Career Score</li>
          <li>Complete 10 Mock Interviews</li>
          <li>Get First Internship</li>
        </ul>

      </div>

      {/* AI Motivation */}
      <div style={styles.section}>

        <h2>🤖 AI Motivation</h2>

        <p>
          Excellent progress! Continue learning
          consistently. Complete your roadmap and
          apply for internships every week.
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

  achievement: {
    border: "1px solid #e5e7eb",
    padding: "20px",
    borderRadius: "10px",
    marginTop: "15px",
    background: "#fafafa",
  },

  badgeIcon: {
    fontSize: "40px",
    marginBottom: "5px",
  },

  button: {
    marginTop: "12px",
    padding: "10px 20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  message: {
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