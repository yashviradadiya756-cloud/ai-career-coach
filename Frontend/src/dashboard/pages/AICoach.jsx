import React, { useEffect, useState } from "react";
import {
  askCoach,
  getCoachHistory,
} from "../../api/coachApi";

export default function AICoach() {

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);


  // Load previous chat
  useEffect(() => {
    loadHistory();
  }, []);


  const loadHistory = async () => {
    try {

      setHistoryLoading(true);

      const res = await getCoachHistory();

      const chats = res.data.chats || [];

      const formattedMessages = [];

      chats.forEach((chat) => {

        formattedMessages.push({
          type: "user",
          text: chat.question,
        });

        formattedMessages.push({
          type: "ai",
          text: chat.answer,
        });

      });

      setMessages(formattedMessages);

    } catch (error) {

      console.log(
        "History Error:",
        error.response?.data || error.message
      );

    } finally {

      setHistoryLoading(false);

    }
  };


  // Send question
  const handleSend = async () => {

    if (loading) return;

    if (!question.trim()) {
      return;
    }

    const userQuestion = question.trim();

    // Show user message immediately
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: userQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);


    try {

      const res = await askCoach(userQuestion);

      const answer =
        res.data.chat?.answer ||
        "Sorry, I could not generate a response.";

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: answer,
        },
      ]);

    } catch (error) {

      console.log(
        "AI Coach Error:",
        error.response?.data || error.message
      );

      const errorMessage =
        error.response?.data?.message ||
        "AI Coach is temporarily unavailable.";

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: `⚠️ ${errorMessage}`,
          error: true,
        },
      ]);

    } finally {

      setLoading(false);

    }
  };


  // Enter key
  const handleKeyDown = (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

      e.preventDefault();

      handleSend();

    }

  };


  // Quick question
  const handleQuickQuestion = (text) => {

    setQuestion(text);

  };


  const suggestions = [
    "How can I improve my resume?",
    "Recommend a career based on my skills",
    "Create a 6-month MERN roadmap",
    "Prepare me for HR interviews",
    "Suggest projects for placements",
  ];


  const tips = [
    "Practice coding for 1 hour every day.",
    "Update your resume every month.",
    "Complete at least 2 real-world projects.",
    "Improve communication and interview skills.",
    "Apply for internships regularly.",
  ];


  return (
    <div style={styles.container}>

      {/* Header */}

      <div style={styles.header}>

        <div>

          <h1 style={styles.title}>
            🤖 AI Career Coach
          </h1>

          <p style={styles.subtitle}>
            Your personal AI assistant for career,
            resume, skills, interviews and placement preparation.
          </p>

        </div>

        <div style={styles.aiStatus}>
          <span style={styles.statusDot}></span>
          AI Coach Online
        </div>

      </div>


      {/* Summary Cards */}

      <div style={styles.cards}>

        <div style={styles.card}>

          <div style={styles.cardIcon}>
            🎯
          </div>

          <div>
            <h3>Career Score</h3>
            <h1 style={{ color: "#2563eb" }}>
              84%
            </h1>
          </div>

        </div>


        <div style={styles.card}>

          <div style={styles.cardIcon}>
            🗺️
          </div>

          <div>
            <h3>Roadmap Progress</h3>
            <h1 style={{ color: "#16a34a" }}>
              65%
            </h1>
          </div>

        </div>


        <div style={styles.card}>

          <div style={styles.cardIcon}>
            📄
          </div>

          <div>
            <h3>Resume Score</h3>
            <h1 style={{ color: "#f59e0b" }}>
              78%
            </h1>
          </div>

        </div>


        <div style={styles.card}>

          <div style={styles.cardIcon}>
            🎤
          </div>

          <div>
            <h3>Interview Score</h3>
            <h1 style={{ color: "#dc2626" }}>
              87%
            </h1>
          </div>

        </div>

      </div>


      {/* AI Chat */}

      <div style={styles.chatSection}>

        <div style={styles.chatHeader}>

          <div style={styles.botIcon}>
            🤖
          </div>

          <div>

            <h2 style={{ margin: 0 }}>
              CareerPilot AI
            </h2>

            <p style={styles.onlineText}>
              Ask me anything about your career
            </p>

          </div>

        </div>


        {/* Chat Messages */}

        <div style={styles.chatArea}>

          {historyLoading ? (

            <div style={styles.loadingMessage}>
              Loading conversation...
            </div>

          ) : messages.length === 0 ? (

            <div style={styles.welcome}>

              <div style={styles.bigBot}>
                🤖
              </div>

              <h2>
                Hello! I'm your AI Career Coach 👋
              </h2>

              <p>
                I can help you with resumes, career choices,
                skills, roadmaps, interviews and placements.
              </p>

              <p style={{ color: "#64748b" }}>
                Ask me your first question below.
              </p>

            </div>

          ) : (

            messages.map((message, index) => (

              <div
                key={index}
                style={
                  message.type === "user"
                    ? styles.userMessageRow
                    : styles.aiMessageRow
                }
              >

                {message.type === "ai" && (
                  <div style={styles.smallBot}>
                    🤖
                  </div>
                )}

                <div
                  style={
                    message.type === "user"
                      ? styles.userBubble
                      : message.error
                      ? styles.errorBubble
                      : styles.aiBubble
                  }
                >

                  <div style={styles.messageText}>
                    {message.text}
                  </div>

                </div>

              </div>

            ))

          )}


          {/* AI typing */}

          {loading && (

            <div style={styles.aiMessageRow}>

              <div style={styles.smallBot}>
                🤖
              </div>

              <div style={styles.aiBubble}>

                <div style={styles.typing}>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span style={{ marginLeft: "8px" }}>
                    AI is thinking...
                  </span>
                </div>

              </div>

            </div>

          )}

        </div>


        {/* Input */}

        <div style={styles.inputArea}>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your AI Career Coach..."
            style={styles.input}
            disabled={loading}
          />

          <button
            onClick={handleSend}
            disabled={loading || !question.trim()}
            style={{
              ...styles.sendButton,
              opacity:
                loading || !question.trim()
                  ? 0.6
                  : 1,
            }}
          >
            {loading ? "Thinking..." : "Send 🚀"}
          </button>

        </div>

        <p style={styles.inputHint}>
          Press Enter to send • Shift + Enter for new line
        </p>

      </div>


      {/* Quick Questions */}

      <div style={styles.section}>

        <h2>
          ⚡ Quick Questions
        </h2>

        <div style={styles.quickGrid}>

          {suggestions.map((item, index) => (

            <button
              key={index}
              onClick={() => handleQuickQuestion(item)}
              style={styles.question}
            >
              {item}
            </button>

          ))}

        </div>

      </div>


      {/* AI Tips */}

      <div style={styles.section}>

        <h2>
          🎯 AI Career Tips
        </h2>

        <div style={styles.tipsGrid}>

          {tips.map((tip, index) => (

            <div
              key={index}
              style={styles.tip}
            >
              <span style={styles.check}>
                ✓
              </span>

              {tip}

            </div>

          ))}

        </div>

      </div>


      {/* Weekly Goal */}

      <div style={styles.goalSection}>

        <div style={styles.goalIcon}>
          📅
        </div>

        <div>

          <h2 style={{ marginTop: 0 }}>
            Weekly Career Goal
          </h2>

          <p>
            Finish your Resume Analysis, complete one
            Mock Interview, solve 20 DSA problems,
            and apply to at least 5 internships.
          </p>

        </div>

      </div>


      {/* Recommendation */}

      <div style={styles.recommendation}>

        <div style={styles.recommendIcon}>
          🚀
        </div>

        <div>

          <h2 style={{ marginTop: 0 }}>
            AI Recommendation
          </h2>

          <p>

            Based on your career journey, focus on

            <strong>
              {" "}React.js, Node.js, Express.js,
              MongoDB, JWT Authentication, Docker,
              and AWS
            </strong>

            {" "}to become placement-ready.

          </p>

        </div>

      </div>

    </div>
  );
}


