import React, { useEffect, useRef, useState } from "react";

import {
  askCoach,
  getCoachHistory,
  getCoachDashboard,
} from "../../api/coachApi";

export default function AICoach() {
  // =========================================================
  // STATES
  // =========================================================

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [scoreLoading, setScoreLoading] = useState(true);

  const [activeFocus, setActiveFocus] = useState("Career");

  const [copiedIndex, setCopiedIndex] = useState(null);

  const [scores, setScores] = useState({
    careerScore: 0,
    roadmapProgress: 0,
    resumeScore: 0,
    interviewScore: 0,
  });

  const chatEndRef = useRef(null);
  const chatAreaRef = useRef(null);

  // =========================================================
  // DATA
  // =========================================================

  const focusOptions = [
    {
      name: "Career",
      icon: "🎯",
      color: "#2563eb",
      description: "Career direction & planning",
    },
    {
      name: "Resume",
      icon: "📄",
      color: "#f59e0b",
      description: "Resume & ATS improvement",
    },
    {
      name: "Skills",
      icon: "🧠",
      color: "#7c3aed",
      description: "Skills & learning",
    },
    {
      name: "Interview",
      icon: "🎤",
      color: "#dc2626",
      description: "Interview preparation",
    },
    {
      name: "Jobs",
      icon: "💼",
      color: "#16a34a",
      description: "Jobs & placements",
    },
  ];

  const suggestions = [
    "How can I improve my resume?",
    "What skills should I learn for a developer job?",
    "Create a 6-month career roadmap for me",
    "Prepare me for a technical interview",
    "What projects should I build for placements?",
    "How can I improve my interview confidence?",
  ];

  const tips = [
    {
      icon: "💻",
      title: "Build Projects",
      text: "Create practical projects that demonstrate your real-world skills.",
    },
    {
      icon: "📚",
      title: "Keep Learning",
      text: "Spend consistent time improving the skills required for your target role.",
    },
    {
      icon: "🎤",
      title: "Practice Interviews",
      text: "Practice both technical and HR questions before applying.",
    },
    {
      icon: "🚀",
      title: "Apply Regularly",
      text: "Keep applying to internships and entry-level opportunities.",
    },
  ];

  // =========================================================
  // LOAD DATA
  // =========================================================

  useEffect(() => {
    // Always open this page from the top.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    loadDashboardScores();
    loadHistory();
  }, []);

  // =========================================================
  // AUTO SCROLL INSIDE CHAT ONLY
  // IMPORTANT:
  // Do NOT use scrollIntoView() here because it scrolls the
  // entire browser page to the bottom when this page opens.
  // =========================================================

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // =========================================================
  // LOAD DASHBOARD SCORES
  // =========================================================

  const loadDashboardScores = async () => {
    try {
      setScoreLoading(true);

      const response = await getCoachDashboard();

      console.log(
        "COACH DASHBOARD:",
        JSON.stringify(response.data, null, 2)
      );

      if (response.data?.success) {
        setScores(
          response.data.scores || {
            careerScore: 0,
            roadmapProgress: 0,
            resumeScore: 0,
            interviewScore: 0,
          }
        );
      }
    } catch (error) {
      console.error(
        "Dashboard Score Error:",
        error.response?.data || error.message
      );
    } finally {
      setScoreLoading(false);
    }
  };

  // =========================================================
  // LOAD CHAT HISTORY
  // =========================================================

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);

      const response = await getCoachHistory();

      console.log(
        "COACH HISTORY:",
        JSON.stringify(response.data, null, 2)
      );

      if (response.data?.success) {
        const history = response.data.history || [];

        const formattedMessages = [];

        history
          .slice()
          .reverse()
          .forEach((item) => {
            if (item.question) {
              formattedMessages.push({
                role: "user",
                text: item.question,
              });
            }

            if (item.answer) {
              formattedMessages.push({
                role: "assistant",
                text: item.answer,
              });
            }
          });

        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error(
        "History Error:",
        error.response?.data || error.message
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  // =========================================================
  // SEND QUESTION
  // =========================================================

  const handleSend = async () => {
    if (!question.trim() || loading) {
      return;
    }

    const userQuestion = question.trim();

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userQuestion,
      },
    ]);

    setQuestion("");

    try {
      setLoading(true);

      const response = await askCoach(userQuestion);

      console.log("AI RESPONSE:", response.data);

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "AI Coach failed"
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            response.data.answer ||
            "I couldn't generate a response right now.",
        },
      ]);
    } catch (error) {
      console.error("AI Coach Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            error.response?.data?.message ||
            error.message ||
            "AI Coach failed. Please try again.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // ENTER KEY
  // =========================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // =========================================================
  // QUICK QUESTION
  // =========================================================

  const handleQuickQuestion = (text) => {
    setQuestion(text);

    setTimeout(() => {
      document
        .getElementById("coach-question-input")
        ?.focus();
    }, 50);
  };

  // =========================================================
  // FOCUS PROMPT
  // =========================================================

  const handleFocusChange = (focus) => {
    setActiveFocus(focus.name);

    const focusPrompts = {
      Career:
        "Help me decide the best career path based on my current skills.",
      Resume:
        "How can I improve my resume and make it more ATS friendly?",
      Skills:
        "Which technical skills should I learn next for my target career?",
      Interview:
        "Prepare me for an interview with technical and HR questions.",
      Jobs:
        "How should I prepare myself for internships and job applications?",
    };

    setQuestion(focusPrompts[focus.name] || "");
  };

  // =========================================================
  // COPY RESPONSE
  // =========================================================

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopiedIndex(index);

      setTimeout(() => {
        setCopiedIndex(null);
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  // =========================================================
  // CLEAR CURRENT CHAT
  // =========================================================

  const clearChat = () => {
    if (loading) {
      return;
    }

    setMessages([]);
    setQuestion("");
  };

  // =========================================================
  // SCORE HELPERS
  // =========================================================

  const safeScore = (value) => {
    const number = Number(value);

    if (Number.isNaN(number)) {
      return 0;
    }

    return Math.max(0, Math.min(100, number));
  };

  const averageScore = Math.round(
    (
      safeScore(scores.careerScore) +
      safeScore(scores.resumeScore) +
      safeScore(scores.interviewScore)
    ) / 3
  );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div style={styles.page}>
      {/* Simple initial page loader */}
      {(historyLoading || scoreLoading) && (
        <div style={styles.pageLoading}>
          <div style={styles.pageSpinner}></div>
          <span>Loading...</span>
        </div>
      )}

      {/* =====================================================
          HERO
      ===================================================== */}

      <div style={styles.hero}>
        <div style={styles.heroLeft}>
          <div style={styles.heroIcon}>🤖</div>

          <div>
            <div style={styles.eyebrow}>
              CAREERPILOT INTELLIGENCE
            </div>

            <h1 style={styles.title}>
              AI Career Coach
            </h1>

            <p style={styles.subtitle}>
              Your personal AI assistant for career planning,
              resumes, skills, interviews and placements.
            </p>
          </div>
        </div>

        <div style={styles.onlineBadge}>
          <span style={styles.onlineDot}></span>
          AI Online
        </div>
      </div>

      {/* =====================================================
          READINESS OVERVIEW
      ===================================================== */}

      <div style={styles.overviewCard}>
        <div style={styles.overviewTop}>
          <div>
            <p style={styles.smallLabel}>
              CAREER READINESS
            </p>

            <h2 style={styles.overviewTitle}>
              Your career snapshot
            </h2>
          </div>

          <div style={styles.overallScore}>
            {scoreLoading ? "--" : `${averageScore}%`}
          </div>
        </div>

        <div style={styles.progressGrid}>
          {/* Career */}
          <ScoreProgress
            label="Career Score"
            value={scores.careerScore}
            icon="🎯"
            loading={scoreLoading}
            progressStyle={styles.blueProgress}
          />

          {/* Roadmap */}
          <ScoreProgress
            label="Roadmap Progress"
            value={scores.roadmapProgress}
            icon="🗺️"
            loading={scoreLoading}
            progressStyle={styles.greenProgress}
          />

          {/* Resume */}
          <ScoreProgress
            label="Resume Score"
            value={scores.resumeScore}
            icon="📄"
            loading={scoreLoading}
            progressStyle={styles.orangeProgress}
          />

          {/* Interview */}
          <ScoreProgress
            label="Interview Score"
            value={scores.interviewScore}
            icon="🎤"
            loading={scoreLoading}
            progressStyle={styles.redProgress}
          />
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div style={styles.mainGrid}>
        {/* ===================================================
            LEFT SIDE
        =================================================== */}

        <div style={styles.chatColumn}>
          <div style={styles.chatCard}>
            {/* Chat header */}
            <div style={styles.chatHeader}>
              <div style={styles.chatHeaderLeft}>
                <div style={styles.botAvatar}>
                  🤖
                </div>

                <div>
                  <h2 style={styles.chatTitle}>
                    CareerPilot AI
                  </h2>

                  <div style={styles.chatOnline}>
                    <span style={styles.chatOnlineDot}></span>
                    Ready to help you
                  </div>
                </div>
              </div>

              <button
                onClick={clearChat}
                disabled={loading || messages.length === 0}
                style={{
                  ...styles.clearButton,
                  opacity:
                    loading || messages.length === 0
                      ? 0.45
                      : 1,
                }}
              >
                🗑 Clear
              </button>
            </div>

            {/* Focus selector */}
            <div style={styles.focusArea}>
              <div style={styles.focusHeading}>
                <span>Coach focus</span>
                <span style={styles.focusHint}>
                  Choose what you need help with
                </span>
              </div>

              <div style={styles.focusGrid}>
                {focusOptions.map((focus) => {
                  const active =
                    activeFocus === focus.name;

                  return (
                    <button
                      key={focus.name}
                      onClick={() =>
                        handleFocusChange(focus)
                      }
                      style={{
                        ...styles.focusButton,
                        ...(active
                          ? {
                              borderColor: focus.color,
                              backgroundColor:
                                `${focus.color}10`,
                            }
                          : {}),
                      }}
                    >
                      <span
                        style={{
                          ...styles.focusIcon,
                          ...(active
                            ? {
                                backgroundColor:
                                  `${focus.color}18`,
                              }
                            : {}),
                        }}
                      >
                        {focus.icon}
                      </span>

                      <span style={styles.focusText}>
                        <strong>{focus.name}</strong>
                        <small>
                          {focus.description}
                        </small>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Messages */}
            <div ref={chatAreaRef} style={styles.chatArea}>
              {historyLoading ? (
                <div style={styles.loadingState}>
                  <div style={styles.loadingSpinner}></div>

                  <p>
                    Loading your conversation...
                  </p>
                </div>
              ) : messages.length === 0 ? (
                <div style={styles.welcome}>
                  <div style={styles.welcomeRobot}>
                    🤖
                  </div>

                  <h2 style={styles.welcomeTitle}>
                    Hello! I'm your AI Career Coach
                  </h2>

                  <p style={styles.welcomeText}>
                    Tell me what you're working on,
                    and I'll help you make your next
                    career move.
                  </p>

                  <div style={styles.welcomeTags}>
                    <span>Career Planning</span>
                    <span>Resume</span>
                    <span>Skills</span>
                    <span>Interviews</span>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      style={
                        message.role === "user"
                          ? styles.userRow
                          : styles.aiRow
                      }
                    >
                      {message.role ===
                        "assistant" && (
                        <div style={styles.messageAvatar}>
                          🤖
                        </div>
                      )}

                      <div
                        style={
                          message.role === "user"
                            ? styles.userMessageWrapper
                            : styles.aiMessageWrapper
                        }
                      >
                        <div
                          style={
                            message.role ===
                            "user"
                              ? styles.userBubble
                              : message.error
                              ? styles.errorBubble
                              : styles.aiBubble
                          }
                        >
                          <div
                            style={
                              styles.messageText
                            }
                          >
                            {message.text}
                          </div>
                        </div>

                        {message.role ===
                          "assistant" &&
                          !message.error && (
                            <button
                              onClick={() =>
                                handleCopy(
                                  message.text,
                                  index
                                )
                              }
                              style={
                                styles.copyButton
                              }
                            >
                              {copiedIndex ===
                              index
                                ? "✓ Copied"
                                : "📋 Copy"}
                            </button>
                          )}
                      </div>
                    </div>
                  ))}

                  {/* Typing */}
                  {loading && (
                    <div style={styles.aiRow}>
                      <div style={styles.messageAvatar}>
                        🤖
                      </div>

                      <div style={styles.aiMessageWrapper}>
                        <div style={styles.aiBubble}>
                          <div style={styles.typingArea}>
                            <span style={styles.typingDot}></span>
                            <span style={styles.typingDot}></span>
                            <span style={styles.typingDot}></span>

                            <span style={styles.thinkingText}>
                              AI is thinking...
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div ref={chatEndRef}></div>
            </div>

            {/* Input */}
            <div style={styles.inputWrapper}>
              <div style={styles.inputBox}>
                <textarea
                  id="coach-question-input"
                  value={question}
                  onChange={(e) =>
                    setQuestion(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask about ${activeFocus.toLowerCase()}...`}
                  style={styles.textarea}
                  disabled={loading}
                  rows={2}
                />

                <button
                  onClick={handleSend}
                  disabled={
                    loading || !question.trim()
                  }
                  style={{
                    ...styles.sendButton,
                    opacity:
                      loading ||
                      !question.trim()
                        ? 0.5
                        : 1,
                  }}
                >
                  {loading ? (
                    "..."
                  ) : (
                    <>
                      Send
                      <span>➤</span>
                    </>
                  )}
                </button>
              </div>

              <div style={styles.inputFooter}>
                <span>
                  Enter to send • Shift + Enter
                  for new line
                </span>

                <span>
                  Focus:{" "}
                  <strong>{activeFocus}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              QUICK PROMPTS
          ================================================= */}

          <div style={styles.quickCard}>
            <div style={styles.sectionHeader}>
              <div>
                <span style={styles.sectionEyebrow}>
                  GET STARTED
                </span>

                <h2 style={styles.sectionTitle}>
                  Quick prompts
                </h2>
              </div>

              <span style={styles.sparkle}>
                ✨
              </span>
            </div>

            <div style={styles.promptGrid}>
              {suggestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handleQuickQuestion(item)
                  }
                  style={styles.promptButton}
                >
                  <span style={styles.promptArrow}>
                    →
                  </span>

                  <span>{item}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ===================================================
            RIGHT SIDE
        =================================================== */}

        <div style={styles.sidebarColumn}>
          {/* Today's Action */}
          <div style={styles.actionCard}>
            <div style={styles.actionHeader}>
              <div style={styles.actionIcon}>
                ⚡
              </div>

              <div>
                <p style={styles.actionEyebrow}>
                  TODAY'S ACTION
                </p>

                <h3 style={styles.actionTitle}>
                  One step at a time
                </h3>
              </div>
            </div>

            <p style={styles.actionText}>
              Keep your career progress consistent.
              Focus on one meaningful activity today.
            </p>

            <div style={styles.actionList}>
              <ActionItem
                text="Practice coding for 30 minutes"
              />

              <ActionItem
                text="Improve one section of your resume"
              />

              <ActionItem
                text="Solve 2 interview questions"
              />

              <ActionItem
                text="Learn one new technical concept"
              />
            </div>
          </div>

          {/* Weekly Goal */}
          <div style={styles.goalCard}>
            <div style={styles.goalTop}>
              <div>
                <p style={styles.actionEyebrow}>
                  WEEKLY GOAL
                </p>

                <h3 style={styles.goalTitle}>
                  Placement Ready
                </h3>
              </div>

              <div style={styles.goalEmoji}>
                🚀
              </div>
            </div>

            <p style={styles.goalText}>
              Complete these activities before the
              end of the week.
            </p>

            <div style={styles.goalProgressTrack}>
              <div
                style={{
                  ...styles.goalProgress,
                  width: "60%",
                }}
              ></div>
            </div>

            <div style={styles.goalBottom}>
              <strong>3 / 5 completed</strong>
              <span>60%</span>
            </div>
          </div>

          {/* Career Tips */}
          <div style={styles.tipsCard}>
            <div style={styles.sectionHeader}>
              <div>
                <span style={styles.sectionEyebrow}>
                  COACH INSIGHTS
                </span>

                <h2 style={styles.sectionTitle}>
                  Career tips
                </h2>
              </div>

              <span style={styles.tipIcon}>
                💡
              </span>
            </div>

            <div style={styles.tipList}>
              {tips.map((tip, index) => (
                <div
                  key={index}
                  style={styles.tipItem}
                >
                  <div style={styles.tipItemIcon}>
                    {tip.icon}
                  </div>

                  <div>
                    <h4 style={styles.tipTitle}>
                      {tip.title}
                    </h4>

                    <p style={styles.tipText}>
                      {tip.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div style={styles.recommendationCard}>
            <div style={styles.recommendationIcon}>
              ✨
            </div>

            <div>
              <p style={styles.recommendationLabel}>
                AI RECOMMENDATION
              </p>

              <h3 style={styles.recommendationTitle}>
                Strengthen your core stack
              </h3>

              <p style={styles.recommendationText}>
                Focus on React.js, Node.js,
                Express.js, MongoDB, REST APIs,
                JWT authentication and deployment
                to become more job-ready.
              </p>

              <button
                style={styles.recommendationButton}
                onClick={() =>
                  handleQuickQuestion(
                    "Create a learning plan for React.js, Node.js, Express.js, MongoDB, JWT and deployment."
                  )
                }
              >
                Ask AI for a plan →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================
// SCORE PROGRESS COMPONENT
// =========================================================

function ScoreProgress({
  label,
  value,
  icon,
  loading,
  progressStyle,
}) {
  const safeValue = Math.max(
    0,
    Math.min(100, Number(value) || 0)
  );

  return (
    <div style={styles.scoreItem}>
      <div style={styles.scoreItemTop}>
        <div style={styles.scoreLabel}>
          <span>{icon}</span>
          {label}
        </div>

        <strong>
          {loading ? "--" : `${safeValue}%`}
        </strong>
      </div>

      <div style={styles.scoreTrack}>
        <div
          style={{
            ...styles.scoreProgress,
            ...progressStyle,
            width: loading
              ? "0%"
              : `${safeValue}%`,
          }}
        ></div>
      </div>
    </div>
  );
}

// =========================================================
// ACTION ITEM COMPONENT
// =========================================================

function ActionItem({ text }) {
  return (
    <div style={styles.actionItem}>
      <span style={styles.actionCheck}>
        ✓
      </span>

      <span>{text}</span>
    </div>
  );
}


// Simple spinner animation used by this page.
if (typeof document !== "undefined" && !document.getElementById("coach-spinner-style")) {
  const styleTag = document.createElement("style");
  styleTag.id = "coach-spinner-style";
  styleTag.textContent = `
    @keyframes coachSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleTag);
}

// =========================================================
// STYLES
// =========================================================

const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    boxSizing: "border-box",
    padding: "24px",
    background: "#f6f8fc",
    color: "#0f172a",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },

  // =======================================================
  // SIMPLE PAGE LOADER
  // =======================================================

  pageLoading: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    background: "rgba(246,248,252,0.92)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "600",
  },

  pageSpinner: {
    width: "34px",
    height: "34px",
    border: "3px solid #dbeafe",
    borderTop: "3px solid #2563eb",
    borderRadius: "50%",
    animation: "coachSpin 0.8s linear infinite",
  },

  // =======================================================
  // HERO
  // =======================================================

  hero: {
    width: "100%",
    boxSizing: "border-box",
    background:
      "linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "24px 28px",
    marginBottom: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    boxShadow: "0 4px 18px rgba(15,23,42,0.04)",
  },

  heroLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    minWidth: 0,
  },

  heroIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "16px",
    background:
      "linear-gradient(135deg, #2563eb, #7c3aed)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    flexShrink: 0,
  },

  eyebrow: {
    fontSize: "11px",
    fontWeight: "800",
    color: "#2563eb",
    letterSpacing: "0.12em",
    marginBottom: "4px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "800",
    letterSpacing: "-0.03em",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  onlineBadge: {
    padding: "9px 14px",
    borderRadius: "999px",
    background: "#ecfdf5",
    color: "#15803d",
    fontSize: "13px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  onlineDot: {
    display: "inline-block",
    width: "8px",
    height: "8px",
    background: "#22c55e",
    borderRadius: "50%",
    marginRight: "7px",
  },

  // =======================================================
  // OVERVIEW
  // =======================================================

  overviewCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "22px",
    marginBottom: "18px",
    boxShadow: "0 4px 18px rgba(15,23,42,0.04)",
  },

  overviewTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "20px",
  },

  smallLabel: {
    margin: 0,
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "0.12em",
    color: "#64748b",
  },

  overviewTitle: {
    margin: "5px 0 0",
    fontSize: "19px",
    fontWeight: "750",
  },

  overallScore: {
    minWidth: "70px",
    textAlign: "right",
    fontSize: "27px",
    fontWeight: "800",
    color: "#2563eb",
  },

  progressGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "18px",
  },

  scoreItem: {
    minWidth: 0,
  },

  scoreItemTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
    fontSize: "13px",
  },

  scoreLabel: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#475569",
    fontWeight: "600",
  },

  scoreTrack: {
    height: "7px",
    background: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
  },

  scoreProgress: {
    height: "100%",
    borderRadius: "999px",
    transition: "width 0.5s ease",
  },

  blueProgress: {
    background: "#2563eb",
  },

  greenProgress: {
    background: "#16a34a",
  },

  orangeProgress: {
    background: "#f59e0b",
  },

  redProgress: {
    background: "#dc2626",
  },

  // =======================================================
  // MAIN GRID
  // =======================================================

  mainGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.7fr) minmax(280px, 0.8fr)",
    gap: "18px",
    alignItems: "start",
  },

  chatColumn: {
    minWidth: 0,
  },

  sidebarColumn: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  // =======================================================
  // CHAT
  // =======================================================

  chatCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 5px 22px rgba(15,23,42,0.05)",
  },

  chatHeader: {
    padding: "17px 20px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },

  chatHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  botAvatar: {
    width: "43px",
    height: "43px",
    borderRadius: "13px",
    background: "#eef4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },

  chatTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "750",
  },

  chatOnline: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginTop: "3px",
    color: "#64748b",
    fontSize: "12px",
  },

  chatOnlineDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#22c55e",
  },

  clearButton: {
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#64748b",
    padding: "7px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },

  // =======================================================
  // FOCUS
  // =======================================================

  focusArea: {
    padding: "14px 20px",
    background: "#fbfcfe",
    borderBottom: "1px solid #e2e8f0",
  },

  focusHeading: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    fontSize: "12px",
    fontWeight: "750",
    color: "#334155",
  },

  focusHint: {
    color: "#94a3b8",
    fontWeight: "500",
  },

  focusGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "8px",
  },

  focusButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textAlign: "left",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    borderRadius: "10px",
    padding: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    minWidth: 0,
  },

  focusIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: "15px",
  },

  focusText: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },

  // =======================================================
  // CHAT AREA
  // =======================================================

  chatArea: {
    height: "430px",
    overflowY: "auto",
    padding: "20px",
    background: "#f8fafc",
    boxSizing: "border-box",
  },

  welcome: {
    minHeight: "350px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "30px 20px",
  },

  welcomeRobot: {
    width: "70px",
    height: "70px",
    borderRadius: "22px",
    background: "#eef4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "36px",
    marginBottom: "14px",
  },

  welcomeTitle: {
    margin: "0 0 8px",
    fontSize: "20px",
  },

  welcomeText: {
    maxWidth: "500px",
    color: "#64748b",
    lineHeight: "1.6",
    fontSize: "14px",
    margin: 0,
  },

  welcomeTags: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "7px",
    marginTop: "18px",
  },

  loadingState: {
    height: "350px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#64748b",
    fontSize: "13px",
  },

  loadingSpinner: {
    width: "28px",
    height: "28px",
    border: "3px solid #dbeafe",
    borderTop: "3px solid #2563eb",
    borderRadius: "50%",
    animation: "coachSpin 0.8s linear infinite",
    marginBottom: "10px",
  },

  userRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "16px",
  },

  aiRow: {
    display: "flex",
    justifyContent: "flex-start",
    gap: "9px",
    marginBottom: "16px",
  },

  messageAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "10px",
    background: "#eef4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    flexShrink: 0,
  },

  userMessageWrapper: {
    maxWidth: "78%",
  },

  aiMessageWrapper: {
    maxWidth: "82%",
  },

  userBubble: {
    background: "#2563eb",
    color: "#ffffff",
    padding: "12px 15px",
    borderRadius: "15px 15px 4px 15px",
    boxShadow: "0 3px 8px rgba(37,99,235,0.15)",
  },

  aiBubble: {
    background: "#ffffff",
    color: "#1e293b",
    padding: "12px 15px",
    borderRadius: "4px 15px 15px 15px",
    border: "1px solid #e2e8f0",
  },

  errorBubble: {
    background: "#fff1f2",
    color: "#be123c",
    padding: "12px 15px",
    borderRadius: "4px 15px 15px 15px",
    border: "1px solid #fecdd3",
  },

  messageText: {
    whiteSpace: "pre-wrap",
    lineHeight: "1.6",
    fontSize: "14px",
  },

  copyButton: {
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    fontSize: "11px",
    cursor: "pointer",
    padding: "5px 2px",
  },

  typingArea: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    minHeight: "18px",
  },

  typingDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#94a3b8",
  },

  thinkingText: {
    color: "#64748b",
    fontSize: "12px",
    marginLeft: "7px",
  },

  // =======================================================
  // INPUT
  // =======================================================

  inputWrapper: {
    padding: "14px 18px 11px",
    borderTop: "1px solid #e2e8f0",
    background: "#ffffff",
  },

  inputBox: {
    display: "flex",
    gap: "9px",
    alignItems: "flex-end",
  },

  textarea: {
    flex: 1,
    minWidth: 0,
    minHeight: "52px",
    maxHeight: "130px",
    resize: "vertical",
    boxSizing: "border-box",
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    outline: "none",
    fontFamily: "inherit",
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#0f172a",
  },

  sendButton: {
    minHeight: "52px",
    padding: "0 18px",
    border: "none",
    borderRadius: "11px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    whiteSpace: "nowrap",
  },

  inputFooter: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    marginTop: "7px",
    color: "#94a3b8",
    fontSize: "10px",
  },

  // =======================================================
  // QUICK PROMPTS
  // =======================================================

  quickCard: {
    marginTop: "18px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "20px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  sectionEyebrow: {
    display: "block",
    fontSize: "9px",
    fontWeight: "800",
    color: "#2563eb",
    letterSpacing: "0.12em",
    marginBottom: "3px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "18px",
  },

  sparkle: {
    fontSize: "22px",
  },

  promptGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "9px",
  },

  promptButton: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    textAlign: "left",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    borderRadius: "10px",
    padding: "11px 12px",
    color: "#334155",
    cursor: "pointer",
    fontSize: "12px",
    lineHeight: "1.4",
  },

  promptArrow: {
    width: "22px",
    height: "22px",
    borderRadius: "7px",
    background: "#eef4ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontWeight: "700",
  },

  // =======================================================
  // ACTION CARD
  // =======================================================

  actionCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "20px",
  },

  actionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    marginBottom: "10px",
  },

  actionIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "11px",
    background: "#fff7ed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  actionEyebrow: {
    margin: 0,
    fontSize: "9px",
    fontWeight: "800",
    color: "#64748b",
    letterSpacing: "0.1em",
  },

  actionTitle: {
    margin: "3px 0 0",
    fontSize: "16px",
  },

  actionText: {
    color: "#64748b",
    fontSize: "12px",
    lineHeight: "1.55",
    margin: "0 0 15px",
  },

  actionList: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
  },

  actionItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "9px",
    fontSize: "12px",
    color: "#475569",
    lineHeight: "1.4",
  },

  actionCheck: {
    width: "19px",
    height: "19px",
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: "11px",
    fontWeight: "800",
  },

  // =======================================================
  // GOAL CARD
  // =======================================================

  goalCard: {
    background:
      "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
    border: "1px solid #dbeafe",
    borderRadius: "18px",
    padding: "20px",
  },

  goalTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },

  goalTitle: {
    margin: "4px 0 0",
    fontSize: "17px",
  },

  goalEmoji: {
    fontSize: "28px",
  },

  goalText: {
    fontSize: "12px",
    color: "#64748b",
    lineHeight: "1.5",
  },

  goalProgressTrack: {
    height: "7px",
    borderRadius: "999px",
    background: "#dbeafe",
    overflow: "hidden",
  },

  goalProgress: {
    height: "100%",
    borderRadius: "999px",
    background: "#2563eb",
  },

  goalBottom: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px",
    fontSize: "11px",
    color: "#475569",
  },

  // =======================================================
  // TIPS
  // =======================================================

  tipsCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "20px",
  },

  tipIcon: {
    fontSize: "21px",
  },

  tipList: {
    display: "flex",
    flexDirection: "column",
    gap: "13px",
  },

  tipItem: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
  },

  tipItemIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "9px",
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  tipTitle: {
    margin: "0 0 2px",
    fontSize: "12px",
  },

  tipText: {
    margin: 0,
    color: "#64748b",
    fontSize: "11px",
    lineHeight: "1.45",
  },

  // =======================================================
  // RECOMMENDATION
  // =======================================================

  recommendationCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",
    background: "#111827",
    color: "#ffffff",
    borderRadius: "18px",
    padding: "20px",
  },

  recommendationIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  recommendationLabel: {
    margin: 0,
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "0.1em",
    color: "#93c5fd",
  },

  recommendationTitle: {
    margin: "4px 0 7px",
    fontSize: "15px",
  },

  recommendationText: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "11px",
    lineHeight: "1.55",
  },

  recommendationButton: {
    marginTop: "13px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.08)",
    color: "#ffffff",
    padding: "8px 11px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
  },
};