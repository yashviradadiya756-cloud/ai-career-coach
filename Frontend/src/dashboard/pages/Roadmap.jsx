import React, { useEffect, useState } from "react";

import {
  generateRoadmap,
  getRoadmap,
  updatePhaseCompletion,
} from "../../api/roadmapApi";

import { getLatestSkillGap } from "../../api/skillGapApi";

// ======================================================
// SUMMARY CARD COMPONENT
// ======================================================

function SummaryCard({ children, color }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.card,

        borderLeft: `4px solid ${color}`,

        transform: hovered
          ? "translateY(-5px)"
          : "translateY(0)",

        boxShadow: hovered
          ? "0 12px 25px rgba(0, 0, 0, 0.10)"
          : "0 3px 10px rgba(0, 0, 0, 0.05)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  );
}

// ======================================================
// SMALL LOADING SPINNER
// ======================================================

function SmallLoader() {
  const bars = Array.from({ length: 12 });

  return (
    <div style={styles.simpleLoader}>
      <div className="loader-spinner">
        {bars.map((_, index) => (
          <span
            key={index}
            className="loader-bar"
            style={{
              transform: `rotate(${index * 30}deg)`,
              animationDelay: `${index * 0.08}s`,
            }}
          />
        ))}
      </div>

      <div style={styles.loadingLabel}>Loading</div>
    </div>
  );
}

