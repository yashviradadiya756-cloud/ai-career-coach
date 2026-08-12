import React, { useEffect, useState } from "react";

import {
  getProgress,
  updateProgress,
} from "../../api/progressApi";

// ============================================================
// PROGRESS PAGE
// ============================================================

export default function Progress() {
  // ==========================================================
  // STATES
  // ==========================================================

  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCertificate, setSelectedCertificate] =
    useState(null);

  // ==========================================================
  // USERNAME
  // ==========================================================

  const getUsername = () => {
    // 1. Direct username
    const directUsername = localStorage.getItem("username");

    if (
      directUsername &&
      directUsername.trim() &&
      directUsername !== "undefined" &&
      directUsername !== "null"
    ) {
      return directUsername.trim();
    }

    // 2. Stored user object
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        if (user?.username) {
          return String(user.username).trim();
        }

        if (user?.name) {
          return String(user.name).trim();
        }
      }
    } catch (err) {
      console.log("Could not read user from localStorage");
    }

    // 3. userData object
    try {
      const storedUserData =
        localStorage.getItem("userData");

      if (storedUserData) {
        const userData = JSON.parse(storedUserData);

        if (userData?.username) {
          return String(userData.username).trim();
        }

        if (userData?.name) {
          return String(userData.name).trim();
        }
      }
    } catch (err) {
      console.log(
        "Could not read userData from localStorage"
      );
    }

    // 4. Name
    const name = localStorage.getItem("name");

    if (
      name &&
      name.trim() &&
      name !== "undefined" &&
      name !== "null"
    ) {
      return name.trim();
    }

    // 5. Final fallback
    return "CareerPilot User";
  };

  const [userName, setUserName] = useState(getUsername());

  // ==========================================================
  // LOAD USERNAME
  // ==========================================================

  useEffect(() => {
    const username = getUsername();

    console.log("Certificate username:", username);

    setUserName(username);
  }, []);

  // ==========================================================
  // LOAD PROGRESS
  // ==========================================================

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError("");

      // Update latest progress
      await updateProgress();

      // Get progress
      const response = await getProgress();

      console.log(
        "Progress API response:",
        response.data
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Failed to load progress."
        );
      }

      setProgress(
        response.data?.progress || null
      );
    } catch (error) {
      console.error(
        "Progress API Error:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load progress."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadProgress();
  }, []);

  // ==========================================================
  // SIMPLE LOADING SPINNER
  // ==========================================================

  if (loading) {
    return (
      <div style={styles.simpleLoadingPage}>
        <div style={styles.spinner}></div>

        <p style={styles.simpleLoadingText}>
          Loading progress...
        </p>
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>⚠️</div>

          <h2>Unable to Load Progress</h2>

          <p>{error}</p>

          <button
            style={styles.retryButton}
            onClick={loadProgress}
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================
  // NO DATA
  // ==========================================================

  if (!progress) {
    return (
      <div style={styles.page}>
        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>📈</div>

          <h2>No Progress Data Found</h2>

          <p>
            Start using CareerPilot features to
            build your career progress.
          </p>

          <button
            style={styles.retryButton}
            onClick={loadProgress}
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================
  // SAFE PROGRESS VALUES
  // ==========================================================

  const overallProgress = Math.min(
    100,
    Math.max(
      0,
      Number(progress.overallProgress) || 0
    )
  );

  const resumeScore = Math.min(
    100,
    Math.max(
      0,
      Number(progress.resumeScore) || 0
    )
  );

  const interviewScore = Math.min(
    100,
    Math.max(
      0,
      Number(progress.interviewScore) || 0
    )
  );

  const roadmapProgress = Math.min(
    100,
    Math.max(
      0,
      Number(progress.roadmapCompleted) || 0
    )
  );

  const learningProgress = Math.min(
    100,
    Math.max(
      0,
      Number(progress.learningCompleted) || 0
    )
  );

  // ==========================================================
  // CAREER LEVEL
  // ==========================================================

  let careerLevel = "Getting Started";

  let careerMessage =
    "Start completing your CareerPilot activities.";

  if (overallProgress >= 90) {
    careerLevel = "Placement Ready";

    careerMessage =
      "Excellent! You are highly prepared for your career journey.";
  } else if (overallProgress >= 75) {
    careerLevel = "Almost Ready";

    careerMessage =
      "Great progress! Complete a few more activities to become placement ready.";
  } else if (overallProgress >= 50) {
    careerLevel = "Making Progress";

    careerMessage =
      "Good work! Continue improving your skills and completing your roadmap.";
  } else if (overallProgress >= 25) {
    careerLevel = "Building Skills";

    careerMessage =
      "You are moving forward. Keep learning and practicing.";
  }

  // ==========================================================
  // PROGRESS ITEMS
  // ==========================================================

  const progressItems = [
    {
      id: "resume",
      title: "Resume & ATS",
      subtitle:
        "Improve your resume and make it job-ready.",
      value: resumeScore,
      icon: "📄",
      color: "#2563eb",
      lightColor: "#eff6ff",
    },
    {
      id: "interview",
      title: "Mock Interview",
      subtitle:
        "Practice technical and HR interview questions.",
      value: interviewScore,
      icon: "🎤",
      color: "#16a34a",
      lightColor: "#f0fdf4",
    },
    {
      id: "roadmap",
      title: "Career Roadmap",
      subtitle:
        "Complete your recommended career roadmap.",
      value: roadmapProgress,
      icon: "🗺️",
      color: "#f59e0b",
      lightColor: "#fffbeb",
    },
    {
      id: "learning",
      title: "Learning & Courses",
      subtitle:
        "Learn new skills and complete courses.",
      value: learningProgress,
      icon: "📚",
      color: "#9333ea",
      lightColor: "#faf5ff",
    },
  ];

  // ==========================================================
  // CERTIFICATES
  // ==========================================================

  const certificates = [
    {
      id: "career-readiness",
      title: "Career Readiness Certificate",
      shortTitle: "Career Ready",
      icon: "🏆",
      description:
        "Awarded for achieving strong overall career preparation through CareerPilot.",
      requirement:
        "Overall progress must reach 80%.",
      progress: overallProgress,
      required: 80,
      unlocked: overallProgress >= 80,
      color: "#2563eb",
    },
    {
      id: "resume-excellence",
      title: "Resume Excellence Certificate",
      shortTitle: "Resume Excellence",
      icon: "📄",
      description:
        "Recognizes a strong ATS-friendly resume prepared for job applications.",
      requirement:
        "Resume score must reach 80%.",
      progress: resumeScore,
      required: 80,
      unlocked: resumeScore >= 80,
      color: "#16a34a",
    },
    {
      id: "interview-ready",
      title: "Interview Ready Certificate",
      shortTitle: "Interview Ready",
      icon: "🎤",
      description:
        "Awarded for demonstrating strong interview preparation and performance.",
      requirement:
        "Interview score must reach 80%.",
      progress: interviewScore,
      required: 80,
      unlocked: interviewScore >= 80,
      color: "#f59e0b",
    },
    {
      id: "roadmap-completion",
      title: "Career Roadmap Completion",
      shortTitle: "Roadmap Complete",
      icon: "🗺️",
      description:
        "Recognizes successful completion of the recommended career roadmap.",
      requirement:
        "Career roadmap must reach 100%.",
      progress: roadmapProgress,
      required: 100,
      unlocked: roadmapProgress >= 100,
      color: "#9333ea",
    },
    {
      id: "learning-achievement",
      title: "Learning Achievement Certificate",
      shortTitle: "Learning Achievement",
      icon: "📚",
      description:
        "Awarded for completing your recommended learning journey.",
      requirement:
        "Learning progress must reach 100%.",
      progress: learningProgress,
      required: 100,
      unlocked: learningProgress >= 100,
      color: "#0891b2",
    },
    {
      id: "placement-ready",
      title: "Placement Ready Certificate",
      shortTitle: "Placement Ready",
      icon: "🚀",
      description:
        "The highest CareerPilot achievement for users who are strongly prepared for placements.",
      requirement:
        "Overall progress ≥ 90%, Resume ≥ 80%, Interview ≥ 80%.",
      progress: Math.round(
        (
          overallProgress +
          resumeScore +
          interviewScore
        ) / 3
      ),
      required: 90,
      unlocked:
        overallProgress >= 90 &&
        resumeScore >= 80 &&
        interviewScore >= 80,
      color: "#dc2626",
    },
  ];

  // ==========================================================
  // UNLOCKED COUNT
  // ==========================================================

  const unlockedCertificates =
    certificates.filter(
      (certificate) =>
        certificate.unlocked
    ).length;

  // ==========================================================
  // PRINT CERTIFICATE
  // ==========================================================

  const printCertificate = () => {
    if (!selectedCertificate) {
      return;
    }

    window.print();
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div style={styles.page}>
      <div
        style={styles.container}
        className="progress-page-container"
      >
        {/* HEADER */}

        <div style={styles.header}>
          <div>
            <div style={styles.headerBadge}>
              📈 Career Analytics
            </div>

            <h1 style={styles.headerTitle}>
              My Progress
            </h1>

            <p style={styles.headerSubtitle}>
              Track your career preparation,
              learning, interview performance
              and achievements.
            </p>
          </div>

          <button
            style={styles.refreshButton}
            onClick={loadProgress}
          >
            🔄 Refresh
          </button>
        </div>

        {/* SUMMARY */}

        <div
          style={styles.summaryGrid}
          className="progress-summary-grid"
        >
          {/* Overall Progress */}

          <div style={styles.overallCard}>
            <div style={styles.overallLeft}>
              <div style={styles.overallIcon}>
                🎯
              </div>

              <div>
                <p style={styles.smallLabel}>
                  OVERALL CAREER PROGRESS
                </p>

                <h2 style={styles.overallTitle}>
                  {overallProgress}%
                </h2>

                <p style={styles.overallMessage}>
                  {careerMessage}
                </p>
              </div>
            </div>

            <div style={styles.circleWrapper}>
              <div
                style={{
                  ...styles.progressCircle,
                  background:
                    `conic-gradient(
                      #2563eb
                      ${overallProgress * 3.6}deg,
                      #e5e7eb 0deg
                    )`,
                }}
              >
                <div style={styles.circleInner}>
                  <strong>
                    {overallProgress}%
                  </strong>

                  <span>
                    Complete
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Career Level */}

          <div style={styles.levelCard}>
            <div style={styles.levelIcon}>
              🚀
            </div>

            <p style={styles.smallLabel}>
              CURRENT LEVEL
            </p>

            <h2 style={styles.levelTitle}>
              {careerLevel}
            </h2>

            <div style={styles.levelTrack}>
              <div
                style={{
                  ...styles.levelFill,
                  width:
                    `${overallProgress}%`,
                }}
              />
            </div>

            <p style={styles.levelText}>
              {overallProgress < 100
                ? `${100 - overallProgress}% more to reach 100%`
                : "You have completed your career journey!"}
            </p>
          </div>
        </div>

        {/* CAREER PERFORMANCE */}

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                📊 Career Performance
              </h2>

              <p style={styles.sectionSubtitle}>
                Understand how you are performing
                in each area of your career journey.
              </p>
            </div>
          </div>

          <div style={styles.performanceList}>
            {progressItems.map((item) => (
              <div
                key={item.id}
                style={styles.performanceItem}
              >
                <div style={styles.performanceTop}>
                  <div style={styles.performanceInfo}>
                    <div
                      style={{
                        ...styles.performanceIcon,
                        background:
                          item.lightColor,
                      }}
                    >
                      {item.icon}
                    </div>

                    <div>
                      <h3
                        style={
                          styles.performanceTitle
                        }
                      >
                        {item.title}
                      </h3>

                      <p
                        style={
                          styles.performanceSubtitle
                        }
                      >
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div
                    style={
                      styles.performanceValue
                    }
                  >
                    {item.value}%
                  </div>
                </div>

                <div style={styles.barContainer}>
                  <div
                    style={{
                      ...styles.barFill,
                      width:
                        `${item.value}%`,
                      background:
                        item.color,
                    }}
                  />
                </div>

                <div style={styles.barBottom}>
                  <span>
                    {item.value === 0
                      ? "Not started"
                      : item.value < 50
                      ? "Needs improvement"
                      : item.value < 80
                      ? "Good progress"
                      : item.value < 100
                      ? "Almost complete"
                      : "Completed"}
                  </span>

                  <span>
                    {item.value}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CERTIFICATES */}

        <div style={styles.section}>
          <div style={styles.certificateHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                🏆 Certificates & Achievements
              </h2>

              <p style={styles.sectionSubtitle}>
                Complete CareerPilot milestones
                to unlock professional achievement
                certificates.
              </p>
            </div>

            <div
              style={
                styles.certificateCounter
              }
            >
              <strong>
                {unlockedCertificates}
              </strong>

              <span>
                {" "} / {certificates.length} Unlocked
              </span>
            </div>
          </div>

          <div
            style={styles.certificateGrid}
            className="progress-certificate-grid"
          >
            {certificates.map(
              (certificate) => (
                <div
                  key={certificate.id}
                  style={{
                    ...styles.certificateCard,
                    opacity:
                      certificate.unlocked
                        ? 1
                        : 0.82,
                  }}
                >
                  {/* Certificate Header */}

                  <div
                    style={{
                      ...styles.certificateTop,
                      background:
                        certificate.unlocked
                          ? `linear-gradient(
                              135deg,
                              ${certificate.color},
                              #1e293b
                            )`
                          : "#64748b",
                    }}
                  >
                    <div
                      style={
                        styles.certificateIcon
                      }
                    >
                      {certificate.icon}
                    </div>

                    <div
                      style={
                        styles.certificateStatus
                      }
                    >
                      {certificate.unlocked
                        ? "✓ UNLOCKED"
                        : "🔒 LOCKED"}
                    </div>
                  </div>

                  {/* Certificate Body */}

                  <div
                    style={
                      styles.certificateBody
                    }
                  >
                    <h3
                      style={
                        styles.certificateTitle
                      }
                    >
                      {certificate.title}
                    </h3>

                    <p
                      style={
                        styles.certificateDescription
                      }
                    >
                      {certificate.description}
                    </p>

                    <div
                      style={
                        styles.requirementBox
                      }
                    >
                      <span>
                        Requirement
                      </span>

                      <strong>
                        {certificate.requirement}
                      </strong>
                    </div>

                    <div
                      style={
                        styles.certificateProgressTop
                      }
                    >
                      <span>
                        Progress
                      </span>

                      <strong>
                        {certificate.progress}%
                      </strong>
                    </div>

                    <div
                      style={
                        styles.certificateProgressBar
                      }
                    >
                      <div
                        style={{
                          ...styles.certificateProgressFill,
                          width:
                            `${Math.min(
                              100,
                              (
                                certificate.progress /
                                certificate.required
                              ) * 100
                            )}%`,
                          background:
                            certificate.unlocked
                              ? certificate.color
                              : "#94a3b8",
                        }}
                      />
                    </div>

                    {certificate.unlocked ? (
                      <button
                        style={{
                          ...styles.viewCertificateButton,
                          background:
                            certificate.color,
                        }}
                        onClick={() =>
                          setSelectedCertificate(
                            certificate
                          )
                        }
                      >
                        🏆 View Certificate
                      </button>
                    ) : (
                      <button
                        style={
                          styles.lockedButton
                        }
                        disabled
                      >
                        🔒 Complete Requirement
                      </button>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* BOTTOM SECTION */}

        <div
          style={styles.bottomGrid}
          className="progress-bottom-grid"
        >
          {/* Career Activity */}

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              🔥 Career Activity
            </h2>

            <p style={styles.sectionSubtitle}>
              Your main CareerPilot activities.
            </p>

            <div style={styles.activityList}>
              {/* Resume */}

              <div style={styles.activityItem}>
                <div
                  style={{
                    ...styles.activityIcon,
                    background: "#eff6ff",
                  }}
                >
                  📄
                </div>

                <div>
                  <strong>
                    Resume Analysis
                  </strong>

                  <p>
                    Current score:{" "}
                    {resumeScore}%
                  </p>
                </div>

                <span
                  style={{
                    ...styles.activityBadge,
                    background:
                      resumeScore >= 80
                        ? "#dcfce7"
                        : "#fef3c7",
                    color:
                      resumeScore >= 80
                        ? "#166534"
                        : "#92400e",
                  }}
                >
                  {resumeScore >= 80
                    ? "Strong"
                    : "Improve"}
                </span>
              </div>

              {/* Interview */}

              <div style={styles.activityItem}>
                <div
                  style={{
                    ...styles.activityIcon,
                    background: "#f0fdf4",
                  }}
                >
                  🎤
                </div>

                <div>
                  <strong>
                    Mock Interview
                  </strong>

                  <p>
                    Current score:{" "}
                    {interviewScore}%
                  </p>
                </div>

                <span
                  style={{
                    ...styles.activityBadge,
                    background:
                      interviewScore >= 80
                        ? "#dcfce7"
                        : "#fef3c7",
                    color:
                      interviewScore >= 80
                        ? "#166534"
                        : "#92400e",
                  }}
                >
                  {interviewScore >= 80
                    ? "Ready"
                    : "Practice"}
                </span>
              </div>

              {/* Roadmap */}

              <div style={styles.activityItem}>
                <div
                  style={{
                    ...styles.activityIcon,
                    background: "#fffbeb",
                  }}
                >
                  🗺️
                </div>

                <div>
                  <strong>
                    Career Roadmap
                  </strong>

                  <p>
                    {roadmapProgress}% completed
                  </p>
                </div>

                <span
                  style={{
                    ...styles.activityBadge,
                    background: "#fef3c7",
                    color: "#92400e",
                  }}
                >
                  {roadmapProgress >= 100
                    ? "Done"
                    : "In Progress"}
                </span>
              </div>

              {/* Learning */}

              <div style={styles.activityItem}>
                <div
                  style={{
                    ...styles.activityIcon,
                    background: "#faf5ff",
                  }}
                >
                  📚
                </div>

                <div>
                  <strong>
                    Learning
                  </strong>

                  <p>
                    {learningProgress}% completed
                  </p>
                </div>

                <span
                  style={{
                    ...styles.activityBadge,
                    background: "#ede9fe",
                    color: "#6d28d9",
                  }}
                >
                  Learning
                </span>
              </div>
            </div>
          </div>

          {/* AI Suggestion */}

          <div style={styles.aiCard}>
            <div style={styles.aiIcon}>
              🤖
            </div>

            <h2>
              AI Career Suggestion
            </h2>

            {overallProgress < 50 ? (
              <p>
                Focus on building your foundation.
                Complete your roadmap activities
                and improve your resume and
                interview skills.
              </p>
            ) : overallProgress < 80 ? (
              <p>
                You are making good progress!
                Focus on your weaker areas and
                continue completing learning
                activities.
              </p>
            ) : (
              <p>
                Excellent progress! Focus on
                interview practice, real-world
                projects and placement preparation.
              </p>
            )}

            <div style={styles.aiFocusBox}>
              <strong>
                🎯 Recommended Focus
              </strong>

              <span>
                {resumeScore < 80
                  ? "Improve your resume"
                  : interviewScore < 80
                  ? "Practice mock interviews"
                  : roadmapProgress < 100
                  ? "Complete your career roadmap"
                  : learningProgress < 100
                  ? "Complete more courses"
                  : "Prepare for placements"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================
          CERTIFICATE MODAL
      ==================================================== */}

      {selectedCertificate && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            {/* Close */}

            <button
              style={styles.closeButton}
              onClick={() =>
                setSelectedCertificate(null)
              }
            >
              ✕
            </button>

            {/* Certificate */}

            <div
              className="print-certificate"
              style={styles.achievementCertificate}
            >
              <div
                style={
                  styles.certificateOuterBorder
                }
              >
                <div
                  style={
                    styles.certificateInnerBorder
                  }
                >
                  {/* Decorations */}

                  <div
                    style={{
                      ...styles.cornerDiamond,
                      ...styles.topDiamond,
                    }}
                  >
                    ◈
                  </div>

                  <div
                    style={{
                      ...styles.cornerDiamond,
                      ...styles.leftDiamond,
                    }}
                  >
                    ◈
                  </div>

                  <div
                    style={{
                      ...styles.cornerDiamond,
                      ...styles.rightDiamond,
                    }}
                  >
                    ◈
                  </div>

                  <div
                    style={{
                      ...styles.cornerDiamond,
                      ...styles.bottomDiamond,
                    }}
                  >
                    ◈
                  </div>

                  {/* Certificate Content */}

                  <div
                    style={
                      styles.achievementContent
                    }
                  >
                    {/* Compass */}

                    <div
                      style={
                        styles.compassLogo
                      }
                    >
                      <div
                        style={
                          styles.compassOuter
                        }
                      >
                        <span
                          style={
                            styles.compassNorth
                          }
                        >
                          ▲
                        </span>

                        <span
                          style={
                            styles.compassEast
                          }
                        >
                          ▶
                        </span>

                        <span
                          style={
                            styles.compassSouth
                          }
                        >
                          ▼
                        </span>

                        <span
                          style={
                            styles.compassWest
                          }
                        >
                          ◀
                        </span>

                        <div
                          style={
                            styles.compassCenter
                          }
                        >
                          ✦
                        </div>
                      </div>
                    </div>

                    {/* Title */}

                    <h1
                      style={
                        styles.achievementTitle
                      }
                    >
                      Certificate of Achievement
                    </h1>

                    <p
                      style={
                        styles.certifyText
                      }
                    >
                      This is to certify that
                    </p>

                    {/* Username */}

                    <h2
                      style={
                        styles.recipientName
                      }
                    >
                      {userName}
                    </h2>

                    <div
                      style={
                        styles.recipientLine
                      }
                    />

                    {/* Description */}

                    <p
                      style={
                        styles.achievementDescription
                      }
                    >
                      has successfully completed
                      the{" "}
                      <strong>
                        CareerPilot AI Career
                        Coaching program.
                      </strong>
                    </p>

                    {/* Certificate Type */}

                    <p
                      style={
                        styles.achievementName
                      }
                    >
                      {selectedCertificate.title}
                    </p>

                    {/* Signature */}

                    <div
                      style={
                        styles.signatureArea
                      }
                    >
                      <div
                        style={
                          styles.signatureBox
                        }
                      >
                        <div
                          style={
                            styles.signatureLine
                          }
                        />

                        <span
                          style={
                            styles.signatureLabel
                          }
                        >
                          Signatory
                        </span>
                      </div>

                      <div
                        style={
                          styles.signatureBox
                        }
                      >
                        <div
                          style={
                            styles.signatureLine
                          }
                        />

                        <span
                          style={
                            styles.signatureLabel
                          }
                        >
                          {new Date().toLocaleDateString()}
                        </span>

                        <span
                          style={
                            styles.dateLabel
                          }
                        >
                          Date
                        </span>
                      </div>
                    </div>

                    {/* Footer */}

                    <div
                      style={
                        styles.certificateFooter
                      }
                    >
                      CareerPilot • AI Career Coach
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Buttons */}

            <div
              style={styles.modalActions}
              className="modalActions"
            >
              <button
                style={styles.cancelButton}
                onClick={() =>
                  setSelectedCertificate(null)
                }
              >
                Close
              </button>

              <button
                style={{
                  ...styles.printButton,
                  background:
                    selectedCertificate.color,
                }}
                onClick={printCertificate}
              >
                🖨️ Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          CSS
      ==================================================== */}

      <style>
        {`

          /* SIMPLE LOADING SPINNER */

          @keyframes progressSpin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          /* PRINT */

          @media print {

            @page {
              size: landscape;
              margin: 0;
            }

            html,
            body {
              margin: 0 !important;
              padding: 0 !important;
              background: #050505 !important;
            }

            body * {
              visibility: hidden !important;
            }

            .print-certificate,
            .print-certificate * {
              visibility: visible !important;
            }

            .print-certificate {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100vw !important;
              height: 100vh !important;
              max-width: none !important;
              margin: 0 !important;
              padding: 0 !important;
              border: none !important;
              border-radius: 0 !important;
              box-shadow: none !important;
              background: #050505 !important;

              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .modalActions,
            .closeButton {
              display: none !important;
            }
          }

          /* TABLET */

          @media (max-width: 1000px) {

            .progress-page-container {
              padding: 20px !important;
            }

          }

          /* MOBILE */

          @media (max-width: 750px) {

            .progress-summary-grid {
              grid-template-columns: 1fr !important;
            }

            .progress-certificate-grid {
              grid-template-columns: 1fr !important;
            }

            .progress-bottom-grid {
              grid-template-columns: 1fr !important;
            }

            .achievementContent {
              padding: 30px 20px !important;
            }

            .achievementTitle {
              font-size: 21px !important;
            }

            .recipientName {
              font-size: 28px !important;
            }

            .header {
              flex-direction: column !important;
              align-items: flex-start !important;
            }

          }

          /* SMALL MOBILE */

          @media (max-width: 500px) {

            .progress-page-container {
              padding: 12px !important;
            }

            .achievementTitle {
              font-size: 18px !important;
            }

            .recipientName {
              font-size: 23px !important;
            }

            .certifyText {
              font-size: 11px !important;
            }

            .achievementDescription {
              font-size: 10px !important;
            }

          }

        `}
      </style>
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = {

  // ==========================================================
  // PAGE
  // ==========================================================

  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "20px",
    boxSizing: "border-box",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    color: "#111827",
  },

  container: {
    width: "100%",
    maxWidth: "1250px",
    margin: "0 auto",
  },

  // ==========================================================
  // SIMPLE LOADING
  // ==========================================================

  simpleLoadingPage: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f7fb",
  },

  spinner: {
    width: "42px",
    height: "42px",
    border: "4px solid #dbeafe",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    animation:
      "progressSpin 0.8s linear infinite",
  },

  simpleLoadingText: {
    marginTop: "14px",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "600",
  },

  // ==========================================================
  // ERROR
  // ==========================================================

  errorCard: {
    maxWidth: "500px",
    margin: "100px auto",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "50px 30px",
    textAlign: "center",
    boxShadow:
      "0 10px 30px rgba(15,23,42,0.08)",
  },

  errorIcon: {
    fontSize: "45px",
    marginBottom: "10px",
  },

  retryButton: {
    marginTop: "15px",
    padding: "12px 22px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },

  emptyCard: {
    maxWidth: "500px",
    margin: "100px auto",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "50px 30px",
    textAlign: "center",
    boxShadow:
      "0 10px 30px rgba(15,23,42,0.08)",
  },

  emptyIcon: {
    fontSize: "50px",
  },

  // ==========================================================
  // HEADER
  // ==========================================================

  header: {
    background: "#ffffff",
    padding: "25px 28px",
    borderRadius: "18px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    boxShadow:
      "0 4px 18px rgba(15,23,42,0.06)",
  },

  headerBadge: {
    display: "inline-block",
    background: "#eff6ff",
    color: "#2563eb",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "10px",
  },

  headerTitle: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "800",
    letterSpacing: "-0.5px",
  },

  headerSubtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  refreshButton: {
    padding: "11px 18px",
    border: "1px solid #dbeafe",
    borderRadius: "10px",
    background: "#eff6ff",
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  // ==========================================================
  // SUMMARY
  // ==========================================================

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 2fr) minmax(280px, 1fr)",
    gap: "20px",
    marginBottom: "20px",
  },

  overallCard: {
    background:
      "linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)",
    borderRadius: "18px",
    padding: "25px",
    minHeight: "170px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    boxShadow:
      "0 4px 18px rgba(15,23,42,0.06)",
    boxSizing: "border-box",
  },

  overallLeft: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
  },

  overallIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    flexShrink: 0,
  },

  smallLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "0.07em",
  },

  overallTitle: {
    margin: "5px 0",
    fontSize: "38px",
    color: "#2563eb",
  },

  overallMessage: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.5",
    maxWidth: "430px",
  },

  circleWrapper: {
    flexShrink: 0,
  },

  progressCircle: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  circleInner: {
    width: "91px",
    height: "91px",
    borderRadius: "50%",
    background: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  levelCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "25px",
    boxShadow:
      "0 4px 18px rgba(15,23,42,0.06)",
  },

  levelIcon: {
    fontSize: "30px",
    marginBottom: "10px",
  },

  levelTitle: {
    margin: "5px 0 16px",
    fontSize: "23px",
  },

  levelTrack: {
    width: "100%",
    height: "9px",
    borderRadius: "20px",
    background: "#e2e8f0",
    overflow: "hidden",
  },

  levelFill: {
    height: "100%",
    background:
      "linear-gradient(90deg, #2563eb, #7c3aed)",
    borderRadius: "20px",
    transition: "width 0.6s ease",
  },

  levelText: {
    color: "#64748b",
    fontSize: "12px",
    marginBottom: 0,
  },

  // ==========================================================
  // SECTION
  // ==========================================================

  section: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "25px",
    marginBottom: "20px",
    boxShadow:
      "0 4px 18px rgba(15,23,42,0.06)",
  },

  sectionHeader: {
    marginBottom: "25px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "21px",
    fontWeight: "800",
  },

  sectionSubtitle: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  // ==========================================================
  // PERFORMANCE
  // ==========================================================

  performanceList: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },

  performanceItem: {
    paddingBottom: "22px",
    borderBottom: "1px solid #f1f5f9",
  },

  performanceTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "12px",
  },

  performanceInfo: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  performanceIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    flexShrink: 0,
  },

  performanceTitle: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "700",
  },

  performanceSubtitle: {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
  },

  performanceValue: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#1e293b",
  },

  barContainer: {
    width: "100%",
    height: "13px",
    background: "#eef2f7",
    borderRadius: "20px",
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    borderRadius: "20px",
    transition: "width 0.7s ease",
    minWidth: "2px",
  },

  barBottom: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "7px",
    color: "#94a3b8",
    fontSize: "11px",
  },

  // ==========================================================
  // CERTIFICATE
  // ==========================================================

  certificateHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "25px",
  },

  certificateCounter: {
    padding: "10px 16px",
    borderRadius: "12px",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },

  certificateGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "18px",
  },

  certificateCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    overflow: "hidden",
    background: "#ffffff",
    boxShadow:
      "0 3px 12px rgba(15,23,42,0.04)",
  },

  certificateTop: {
    minHeight: "115px",
    padding: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    color: "#ffffff",
  },

  certificateIcon: {
    width: "55px",
    height: "55px",
    borderRadius: "15px",
    background:
      "rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "27px",
  },

  certificateStatus: {
    fontSize: "10px",
    fontWeight: "800",
    background:
      "rgba(255,255,255,0.16)",
    padding: "6px 8px",
    borderRadius: "20px",
  },

  certificateBody: {
    padding: "20px",
  },

  certificateTitle: {
    margin: "0 0 8px",
    fontSize: "16px",
    lineHeight: "1.35",
  },

  certificateDescription: {
    color: "#64748b",
    fontSize: "12px",
    lineHeight: "1.6",
    minHeight: "58px",
    margin: "0 0 13px",
  },

  requirementBox: {
    background: "#f8fafc",
    borderRadius: "9px",
    padding: "10px",
    marginBottom: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  certificateProgressTop: {
    display: "flex",
    justifyContent: "space-between",
    color: "#64748b",
    fontSize: "11px",
    marginBottom: "6px",
  },

  certificateProgressBar: {
    height: "7px",
    background: "#e2e8f0",
    borderRadius: "20px",
    overflow: "hidden",
  },

  certificateProgressFill: {
    height: "100%",
    borderRadius: "20px",
    transition: "width 0.5s ease",
  },

  viewCertificateButton: {
    width: "100%",
    border: "none",
    color: "#ffffff",
    padding: "11px",
    borderRadius: "9px",
    marginTop: "16px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
  },

  lockedButton: {
    width: "100%",
    border: "none",
    background: "#f1f5f9",
    color: "#94a3b8",
    padding: "11px",
    borderRadius: "9px",
    marginTop: "16px",
    cursor: "not-allowed",
    fontWeight: "700",
    fontSize: "13px",
  },

  // ==========================================================
  // BOTTOM
  // ==========================================================

  bottomGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.5fr) minmax(280px, 1fr)",
    gap: "20px",
  },

  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "20px",
  },

  activityItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    borderRadius: "12px",
    background: "#f8fafc",
  },

  activityIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    flexShrink: 0,
  },

  activityBadge: {
    marginLeft: "auto",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "800",
  },

  // ==========================================================
  // AI
  // ==========================================================

  aiCard: {
    background:
      "linear-gradient(135deg, #eff6ff, #f5f3ff)",
    borderRadius: "18px",
    padding: "28px",
    marginBottom: "20px",
    border: "1px solid #dbeafe",
  },

  aiIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "15px",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    marginBottom: "15px",
  },

  aiFocusBox: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    background: "#ffffff",
    borderRadius: "12px",
    padding: "14px",
    marginTop: "20px",
    fontSize: "13px",
  },

  // ==========================================================
  // MODAL
  // ==========================================================

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(15,23,42,0.75)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    overflowY: "auto",
  },

  modal: {
    width: "100%",
    maxWidth: "950px",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "20px",
    position: "relative",
    boxShadow:
      "0 25px 60px rgba(0,0,0,0.25)",
  },

  closeButton: {
    position: "absolute",
    right: "20px",
    top: "20px",
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    border: "none",
    background: "#f1f5f9",
    color: "#334155",
    cursor: "pointer",
    fontWeight: "700",
    zIndex: 20,
  },

  // ==========================================================
  // CERTIFICATE DESIGN
  // ==========================================================

  achievementCertificate: {
    width: "100%",
    maxWidth: "850px",
    aspectRatio: "1.414 / 1",
    background: "#050505",
    margin: "10px auto 0",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
    fontFamily:
      "Georgia, 'Times New Roman', serif",
    color: "#ffffff",
  },

  certificateOuterBorder: {
    position: "absolute",
    inset: "25px",
    border: "3px solid #77736b",
    boxSizing: "border-box",
    padding: "7px",
  },

  certificateInnerBorder: {
    width: "100%",
    height: "100%",
    border: "1px solid #a98b72",
    boxSizing: "border-box",
    position: "relative",
  },

  achievementContent: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "center",
    boxSizing: "border-box",
    padding: "48px 55px 35px",
  },

  // ==========================================================
  // DECORATIVE DIAMONDS
  // ==========================================================

  cornerDiamond: {
    position: "absolute",
    zIndex: 5,
    color: "#a9795d",
    fontSize: "38px",
    fontFamily: "Georgia, serif",
    lineHeight: 1,
    textShadow:
      "0 0 2px #a9795d",
  },

  topDiamond: {
    top: "-22px",
    left: "50%",
    transform: "translateX(-50%)",
  },

  bottomDiamond: {
    bottom: "-22px",
    left: "50%",
    transform: "translateX(-50%)",
  },

  leftDiamond: {
    left: "-22px",
    top: "50%",
    transform: "translateY(-50%)",
  },

  rightDiamond: {
    right: "-22px",
    top: "50%",
    transform: "translateY(-50%)",
  },

  // ==========================================================
  // COMPASS
  // ==========================================================

  compassLogo: {
    marginBottom: "12px",
  },

  compassOuter: {
    width: "76px",
    height: "76px",
    borderRadius: "50%",
    border: "2px solid #087db5",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#087db5",
    boxSizing: "border-box",
  },

  compassNorth: {
    position: "absolute",
    top: "3px",
    fontSize: "17px",
  },

  compassEast: {
    position: "absolute",
    right: "3px",
    fontSize: "13px",
  },

  compassSouth: {
    position: "absolute",
    bottom: "3px",
    fontSize: "17px",
  },

  compassWest: {
    position: "absolute",
    left: "3px",
    fontSize: "13px",
  },

  compassCenter: {
    width: "32px",
    height: "32px",
    border: "1px solid #087db5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#087db5",
    fontSize: "22px",
    transform: "rotate(45deg)",
  },

  // ==========================================================
  // CERTIFICATE TITLE
  // ==========================================================

  achievementTitle: {
    margin: "3px 0 20px",
    color: "#c7a58d",
    fontSize: "27px",
    fontWeight: "700",
    letterSpacing: "-0.3px",
  },

  certifyText: {
    margin: "0 0 10px",
    color: "#ffffff",
    fontSize: "15px",
  },

  // ==========================================================
  // RECIPIENT NAME
  // ==========================================================

  recipientName: {
    margin: "7px 0 0",
    color: "#079de0",
    fontSize: "36px",
    fontFamily:
      "'Brush Script MT', 'Segoe Script', cursive",
    fontWeight: "400",
    fontStyle: "italic",
    letterSpacing: "1px",
  },

  recipientLine: {
    width: "65%",
    height: "1px",
    background: "#bdbdbd",
    margin: "0 auto 15px",
  },

  // ==========================================================
  // DESCRIPTION
  // ==========================================================

  achievementDescription: {
    maxWidth: "650px",
    margin: "0 auto",
    color: "#ffffff",
    fontSize: "14px",
    lineHeight: "1.45",
  },

  achievementName: {
    margin: "10px 0 0",
    color: "#c7a58d",
    fontSize: "15px",
    fontWeight: "700",
  },

  // ==========================================================
  // SIGNATURE
  // ==========================================================

  signatureArea: {
    width: "78%",
    display: "flex",
    justifyContent: "space-between",
    gap: "70px",
    marginTop: "auto",
  },

  signatureBox: {
    width: "35%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  signatureLine: {
    width: "100%",
    height: "1px",
    background: "#bdbdbd",
    marginBottom: "6px",
  },

  signatureLabel: {
    color: "#ffffff",
    fontSize: "11px",
  },

  dateLabel: {
    color: "#a5a5a5",
    fontSize: "9px",
    marginTop: "2px",
  },

  certificateFooter: {
    position: "absolute",
    bottom: "8px",
    left: "50%",
    transform: "translateX(-50%)",
    color: "#8b7769",
    fontSize: "8px",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },

  // ==========================================================
  // MODAL BUTTONS
  // ==========================================================

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "15px",
  },

  cancelButton: {
    padding: "11px 20px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "600",
  },

  printButton: {
    padding: "11px 20px",
    border: "none",
    color: "#ffffff",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "700",
  },
};