const styles = {

  container: {
    padding: "25px",
    background: "#f5f7fb",
    minHeight: "100vh",
  },


  header: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "18px",
    marginBottom: "22px",
    boxShadow: "0 5px 20px rgba(0,0,0,.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },


  title: {
    margin: 0,
    fontSize: "30px",
    color: "#111827",
  },


  subtitle: {
    marginTop: "10px",
    color: "#64748b",
    fontSize: "16px",
  },


  aiStatus: {
    background: "#ecfdf5",
    color: "#15803d",
    padding: "10px 16px",
    borderRadius: "30px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },


  statusDot: {
    display: "inline-block",
    width: "9px",
    height: "9px",
    background: "#22c55e",
    borderRadius: "50%",
    marginRight: "8px",
  },


  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "22px",
  },


  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 5px 20px rgba(0,0,0,.06)",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },


  cardIcon: {
    fontSize: "30px",
    background: "#f1f5f9",
    padding: "12px",
    borderRadius: "12px",
  },


  chatSection: {
    background: "#fff",
    borderRadius: "18px",
    overflow: "hidden",
    marginBottom: "22px",
    boxShadow: "0 5px 25px rgba(0,0,0,.07)",
  },


  chatHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "20px 25px",
    borderBottom: "1px solid #e5e7eb",
  },


  botIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "#eef4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "27px",
  },


  onlineText: {
    margin: "5px 0 0",
    color: "#64748b",
  },


  chatArea: {
    minHeight: "430px",
    maxHeight: "300px",
    overflowY: "auto",
    padding: "25px",
    background: "#f8fafc",
  },


  welcome: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#475569",
  },


  bigBot: {
    fontSize: "60px",
    marginBottom: "15px",
  },


  loadingMessage: {
    textAlign: "center",
    padding: "60px",
    color: "#64748b",
  },


  userMessageRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "18px",
  },


  aiMessageRow: {
    display: "flex",
    justifyContent: "flex-start",
    gap: "10px",
    marginBottom: "18px",
  },


  smallBot: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#eef4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },


  userBubble: {
    maxWidth: "75%",
    background: "#2563eb",
    color: "#fff",
    padding: "14px 18px",
    borderRadius: "18px 18px 4px 18px",
  },


  aiBubble: {
    maxWidth: "75%",
    background: "#fff",
    color: "#1e293b",
    padding: "14px 18px",
    borderRadius: "4px 18px 18px 18px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0,0,0,.04)",
  },


  errorBubble: {
    maxWidth: "75%",
    background: "#fff1f2",
    color: "#be123c",
    padding: "14px 18px",
    borderRadius: "4px 18px 18px 18px",
    border: "1px solid #fecdd3",
  },


  messageText: {
    whiteSpace: "pre-wrap",
    lineHeight: "1.6",
    fontSize: "15px",
  },


  typing: {
    display: "flex",
    alignItems: "center",
    color: "#64748b",
    fontSize: "14px",
  },


  inputArea: {
    display: "flex",
    gap: "12px",
    padding: "20px 25px 5px",
    borderTop: "1px solid #e5e7eb",
  },


  input: {
    flex: 1,
    minHeight: "60px",
    maxHeight: "140px",
    padding: "15px",
    fontSize: "15px",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    resize: "vertical",
    outline: "none",
    fontFamily: "inherit",
  },


  sendButton: {
    alignSelf: "flex-end",
    padding: "14px 25px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
  },


  inputHint: {
    padding: "0 25px 15px",
    margin: 0,
    color: "#94a3b8",
    fontSize: "12px",
  },


  section: {
    background: "#fff",
    padding: "25px",
    borderRadius: "18px",
    marginBottom: "22px",
    boxShadow: "0 5px 20px rgba(0,0,0,.06)",
  },


  quickGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: "12px",
  },


  question: {
    padding: "15px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "14px",
    color: "#334155",
  },


  tipsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: "12px",
  },


  tip: {
    padding: "15px",
    background: "#f8fafc",
    borderRadius: "10px",
    color: "#334155",
  },


  check: {
    display: "inline-flex",
    width: "23px",
    height: "23px",
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "10px",
    fontWeight: "bold",
  },


  goalSection: {
    display: "flex",
    gap: "18px",
    alignItems: "flex-start",
    background: "#fff",
    padding: "25px",
    borderRadius: "18px",
    marginBottom: "22px",
    boxShadow: "0 5px 20px rgba(0,0,0,.06)",
    borderLeft: "5px solid #2563eb",
  },


  goalIcon: {
    fontSize: "35px",
  },


  recommendation: {
    display: "flex",
    gap: "18px",
    alignItems: "flex-start",
    background: "#eef4ff",
    padding: "25px",
    borderRadius: "18px",
    marginBottom: "30px",
    border: "1px solid #dbeafe",
  },


  recommendIcon: {
    fontSize: "35px",
  },

};