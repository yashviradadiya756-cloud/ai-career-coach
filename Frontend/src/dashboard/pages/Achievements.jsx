import React, { useEffect, useState } from "react";
import {
  getAchievements,
  updateAchievements,
} from "../../api/achievementApi";

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCertificate, setSelectedCertificate] =
    useState(null);

  // ==========================================
  // LOAD ACHIEVEMENTS
  // ==========================================

  const loadAchievements = async () => {
    try {
      setLoading(true);
      setError("");

      // Calculate latest achievements
      await updateAchievements();

      // Get latest achievements
      const response = await getAchievements();

      console.log(
        "Achievements:",
        response.data
      );

      const badges =
        response.data?.achievement?.badges || [];

      setAchievements(badges);
    } catch (error) {
      console.error(
        "Achievement API Error:",
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

  // ==========================================
  // CHECK ACHIEVEMENTS
  // ==========================================

  const interviewCertificate = achievements.find(
    (item) =>
      item.title === "Interview Champion"
  );

  const learningCertificate = achievements.find(
    (item) =>
      item.title === "Learning Master"
  );

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.centerBox}>
          <div style={styles.bigIcon}>🏆</div>

          <h2>Loading Achievements...</h2>

          <p>
            Checking your latest interview and
            learning progress.
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
      <div style={styles.container}>
        <div style={styles.centerBox}>

          <div style={styles.bigIcon}>
            ⚠️
          </div>

          <h2>
            Unable to Load Achievements
          </h2>

          <p style={{ color: "#dc2626" }}>
            {error}
          </p>

          <button
            style={styles.primaryButton}
            onClick={loadAchievements}
          >
            🔄 Try Again
          </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // OPEN CERTIFICATE
  // ==========================================

  const openCertificate = (certificate) => {
    setSelectedCertificate(certificate);
  };

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>

        <div>
          <h1 style={styles.title}>
            🏆 Achievements
          </h1>

          <p style={styles.subtitle}>
            Earn certificates by passing interviews
            and completing your learning journey.
          </p>
        </div>

        <button
          style={styles.refreshButton}
          onClick={loadAchievements}
        >
          🔄 Refresh
        </button>

      </div>

      {/* SUMMARY */}
      <div style={styles.cards}>

        {/* TOTAL */}
        <div style={styles.card}>

          <div style={styles.cardIcon}>
            🏆
          </div>

          <div>
            <p style={styles.cardLabel}>
              Total Achievements
            </p>

            <h2 style={styles.blueNumber}>
              {achievements.length}
            </h2>

            <small>
              Maximum 2
            </small>
          </div>

        </div>

        {/* CERTIFICATES */}
        <div style={styles.card}>

          <div style={styles.cardIcon}>
            🎓
          </div>

          <div>
            <p style={styles.cardLabel}>
              Certificates
            </p>

            <h2 style={styles.greenNumber}>
              {achievements.length}
            </h2>

            <small>
              Earned certificates
            </small>
          </div>

        </div>

        {/* INTERVIEW */}
        <div style={styles.card}>

          <div style={styles.cardIcon}>
            🎤
          </div>

          <div>
            <p style={styles.cardLabel}>
              Interview
            </p>

            <h2
              style={
                interviewCertificate
                  ? styles.greenNumber
                  : styles.grayNumber
              }
            >
              {interviewCertificate
                ? "PASSED"
                : "PENDING"}
            </h2>

            <small>
              Minimum score: 70%
            </small>
          </div>

        </div>

        {/* LEARNING */}
        <div style={styles.card}>

          <div style={styles.cardIcon}>
            📚
          </div>

          <div>
            <p style={styles.cardLabel}>
              Learning
            </p>

            <h2
              style={
                learningCertificate
                  ? styles.orangeNumber
                  : styles.grayNumber
              }
            >
              {learningCertificate
                ? "COMPLETED"
                : "PENDING"}
            </h2>

            <small>
              Complete all recommendations
            </small>
          </div>

        </div>

      </div>

      {/* CERTIFICATES */}
      <div style={styles.section}>

        <h2 style={styles.sectionTitle}>
          🎓 Earned Certificates
        </h2>

        <p style={styles.sectionText}>
          Certificates are unlocked only after
          successfully completing the required
          achievement.
        </p>

        {achievements.length === 0 ? (
          <div style={styles.emptyBox}>

            <div style={styles.emptyIcon}>
              🔒
            </div>

            <h3>
              No Certificates Yet
            </h3>

            <p>
              Complete your AI Mock Interview
              with a score of 70% or higher,
              or complete all your learning
              recommendations.
            </p>

          </div>
        ) : (
          <div style={styles.certificateGrid}>

            {/* INTERVIEW */}
            {interviewCertificate && (
              <CertificateCard
                achievement={interviewCertificate}
                onView={openCertificate}
              />
            )}

            {/* LEARNING */}
            {learningCertificate && (
              <CertificateCard
                achievement={learningCertificate}
                onView={openCertificate}
              />
            )}

          </div>
        )}

      </div>

      {/* HOW TO EARN */}
      <div style={styles.section}>

        <h2 style={styles.sectionTitle}>
          ⭐ How to Earn Certificates
        </h2>

        <div style={styles.steps}>

          {/* STEP 1 */}
          <div style={styles.step}>

            <div style={styles.stepIcon}>
              🎤
            </div>

            <div>
              <h3>
                Interview Champion
              </h3>

              <p>
                Complete an AI Mock Interview
                and score at least <b>70%</b>.
              </p>

              <span
                style={
                  interviewCertificate
                    ? styles.completed
                    : styles.pending
                }
              >
                {interviewCertificate
                  ? "✓ Certificate Earned"
                  : "Not Earned Yet"}
              </span>
            </div>

          </div>

          {/* STEP 2 */}
          <div style={styles.step}>

            <div style={styles.stepIcon}>
              📚
            </div>

            <div>
              <h3>
                Learning Master
              </h3>

              <p>
                Complete <b>all</b> recommended
                learning courses.
              </p>

              <span
                style={
                  learningCertificate
                    ? styles.completed
                    : styles.pending
                }
              >
                {learningCertificate
                  ? "✓ Certificate Earned"
                  : "Not Earned Yet"}
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* AI MOTIVATION */}
      <div style={styles.motivation}>

        <div style={styles.motivationIcon}>
          🤖
        </div>

        <div>

          <h2>
            AI Motivation
          </h2>

          {achievements.length === 0 && (
            <p>
              Your certificate journey starts here!
              Complete your AI Mock Interview or finish
              your recommended learning courses.
            </p>
          )}

          {achievements.length === 1 && (
            <p>
              Great job! 🎉 You earned your first
              certificate. Keep going to unlock your
              second achievement.
            </p>
          )}

          {achievements.length === 2 && (
            <p>
              Excellent work! 🏆 You have earned both
              CareerPilot certificates. Keep practicing
              and learning to grow your career.
            </p>
          )}

        </div>

      </div>

      {/* CERTIFICATE MODAL */}
      {selectedCertificate && (
        <div style={styles.modalOverlay}>

          <div style={styles.certificateModal}>

            <button
              style={styles.closeButton}
              onClick={() =>
                setSelectedCertificate(null)
              }
            >
              ✕
            </button>

            <div style={styles.certificateBorder}>

              <div style={styles.certificateLogo}>
                🏆
              </div>

              <p style={styles.brand}>
                CAREERPILOT
              </p>

              <h1 style={styles.certificateHeading}>
                CERTIFICATE
              </h1>

              <p>
                OF ACHIEVEMENT
              </p>

              <p style={styles.presented}>
                This certificate is proudly presented
                to
              </p>

              <h2 style={styles.userName}>
                Yashvi Radariya
              </h2>

              <p>
                for successfully earning the
                achievement
              </p>

              <h2 style={styles.certificateTitle}>
                {selectedCertificate.icon}{" "}
                {selectedCertificate.title}
              </h2>

              <p style={styles.certificateDescription}>
                {selectedCertificate.description}
              </p>

              <p style={styles.certificateDate}>
                Earned on:{" "}
                {selectedCertificate.earnedAt
                  ? new Date(
                      selectedCertificate.earnedAt
                    ).toLocaleDateString()
                  : "Recently"}
              </p>

              <div style={styles.seal}>
                ✓
              </div>

              <p style={styles.footer}>
                AI Career Coach Platform
              </p>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}


// =====================================================
// CERTIFICATE CARD
// =====================================================

function CertificateCard({
  achievement,
  onView,
}) {
  return (
    <div style={styles.certificateCard}>

      <div style={styles.certificateIcon}>
        {achievement.icon}
      </div>

      <div style={{ flex: 1 }}>

        <div style={styles.earnedBadge}>
          ✓ Earned
        </div>

        <h3>
          {achievement.title}
        </h3>

        <p style={styles.description}>
          {achievement.description}
        </p>

        <p style={styles.date}>
          <strong>Earned:</strong>{" "}
          {achievement.earnedAt
            ? new Date(
                achievement.earnedAt
              ).toLocaleDateString()
            : "Recently"}
        </p>

        <button
          style={styles.primaryButton}
          onClick={() => onView(achievement)}
        >
          🎓 View Certificate
        </button>

      </div>

    </div>
  );
}


// =====================================================
// STYLES
// =====================================================

const styles = {
  container: {
    padding: "20px",
    background: "#f5f7fb",
    minHeight: "100vh",
  },

  header: {
    background: "#fff",
    padding: "25px",
    borderRadius: "14px",
    marginBottom: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    color: "#111827",
  },

  subtitle: {
    color: "#6b7280",
    marginBottom: 0,
  },

  refreshButton: {
    padding: "10px 18px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
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
    borderRadius: "14px",
    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  cardIcon: {
    fontSize: "35px",
  },

  cardLabel: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
  },

  blueNumber: {
    margin: "5px 0",
    color: "#2563eb",
  },

  greenNumber: {
    margin: "5px 0",
    color: "#16a34a",
  },

  orangeNumber: {
    margin: "5px 0",
    color: "#f59e0b",
  },

  grayNumber: {
    margin: "5px 0",
    color: "#9ca3af",
    fontSize: "18px",
  },

  section: {
    background: "#fff",
    padding: "25px",
    borderRadius: "14px",
    marginBottom: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
  },

  sectionTitle: {
    marginTop: 0,
    color: "#111827",
  },

  sectionText: {
    color: "#6b7280",
  },

  certificateGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },

  certificateCard: {
    display: "flex",
    gap: "20px",
    padding: "22px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    background: "#fafafa",
  },

  certificateIcon: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "#eff6ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "38px",
  },

  earnedBadge: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "12px",
    fontWeight: "600",
  },

  description: {
    color: "#6b7280",
  },

  date: {
    fontSize: "14px",
    color: "#374151",
  },

  primaryButton: {
    marginTop: "10px",
    padding: "10px 18px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  emptyBox: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#6b7280",
  },

  emptyIcon: {
    fontSize: "55px",
  },

  steps: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  step: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "18px",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    background: "#fafafa",
  },

  stepIcon: {
    fontSize: "35px",
  },

  completed: {
    display: "inline-block",
    padding: "5px 10px",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },

  pending: {
    display: "inline-block",
    padding: "5px 10px",
    background: "#f3f4f6",
    color: "#6b7280",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },

  motivation: {
    background: "#fff",
    padding: "25px",
    borderRadius: "14px",
    marginBottom: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
    display: "flex",
    gap: "15px",
    borderLeft: "5px solid #2563eb",
  },

  motivationIcon: {
    fontSize: "35px",
  },

  centerBox: {
    background: "#fff",
    padding: "50px 20px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
  },

  bigIcon: {
    fontSize: "50px",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.65)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
  },

  certificateModal: {
    position: "relative",
    background: "#fff",
    width: "min(800px, 95vw)",
    maxHeight: "90vh",
    overflowY: "auto",
    borderRadius: "12px",
    padding: "15px",
  },

  closeButton: {
    position: "absolute",
    right: "15px",
    top: "15px",
    border: "none",
    background: "#f3f4f6",
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "18px",
  },

  certificateBorder: {
    border: "8px double #d4af37",
    padding: "45px 30px",
    textAlign: "center",
    minHeight: "500px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  certificateLogo: {
    fontSize: "45px",
  },

  brand: {
    fontWeight: "700",
    letterSpacing: "4px",
    color: "#2563eb",
  },

  certificateHeading: {
    fontFamily: "Georgia, serif",
    letterSpacing: "5px",
    marginBottom: "0",
  },

  presented: {
    marginTop: "30px",
  },

  userName: {
    fontFamily: "Georgia, serif",
    fontStyle: "italic",
    fontSize: "30px",
    color: "#2563eb",
  },

  certificateTitle: {
    marginTop: "20px",
    color: "#111827",
  },

  certificateDescription: {
    maxWidth: "500px",
    color: "#4b5563",
  },

  certificateDate: {
    marginTop: "20px",
    fontWeight: "600",
  },

  seal: {
    marginTop: "25px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#d4af37",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "28px",
    fontWeight: "bold",
  },

  footer: {
    marginTop: "25px",
    color: "#6b7280",
    fontSize: "13px",
  },
};