// ======================================================
// ROADMAP COMPONENT
// ======================================================

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // ======================================================
  // UPDATE PHASE COMPLETION
  // ======================================================

  const handlePhaseCompletion = async (
    phaseId,
    completed
  ) => {
    try {
      const response = await updatePhaseCompletion(
        phaseId,
        completed
      );

      if (response.data?.success) {
        setRoadmap(response.data.roadmap);
      }
    } catch (error) {
      console.error(
        "PHASE UPDATE ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update phase."
      );
    }
  };

  // ======================================================
  // LOAD EXISTING ROADMAP
  // ======================================================

  const loadRoadmap = async () => {
  try {
    setLoading(true);

    console.log("STEP 1: Loading saved roadmap...");

    const response = await getRoadmap();

    console.log("STEP 2: Saved roadmap raw response:", response);

    // Support both:
    // response.data
    // response
    const data = response?.data || response;

    console.log("STEP 3: Normalized roadmap response:", data);

    if (data?.success && data?.roadmap) {
      console.log("STEP 4: Saved roadmap found:", data.roadmap);

      setRoadmap(data.roadmap);
    } else {
      console.log("STEP 4: No saved roadmap found");

      setRoadmap(null);
    }
  } catch (error) {
    console.error(
      "GET ROADMAP ERROR:",
      error.response?.data || error.message
    );

    setRoadmap(null);
  } finally {
    setLoading(false);
  }
};

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    loadRoadmap();
  }, []);

  // ======================================================
  // GENERATE ROADMAP
  // ======================================================

  const handleGenerate = async () => {
  if (generating) return;

  try {
    setGenerating(true);

    console.log("====================================");
    console.log("ROADMAP GENERATION STARTED");
    console.log("====================================");

    // ==========================================
    // STEP 1: GET LATEST SKILL GAP
    // ==========================================

    console.log("STEP 1: Getting latest skill gap...");

    const skillGapResponse = await getLatestSkillGap();

    console.log(
      "STEP 1 RAW RESPONSE:",
      skillGapResponse
    );

    console.log(
      "STEP 1 RESPONSE.DATA:",
      skillGapResponse?.data
    );

    // IMPORTANT:
    // Support both axios response formats
    const skillGapData =
      skillGapResponse?.data || skillGapResponse;

    console.log(
      "STEP 1 NORMALIZED DATA:",
      skillGapData
    );

    // ==========================================
    // STEP 2: GET SKILL GAP OBJECT
    // ==========================================

    const latestSkillGap =
      skillGapData?.skillGap ||
      skillGapResponse?.skillGap;

    console.log(
      "STEP 2: Latest Skill Gap:",
      latestSkillGap
    );

    // ==========================================
    // CHECK SKILL GAP
    // ==========================================

    if (!latestSkillGap) {
      alert(
        "No Skill Gap Analysis found. Please complete Skill Gap Analysis first."
      );
      return;
    }

    // ==========================================
    // STEP 3: GET TARGET ROLE
    // ==========================================

    const role =
      latestSkillGap.targetRole ||
      latestSkillGap.target_role;

    console.log(
      "STEP 3: Target Role:",
      role
    );

    if (!role || !role.trim()) {
      alert(
        "Target role not found in Skill Gap Analysis. Please analyze your Skill Gap again."
      );
      return;
    }

    // ==========================================
    // STEP 4: CHECK MISSING SKILLS
    // ==========================================

    const missingSkills =
      Array.isArray(latestSkillGap.missingSkills)
        ? latestSkillGap.missingSkills
        : [];

    const currentSkills =
      Array.isArray(latestSkillGap.currentSkills)
        ? latestSkillGap.currentSkills
        : [];

    console.log(
      "STEP 4: Current Skills:",
      currentSkills
    );

    console.log(
      "STEP 4: Missing Skills:",
      missingSkills
    );

    // ==========================================
    // STEP 5: GENERATE ROADMAP
    // ==========================================

    console.log(
      "STEP 5: Calling generateRoadmap API..."
    );

    const response = await generateRoadmap(
      role.trim()
    );

    console.log(
      "STEP 6: Roadmap RAW RESPONSE:",
      response
    );

    console.log(
      "STEP 6: Roadmap response.data:",
      response?.data
    );

    // ==========================================
    // STEP 7: NORMALIZE RESPONSE
    // ==========================================

    const roadmapData =
      response?.data || response;

    console.log(
      "STEP 7: Normalized Roadmap Data:",
      roadmapData
    );

    if (
      roadmapData?.success &&
      roadmapData?.roadmap
    ) {
      console.log(
        "STEP 8: ROADMAP GENERATED SUCCESSFULLY:",
        roadmapData.roadmap
      );

      setRoadmap(roadmapData.roadmap);

      alert(
        "Roadmap Generated Successfully!"
      );
    } else {
      console.error(
        "ROADMAP DATA MISSING:",
        roadmapData
      );

      alert(
        roadmapData?.message ||
          "Roadmap could not be generated."
      );
    }
  } catch (error) {
    console.error(
      "========== ROADMAP ERROR =========="
    );

    console.error(
      "Status:",
      error.response?.status
    );

    console.error(
      "Backend Response:",
      error.response?.data
    );

    console.error(
      "Error Message:",
      error.message
    );

    console.error(
      "==================================="
    );

    alert(
      error.response?.data?.message ||
        error.message ||
        "Failed to generate roadmap."
    );
  } finally {
    setGenerating(false);
  }
};

  // ======================================================
  // PAGE LOADING
  // ======================================================

  if (loading) {
    return (
      <>
        <div style={styles.loadingContainer}>
          <SmallLoader />
        </div>

        <style>
          {`
            .loader-spinner {
              position: relative;
              width: 36px;
              height: 36px;
              animation: loaderRotate 1.2s linear infinite;
            }

            .loader-bar {
              position: absolute;
              width: 2px;
              height: 9px;
              background: #9ca3af;
              border-radius: 2px;
              left: 17px;
              top: 0;
              transform-origin: 1px 18px;
              animation: loaderFade 1.2s linear infinite;
            }

            @keyframes loaderRotate {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }

            @keyframes loaderFade {
              0% {
                opacity: 1;
                background: #111827;
              }

              100% {
                opacity: 0.2;
                background: #d1d5db;
              }
            }
          `}
        </style>
      </>
    );
  }

  // ======================================================
  // NO ROADMAP
  // ======================================================

  if (!roadmap) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>
            🗺️
          </div>

          <h1 style={styles.emptyTitle}>
            AI Career Roadmap
          </h1>

          <p style={styles.emptyText}>
            Your Skill Gap Analysis is complete.
            Generate a personalized learning roadmap
            based on your target career and missing skills.
          </p>

          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              ...styles.generateButton,
              ...(generating
                ? styles.disabledButton
                : {}),
            }}
          >
            {generating
              ? "⏳ Generating Roadmap..."
              : "🚀 Generate AI Roadmap"}
          </button>

          <p style={styles.smallText}>
            Powered by AI Career Coach
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // ROADMAP DATA
  // ======================================================

  const phases = Array.isArray(roadmap.phases)
    ? roadmap.phases
    : [];

  const totalTopics = phases.reduce(
    (total, phase) =>
      total +
      (Array.isArray(phase.topics)
        ? phase.topics.length
        : 0),
    0
  );

  const totalProjects = phases.reduce(
    (total, phase) =>
      total +
      (Array.isArray(phase.projects)
        ? phase.projects.length
        : 0),
    0
  );

  // ======================================================
  // MAIN UI
  // ======================================================

  return (
    <div style={styles.container}>
      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <div style={styles.hero}>
        <div>
          <div style={styles.heroIcon}>
            🗺️
          </div>

          <h1 style={styles.heroTitle}>
            {roadmap.roadmapTitle ||
              roadmap.title ||
              "Your AI Career Roadmap"}
          </h1>

          <p style={styles.heroSubtitle}>
            A personalized learning journey designed
            to help you become job-ready.
          </p>

          <div style={styles.roleBadge}>
            🎯 Target Role:{" "}
            <strong>
              {roadmap.targetRole ||
                "Career Goal"}
            </strong>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          style={{
            ...styles.regenerateButton,
            ...(generating
              ? styles.disabledButton
              : {}),
          }}
        >
          {generating
            ? "⏳ Generating..."
            : "🔄 Regenerate Roadmap"}
        </button>
      </div>

      {/* ================================================= */}
      {/* SUMMARY CARDS */}
      {/* ================================================= */}

      <div style={styles.cards}>
        <SummaryCard color="#2563eb">
          <div style={styles.cardIcon}>
            📚
          </div>

          <div>
            <p style={styles.cardLabel}>
              Total Phases
            </p>

            <h2 style={styles.cardNumber}>
              {phases.length}
            </h2>
          </div>
        </SummaryCard>

        <SummaryCard color="#7c3aed">
          <div style={styles.cardIcon}>
            📝
          </div>

          <div>
            <p style={styles.cardLabel}>
              Learning Topics
            </p>

            <h2 style={styles.cardNumber}>
              {totalTopics}
            </h2>
          </div>
        </SummaryCard>

        <SummaryCard color="#0891b2">
          <div style={styles.cardIcon}>
            💻
          </div>

          <div>
            <p style={styles.cardLabel}>
              Projects
            </p>

            <h2 style={styles.cardNumber}>
              {totalProjects}
            </h2>
          </div>
        </SummaryCard>

        <SummaryCard color="#16a34a">
          <div style={styles.cardIcon}>
            🚀
          </div>

          <div>
            <p style={styles.cardLabel}>
              Status
            </p>

            <h2
              style={{
                ...styles.cardNumber,
                color: "#16a34a",
              }}
            >
              Started
            </h2>
          </div>
        </SummaryCard>
      </div>

      {/* ================================================= */}
      {/* LEARNING ROADMAP */}
      {/* ================================================= */}

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>
              📚 Learning Roadmap
            </h2>

            <p style={styles.sectionSubtitle}>
              Follow each phase step-by-step to
              build your career skills.
            </p>
          </div>
        </div>

        <div style={styles.timeline}>
          {phases.length === 0 ? (
            <div style={styles.noPhase}>
              <h3>
                No phases available
              </h3>

              <p>
                The AI generated a roadmap,
                but no phases were returned.
              </p>

              <details
                style={styles.debugDetails}
              >
                <summary>
                  View roadmap data
                </summary>

                <pre
                  style={styles.debugPre}
                >
                  {JSON.stringify(
                    roadmap,
                    null,
                    2
                  )}
                </pre>
              </details>
            </div>
          ) : (
            phases.map(
              (phase, index) => {
                const topics =
                  Array.isArray(
                    phase.topics
                  )
                    ? phase.topics
                    : [];

                const projects =
                  Array.isArray(
                    phase.projects
                  )
                    ? phase.projects
                    : [];

                const resources =
                  Array.isArray(
                    phase.resources
                  )
                    ? phase.resources
                    : [];

                return (
                  <div
                    key={
                      phase._id ||
                      index
                    }
                    style={
                      styles.phaseCard
                    }
                  >
                    {/* PHASE NUMBER */}

                    <div
                      style={
                        styles.phaseNumber
                      }
                    >
                      {index + 1}
                    </div>

                    <div
                      style={
                        styles.phaseContent
                      }
                    >
                      {/* PHASE HEADER */}

                      <div
                        style={
                          styles.phaseHeader
                        }
                      >
                        <div>
                          <span
                            style={
                              styles.phaseLabel
                            }
                          >
                            PHASE{" "}
                            {index + 1}
                          </span>

                          <h3
                            style={
                              styles.phaseTitle
                            }
                          >
                            {phase.title ||
                              `Learning Phase ${
                                index + 1
                              }`}
                          </h3>
                        </div>

                        <div
                          style={
                            styles.duration
                          }
                        >
                          ⏱️{" "}
                          {phase.duration ||
                            "Flexible"}
                        </div>
                      </div>

                      {/* TOPICS */}

                      <div
                        style={
                          styles.phaseSection
                        }
                      >
                        <h4
                          style={
                            styles.subTitle
                          }
                        >
                          📖 Topics to Learn
                        </h4>

                        {topics.length > 0 ? (
                          <div
                            style={
                              styles.tagContainer
                            }
                          >
                            {topics.map(
                              (
                                topic,
                                i
                              ) => (
                                <span
                                  key={i}
                                  style={
                                    styles.topicTag
                                  }
                                >
                                  ✓{" "}
                                  {topic}
                                </span>
                              )
                            )}
                          </div>
                        ) : (
                          <p
                            style={
                              styles.mutedText
                            }
                          >
                            No topics available.
                          </p>
                        )}
                      </div>

                      {/* PROJECTS */}

                      <div
                        style={
                          styles.phaseSection
                        }
                      >
                        <h4
                          style={
                            styles.subTitle
                          }
                        >
                          💻 Projects
                        </h4>

                        {projects.length > 0 ? (
                          <ul
                            style={
                              styles.list
                            }
                          >
                            {projects.map(
                              (
                                project,
                                i
                              ) => (
                                <li
                                  key={i}
                                  style={
                                    styles.listItem
                                  }
                                >
                                  <span>
                                    🚀
                                  </span>

                                  <span>
                                    {project}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          <p
                            style={
                              styles.mutedText
                            }
                          >
                            No projects available.
                          </p>
                        )}
                      </div>

                      {/* RESOURCES */}

                      <div
                        style={
                          styles.phaseSection
                        }
                      >
                        <h4
                          style={
                            styles.subTitle
                          }
                        >
                          🔗 Learning Resources
                        </h4>

                        {resources.length > 0 ? (
                          <ul
                            style={
                              styles.list
                            }
                          >
                            {resources.map(
                              (
                                resource,
                                i
                              ) => (
                                <li
                                  key={i}
                                  style={
                                    styles.listItem
                                  }
                                >
                                  <span>
                                    📘
                                  </span>

                                  <span>
                                    {resource}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          <p
                            style={
                              styles.mutedText
                            }
                          >
                            No resources available.
                          </p>
                        )}
                      </div>

                      {/* COMPLETION STATUS */}

                      <div
                        style={
                          styles.completedBox
                        }
                      >
                        <span
                          style={{
                            ...styles.completedDot,
                            background:
                              phase.completed
                                ? "#16a34a"
                                : "#94a3b8",
                          }}
                        />

                        <span>
                          {phase.completed
                            ? "Phase Completed"
                            : "Phase Not Completed"}
                        </span>

                        <button
                          onClick={() =>
                            handlePhaseCompletion(
                              phase._id,
                              !phase.completed
                            )
                          }
                          style={{
                            ...styles.completionButton,
                            background:
                              phase.completed
                                ? "#fee2e2"
                                : "#dcfce7",
                            color:
                              phase.completed
                                ? "#dc2626"
                                : "#15803d",
                          }}
                        >
                          {phase.completed
                            ? "↩ Mark Incomplete"
                            : "✓ Mark Complete"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            )
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* UPCOMING TOPICS */}
      {/* ================================================= */}

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          🎯 Upcoming Learning Topics
        </h2>

        <p style={styles.sectionSubtitle}>
          Topics included in your complete
          career learning journey.
        </p>

        <div
          style={
            styles.upcomingGrid
          }
        >
          {phases
            .flatMap(
              (phase) =>
                Array.isArray(
                  phase.topics
                )
                  ? phase.topics
                  : []
            )
            .map(
              (topic, index) => (
                <div
                  key={index}
                  style={
                    styles.upcomingCard
                  }
                >
                  <span
                    style={
                      styles.checkIcon
                    }
                  >
                    ✓
                  </span>

                  <span>
                    {topic}
                  </span>
                </div>
              )
            )}
        </div>
      </div>

      {/* ================================================= */}
      {/* AI RECOMMENDATION */}
      {/* ================================================= */}

      <div style={styles.aiCard}>
        <div style={styles.aiIcon}>
          🤖
        </div>

        <div>
          <h2 style={styles.aiTitle}>
            AI Career Recommendation
          </h2>

          <p style={styles.aiText}>
            Follow the roadmap phase by phase.
            Complete the learning topics and
            projects before moving to the next stage.
            Building practical projects alongside
            learning will help improve your job readiness.
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* WEEKLY GOAL */}
      {/* ================================================= */}

      <div style={styles.weeklyCard}>
        <div style={styles.weeklyIcon}>
          🎯
        </div>

        <div>
          <h2 style={styles.weeklyTitle}>
            Weekly Goal
          </h2>

          <p style={styles.weeklyText}>
            Focus on completing the current phase,
            practice the recommended topics, and
            build at least one practical project.
          </p>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// STYLES
// ======================================================

const styles = {
  // ====================================================
  // MAIN CONTAINER
  // ====================================================

  container: {
    padding: "30px",
    background:
      "linear-gradient(135deg, #f5f7fb 0%, #eef3ff 100%)",
    minHeight: "100vh",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  // ====================================================
  // SIMPLE LOADING
  // ====================================================

  loadingContainer: {
    minHeight: "80vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#ffffff",
  },

  simpleLoader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingLabel: {
    marginTop: "9px",
    fontSize: "13px",
    fontWeight: "400",
    color: "#333333",
    lineHeight: "1",
  },

  // ====================================================
  // EMPTY ROADMAP
  // ====================================================

  emptyContainer: {
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
    background:
      "linear-gradient(135deg, #f5f7fb, #eaf0ff)",
  },

  emptyCard: {
    width: "620px",
    maxWidth: "90%",
    background: "#fff",
    borderRadius: "24px",
    padding: "55px 45px",
    textAlign: "center",
    boxShadow:
      "0 20px 60px rgba(37,99,235,.12)",
  },

  emptyIcon: {
    fontSize: "75px",
    marginBottom: "20px",
  },

  emptyTitle: {
    margin: "0 0 15px",
    fontSize: "32px",
    color: "#111827",
  },

  emptyText: {
    color: "#6b7280",
    fontSize: "17px",
    lineHeight: "1.7",
    marginBottom: "30px",
  },

  generateButton: {
    background:
      "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "#fff",
    padding: "16px 35px",
    borderRadius: "12px",
    border: "none",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow:
      "0 10px 25px rgba(37,99,235,.25)",
  },

  disabledButton: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  smallText: {
    color: "#9ca3af",
    marginTop: "25px",
    fontSize: "13px",
  },

  // ====================================================
  // HERO
  // ====================================================

  hero: {
    background:
      "linear-gradient(135deg, #1d4ed8, #4f46e5)",
    color: "#fff",
    borderRadius: "22px",
    padding: "35px",
    marginBottom: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
    boxShadow:
      "0 15px 40px rgba(37,99,235,.2)",
  },

  heroIcon: {
    fontSize: "45px",
    marginBottom: "10px",
  },

  heroTitle: {
    fontSize: "32px",
    margin: "0 0 10px",
  },

  heroSubtitle: {
    margin: "0 0 18px",
    opacity: 0.9,
    fontSize: "16px",
  },

  roleBadge: {
    display: "inline-block",
    background:
      "rgba(255,255,255,.15)",
    padding: "10px 16px",
    borderRadius: "10px",
    fontSize: "14px",
  },

  regenerateButton: {
    background: "#fff",
    color: "#2563eb",
    padding: "14px 22px",
    border: "none",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  // ====================================================
  // SUMMARY CARDS
  // ====================================================

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "18px",
    marginBottom: "25px",
  },

  card: {
    background: "#ffffff",
    padding: "20px 22px",
    borderRadius: "12px",
    borderLeft: "4px solid #2563eb",
    borderTop: "1px solid #e5e7eb",
    borderRight: "1px solid #e5e7eb",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow:
      "0 3px 10px rgba(0, 0, 0, 0.05)",
    transition:
      "transform 0.25s ease, box-shadow 0.25s ease",
    cursor: "grab",
    position: "relative",
  },

  cardIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "10px",
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
    flexShrink: 0,
    border: "1px solid #e5e7eb",
  },

  cardLabel: {
    margin: "0 0 5px",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "0.2px",
  },

  cardNumber: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
  },

  // ====================================================
  // SECTIONS
  // ====================================================

  section: {
    background: "#fff",
    padding: "28px",
    borderRadius: "20px",
    marginBottom: "25px",
    boxShadow:
      "0 8px 30px rgba(0,0,0,.06)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "25px",
  },

  sectionTitle: {
    margin: 0,
    color: "#111827",
    fontSize: "23px",
  },

  sectionSubtitle: {
    marginTop: "8px",
    color: "#6b7280",
  },

  // ====================================================
  // TIMELINE
  // ====================================================

  timeline: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },

  phaseCard: {
    display: "flex",
    gap: "20px",
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "25px",
  },

  phaseNumber: {
    minWidth: "52px",
    height: "52px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "700",
  },

  phaseContent: {
    flex: 1,
  },

  phaseHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "20px",
  },

  phaseLabel: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#2563eb",
    letterSpacing: "1px",
  },

  phaseTitle: {
    margin: "5px 0 0",
    fontSize: "22px",
    color: "#111827",
  },

  duration: {
    background: "#e0e7ff",
    color: "#3730a3",
    padding: "8px 13px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
  },

  phaseSection: {
    marginTop: "20px",
  },

  subTitle: {
    marginBottom: "12px",
    color: "#374151",
  },

  topicTag: {
    display: "inline-block",
    padding: "8px 12px",
    margin: "4px",
    background: "#eef2ff",
    color: "#3730a3",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
  },

  tagContainer: {
    display: "flex",
    flexWrap: "wrap",
  },

  list: {
    paddingLeft: "5px",
    listStyle: "none",
  },

  listItem: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
    padding: "10px 0",
    borderBottom:
      "1px solid #f1f5f9",
    color: "#374151",
    lineHeight: "1.5",
  },

  mutedText: {
    color: "#9ca3af",
  },

  noPhase: {
    textAlign: "center",
    padding: "40px",
    background: "#f8fafc",
    borderRadius: "15px",
    color: "#64748b",
  },

  completedBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "20px",
    paddingTop: "15px",
    borderTop:
      "1px solid #e5e7eb",
    fontSize: "14px",
    color: "#475569",
    fontWeight: "600",
  },

  completedDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    display: "inline-block",
  },

  completionButton: {
    marginLeft: "auto",
    padding: "9px 16px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },

  debugDetails: {
    marginTop: "20px",
    textAlign: "left",
  },

  debugPre: {
    background: "#111827",
    color: "#e5e7eb",
    padding: "15px",
    borderRadius: "10px",
    overflowX: "auto",
    fontSize: "12px",
  },

  // ====================================================
  // UPCOMING TOPICS
  // ====================================================

  upcomingGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "12px",
    marginTop: "20px",
  },

  upcomingCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px",
    background: "#f8fafc",
    borderRadius: "10px",
    border:
      "1px solid #e5e7eb",
  },

  checkIcon: {
    width: "25px",
    height: "25px",
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  // ====================================================
  // AI CARD
  // ====================================================

  aiCard: {
    background:
      "linear-gradient(135deg, #eef2ff, #f5f3ff)",
    border:
      "1px solid #c7d2fe",
    borderRadius: "20px",
    padding: "25px",
    display: "flex",
    gap: "20px",
    marginBottom: "25px",
  },

  aiIcon: {
    fontSize: "40px",
  },

  aiTitle: {
    margin: "0 0 8px",
    color: "#3730a3",
  },

  aiText: {
    margin: 0,
    color: "#4b5563",
    lineHeight: "1.6",
  },

  // ====================================================
  // WEEKLY GOAL
  // ====================================================

  weeklyCard: {
    background: "#fff",
    borderRadius: "20px",
    padding: "25px",
    display: "flex",
    gap: "20px",
    alignItems: "center",
    boxShadow:
      "0 8px 30px rgba(0,0,0,.06)",
  },

  weeklyIcon: {
    fontSize: "40px",
  },

  weeklyTitle: {
    margin: "0 0 8px",
    color: "#111827",
  },

  weeklyText: {
    margin: 0,
    color: "#6b7280",
    lineHeight: "1.6",
  },
};