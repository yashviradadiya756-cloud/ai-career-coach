import React, { useState } from "react";

export default function InteractiveDashboard() {
  const [activeTab, setActiveTab] = useState("assessment");

  // State elements to make the dashboard interactive
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [resumeName, setResumeName] = useState("");
  const [studyHours, setStudyHours] = useState(4);
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setResumeName(e.target.files[0].name);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
     
      
      case "assessment":
        

      // ==========================================
      // ② Upload Resume
      // ==========================================
      case "resume":
        return (
          <div style={styles.content}>
            <h2>📤  Upload Resume</h2>
            <p style={styles.subTitle}>
              Provide your resume to extract existing technical skill markers and project profiles.
            </p>

            <div style={styles.uploadArea}>
              <input
                type="file"
                id="resumeUpload"
                style={{ display: "none" }}
                accept=".pdf,.docx"
                onChange={handleFileChange}
              />
              <label htmlFor="resumeUpload" style={styles.uploadButton}>
                📁 Choose File
              </label>
              <p style={{ margin: "10px 0 0 0", fontSize: "14px", color: "#64748b" }}>
                {resumeName ? `Selected: ${resumeName}` : "Supports PDF or DOCX (Max 10MB)"}
              </p>
            </div>

            {resumeName && (
              <div style={{ ...styles.infoBox, background: "#f0fdf4", borderLeft: "4px solid #16a34a" }}>
                <strong style={{ color: "#166534" }}>File successfully buffered!</strong>
                <p style={{ margin: "4px 0 0 0", color: "#15803d", fontSize: "14px" }}>
                  Ready to parse your document syntax structure.
                </p>
              </div>
            )}

            <button
              style={styles.button}
              onClick={() => setActiveTab("analysis")}
            >
              Next → 
            </button>
          </div>
        );

      // ==========================================
      // ③ AI Resume Analysis
      // ==========================================
      case "analysis":
        return (
          <div style={styles.content}>
            <h2>📊 AI Resume Analysis</h2>
            <p style={styles.subTitle}>
              Semantic parsing systems checking structure match ratios and scanning keyword weight values.
            </p>

            <div style={styles.scoreSection}>
              <div style={styles.scoreCircle}>82%</div>
              <div>
                <h3 style={styles.infoBoxTitle}>ATS Parsing Integrity</h3>
                <p style={{ margin: 0, color: "#64748b" }}>
                  Your document layouts are highly parser-compatible, but skill density contains slight gaps.
                </p>
              </div>
            </div>

            <div style={styles.infoBox}>
              <h3 style={styles.infoBoxTitle}>Key AI Evaluation Metrics</h3>
              <ul style={styles.list}>
                <li>✔ Style & Format Structure: <strong style={{ color: "#16a34a" }}>High Match</strong></li>
                <li>✔ Impact Metric Quantifiers: <strong style={{ color: "#ea580c" }}>Moderate</strong></li>
                <li>✔ Modern Technical Keywords: <strong style={{ color: "#dc2626" }}>Requires Work</strong></li>
              </ul>
            </div>

            <button
              style={styles.button}
              onClick={() => setActiveTab("skillgap")}
            >
              Next → 
            </button>
          </div>
        );

      // ==========================================
      // ④ Skill Gap Detection
      // ==========================================
      case "skillgap":
        return (
          <div style={styles.content}>
            <h2>🔍  Skill Gap Detection</h2>
            <p style={styles.subTitle}>
              Real-time cross-checking of your profile indexes against active, live tech industry positions.
            </p>

            <div style={styles.cardGrid}>
              <div style={styles.card}>
                <h3 style={{ ...styles.cardHeader, color: "#16a34a" }}>Identified Strengths</h3>
                <p style={styles.skillText}>React.js</p>
                <p style={styles.skillText}>Node.js</p>
                <p style={styles.skillText}>MongoDB</p>
                <p style={styles.skillText}>JavaScript</p>
              </div>
              <div style={styles.card}>
                <h3 style={{ ...styles.cardHeader, color: "#dc2626" }}>Current Skill Gaps</h3>
                <p style={styles.skillTextMissing}>Docker Platforms</p>
                <p style={styles.skillTextMissing}>Amazon Web Services (AWS)</p>
                <p style={styles.skillTextMissing}>Software System Design</p>
                <p style={styles.skillTextMissing}>CI/CD Deploy Pipelines</p>
              </div>
            </div>

            <div style={styles.infoBox}>
              <strong>Recommended Action Pipeline</strong>
              <p style={{ margin: "5px 0 0 0", color: "#475569" }}>
                Targeting **System Design** and core **AWS deployment patterns** is essential to reach high-value developer roles.
              </p>
            </div>

            <button
              style={styles.button}
              onClick={() => setActiveTab("recommendations")}
            >
              Next → 
            </button>
          </div>
        );

      // ==========================================
      // ⑤ AI Career Recommendation
      // ==========================================
      case "recommendations":
        return (
          <div style={styles.content}>
            <h2>🎯  AI Career Recommendations</h2>
            <p style={styles.subTitle}>
              AI matching profiles evaluating positions aligned with your primary full-stack technical competencies.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div style={{ ...styles.card, textAlign: "left", borderLeft: "5px solid #2563eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ margin: 0, color: "#1e293b" }}>Full-Stack Software Engineer (MERN)</h4>
                  <span style={{ background: "#dbeafe", color: "#1e40af", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>94% Match</span>
                </div>
                <p style={{ margin: "10px 0 0 0", color: "#64748b", fontSize: "14px" }}>
                  High industrial need. Leverage your Node.js, Express, and React skills to anchor server deployments.
                </p>
              </div>

              <div style={{ ...styles.card, textAlign: "left", borderLeft: "5px solid #64748b" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ margin: 0, color: "#1e293b" }}>Frontend UI Engineer</h4>
                  <span style={{ background: "#f1f5f9", color: "#475569", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>82% Match</span>
                </div>
                <p style={{ margin: "10px 0 0 0", color: "#64748b", fontSize: "14px" }}>
                  Utilizes your knowledge of client layouts, components, state hooks, and responsive design systems.
                </p>
              </div>
            </div>

            <button
              style={styles.button}
              onClick={() => setActiveTab("roadmap")}
            >
              Next →
            </button>
          </div>
        );

      // ==========================================
      // ⑥ Personalized Learning Roadmap
      // ==========================================
      case "roadmap":
        return (
          <div style={styles.content}>
            <h2>🗺  Personalized Learning Roadmap</h2>
            <p style={styles.subTitle}>
              A custom curriculum built to patch knowledge gaps and structure your growth systematically.
            </p>

            <div style={styles.timeline}>
              <div style={styles.timelineItem}>
                <strong>Month 1: Client Interfaces & State Flow</strong>
                <p style={{ margin: "5px 0 0 0", color: "#475569" }}>Component lifecycles, advanced hook dynamics, global state management.</p>
              </div>
              <div style={styles.timelineItem}>
                <strong>Month 2: Core Server Architectures</strong>
                <p style={{ margin: "5px 0 0 0", color: "#475569" }}>Express server frameworks, secure API routing modules, controller schemas.</p>
              </div>
              <div style={styles.timelineItem}>
                <strong>Month 3: Containerization & Deploy Systems</strong>
                <p style={{ margin: "5px 0 0 0", color: "#475569" }}>Docker instance configurations, AWS deployment mechanics, continuous delivery pipelines.</p>
              </div>
            </div>

            <button
              style={styles.button}
              onClick={() => setActiveTab("tutorials")}
            >
              Next → 
            </button>
          </div>
        );

      // ==========================================
      // ⑦ Learn Topics & Tutorials
      // ==========================================
      case "tutorials":
        return (
          <div style={styles.content}>
            <h2>📚  Learn Topics & Tutorials</h2>
            <p style={styles.subTitle}>
              Curated conceptual frameworks and modules focused directly on building full-stack applications.
            </p>

            <div style={styles.cardGrid}>
              <div style={{ ...styles.card, textAlign: "left" }}>
                <span style={{ background: "#fee2e2", color: "#991b1b", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "600" }}>Core Frontend</span>
                <h4 style={{ margin: "10px 0 5px 0", fontSize: "16px" }}>React.js Hooks Depth Study</h4>
                <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 15px 0" }}>Master state mechanics, context management, and optimization patterns.</p>
                <button style={styles.secondaryButton}>Start Lecture</button>
              </div>

              <div style={{ ...styles.card, textAlign: "left" }}>
                <span style={{ background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "600" }}>Core Backend</span>
                <h4 style={{ margin: "10px 0 5px 0", fontSize: "16px" }}>MERN Stack Routing Patterns</h4>
                <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 15px 0" }}>Build secure backend pipelines connecting controllers to Express routers.</p>
                <button style={styles.secondaryButton}>Start Lecture</button>
              </div>
            </div>

            <button
              style={styles.button}
              onClick={() => setActiveTab("progress")}
            >
              Next → 
            </button>
          </div>
        );

      // ==========================================
      // ⑧ Track Study Progress
      // ==========================================
      case "progress":
        return (
          <div style={styles.content}>
            <h2>📈 Study Progress</h2>
            <p style={styles.subTitle}>
              Monitor real-time progress as you complete learning modules.
            </p>

            <div style={styles.card}>
              <h3 style={styles.cardHeader}>Total Dedicated Lab Hours</h3>
              <h1 style={styles.cardValue}>{studyHours} hrs</h1>
              
              <div style={{ background: "#e2e8f0", height: "15px", borderRadius: "8px", margin: "20px 0", overflow: "hidden" }}>
                <div style={{ background: "#2563eb", height: "100%", width: `${Math.min((studyHours / 10) * 100, 100)}%`, transition: "width 0.3s ease" }}></div>
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                <button style={styles.secondaryButton} onClick={() => setStudyHours(prev => prev + 1)}>
                  ➕ Record Study Hour
                </button>
                <button style={{ ...styles.secondaryButton, background: "#f1f5f9", color: "#334155" }} onClick={() => setStudyHours(0)}>
                  🔄 Reset Log
                </button>
              </div>
            </div>

            <button
              style={styles.button}
              onClick={() => setActiveTab("interview")}
            >
              Next → 
            </button>
          </div>
        );

      // ==========================================
      // ⑨ AI Mock Interview
      // ==========================================
      case "interview":
        return (
          <div style={styles.content}>
            <h2>🤖  AI Mock Interview</h2>
            <p style={styles.subTitle}>
              Test your engineering communication and technical knowledge with active simulated developer prompts.
            </p>

            <div style={styles.questionCard}>
              <h3 style={{ margin: "0 0 5px 0", fontSize: "15px", color: "#0f172a" }}>Technical Challenge:</h3>
              <p style={{ margin: 0, color: "#475569" }}>
                "Explain how you design a MongoDB database schema strategy to support multi-tenant relationships."
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>Your Response Explanation:</label>
              <textarea
                style={styles.textarea}
                rows={4}
                placeholder="Structure your communication cleanly using context schemas or normalization patterns..."
                value={interviewAnswer}
                onChange={(e) => setInterviewAnswer(e.target.value)}
              />
            </div>

            <button
              style={{ ...styles.button, width: "100%" }}
              onClick={() => setIsAnswerSubmitted(true)}
              disabled={!interviewAnswer}
            >
              Submit Response for Feedback Analysis
            </button>

            {isAnswerSubmitted && (
              <div style={{ ...styles.infoBox, background: "#f0f9ff", borderLeft: "4px solid #0284c7" }}>
                <span style={{ color: "#0369a1", fontWeight: "600" }}>✓ Response Successfully Logged</span>
                <p style={{ margin: "4px 0 0 0", color: "#075985", fontSize: "14px" }}>
                  Your technical answer has been submitted to the evaluation engine. Proceed to view your Feedback Report!
                </p>
              </div>
            )}

            <button
              style={styles.button}
              onClick={() => setActiveTab("feedback")}
            >
              Next → 
            </button>
          </div>
        );

      // ==========================================
      // ⑩ Interview Feedback
      // ==========================================
      case "feedback":
        return (
          <div style={styles.content}>
            <h2>💬  Interview Feedback</h2>
            <p style={styles.subTitle}>
              Semantic sentiment and keyword matching reviews analyzed by the AI assessment engine.
            </p>

            <div style={styles.cardGrid}>
              <div style={styles.card}>
                <h3 style={styles.cardHeader}>Vocabulary Score</h3>
                <h1 style={{ ...styles.cardValue, color: "#16a34a" }}>88%</h1>
              </div>
              <div style={styles.card}>
                <h3 style={styles.cardHeader}>Design Patterns</h3>
                <h1 style={{ ...styles.cardValue, color: "#2563eb" }}>90%</h1>
              </div>
              <div style={styles.card}>
                <h3 style={styles.cardHeader}>Industry Jargon</h3>
                <h1 style={{ ...styles.cardValue, color: "#ea580c" }}>75%</h1>
              </div>
            </div>

            <div style={styles.infoBox}>
              <h3 style={styles.infoBoxTitle}>Constructive System Insights</h3>
              <ul style={styles.list}>
                <li style={{ color: "#16a34a" }}>✅ Excellent identification of state patterns and React life-cycles.</li>
                <li style={{ color: "#16a34a" }}>✅ Strong explanation of relational constraints in document databases.</li>
                <li style={{ color: "#ea580c" }}>⚠ Try utilizing deeper STAR methods when describing deployment errors.</li>
              </ul>
            </div>

            <button
              style={styles.button}
              onClick={() => setActiveTab("certificates")}
            >
              Next →
            </button>
          </div>
        );

      // ==========================================
      // ⑪ Achievements & Certificates
      // ==========================================
      case "certificates":
        return (
          <div style={styles.content}>
            <h2>🎓  Achievements & Certificates</h2>
            <p style={styles.subTitle}>
              Unlock verifiable technical achievements and certificates upon completing roadmap milestones.
            </p>

            <div style={{ ...styles.card, border: "2px solid #eab308", background: "#fef9c3", padding: "30px" }}>
              <div style={{ fontSize: "50px", marginBottom: "10px" }}>🏆</div>
              <h3 style={{ margin: "0 0 5px 0", color: "#854d0e" }}>Full-Stack MERN Architecture Certificate</h3>
              <p style={{ margin: "0 0 15px 0", color: "#a16207", fontSize: "14px" }}>
                Issued by CareerPilot AI • Verification ID: CP-90823-MERN
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                <button style={{ ...styles.button, width: "auto" }} onClick={() => alert("Certificate PDF Download Initialized!")}>
                  Download Credentials
                </button>
                <button style={{ ...styles.secondaryButton, borderColor: "#a16207", color: "#854d0e" }}>
                  Share on LinkedIn
                </button>
              </div>
            </div>

            <button
              style={styles.button}
              onClick={() => setActiveTab("jobs")}
            >
              Next → 
            </button>
          </div>
        );

      
        return (
          <div style={styles.content}>
            <h2>💼  AI-Driven Job Recommendations</h2>
            <p style={styles.subTitle}>
              Open positions matching your newly certified technical skill metrics.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { title: "Associate Full-Stack Developer", company: "Tech Solutions Inc.", loc: "Surat, GJ (Hybrid)", type: "Full-Time" },
                { title: "Junior MERN Stack Engineer", company: "Innovate Web Labs", loc: "Mumbai, MH (Remote)", type: "Contract" }
              ].map((job, idx) => (
                <div key={idx} style={{ ...styles.card, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", textAlign: "left" }}>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#0f172a" }}>{job.title}</h4>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>{job.company} • {job.loc}</p>
                  </div>
                  <button style={styles.secondaryButton} onClick={() => alert(`Applying to ${job.title}!`)}>
                    Apply Now
                  </button>
                </div>
              ))}
            </div>

            <button
              style={{ ...styles.button, background: "#16a34a" }}
              onClick={() => {
                setActiveTab("assessment");
                setQuizCompleted(false);
                setSelectedAnswer(null);
                setResumeName("");
                setIsAnswerSubmitted(false);
                setInterviewAnswer("");
              }}
            >
              🔄 Restart Journey
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section style={styles.section} id="demo">
      {/* Platform Title Banner */}
      <div style={styles.header}>
        <h2 style={{ fontSize: "28px", color: "#0f172a", marginBottom: "10px" }}>
          🚀 Explore AI Career Coach Features
        </h2>
        <p style={{ color: "#64748b", maxWidth: "600px", margin: "0 auto" }}>
          Experience AI-powered career guidance, resume analysis, skill gap analysis, career roadmap and mock interviews.
        </p>
      </div>

      {/* Main Single Page Grid Wrapper */}
      <div style={styles.demoContainer}>
        
        {/* Navigation Sidebar: Displays all 12 stages */}
        <div style={styles.sidebar}>
          {[
            // { id: "assessment", label: " Quiz Assessment", icon: "📝" },
            { id: "resume", label: " Upload Resume", icon: "📤" },
            { id: "analysis", label: " Resume Analysis", icon: "📊" },
            { id: "skillgap", label: " Skill Gap", icon: "🔍" },
            { id: "recommendations", label: " Recommendations", icon: "🎯" },
            { id: "roadmap", label: " Career Roadmap", icon: "🗺" },
            { id: "tutorials", label: " Learn & Tutorials", icon: "📚" },
            { id: "progress", label: "Progress", icon: "📈" },
            { id: "interview", label: " Mock Interview", icon: "🤖" },
            { id: "feedback", label: " Feedback Report", icon: "💬" },
            { id: "certificates", label: " Certificates", icon: "🎓" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={activeTab === item.id ? styles.activeButton : styles.sidebarButton}
            >
              <span style={{ marginRight: "8px" }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Viewport */}
        <div style={styles.mainContent}>{renderContent()}</div>
      </div>
    </section>
  );
}

// ===========================
// Styles Object
// ===========================
const styles = {
  section: {
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  demoContainer: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    background: "#fff",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 5px 25px rgba(0,0,0,.08)",
    border: "1px solid #e2e8f0",
  },
  sidebar: {
    background: "#f8fafc",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    borderRight: "1px solid #e2e8f0",
    maxHeight: "850px",
    overflowY: "auto",
  },
  sidebarButton: {
    padding: "12px 14px",
    border: "none",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "500",
    color: "#475569",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 3px rgba(0,0,0,.04)",
  },
  activeButton: {
    padding: "12px 14px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
  },
  mainContent: {
    padding: "40px",
    background: "#fff",
    minHeight: "550px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  subTitle: {
    color: "#64748b",
    lineHeight: "1.6",
    margin: 0,
    fontSize: "15px",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#f8fafc",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    border: "1px solid #f1f5f9",
  },
  cardHeader: {
    margin: "0 0 10px 0",
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "500",
  },
  cardValue: {
    margin: 0,
    fontSize: "28px",
    color: "#0f172a",
    fontWeight: "700",
  },
  skillText: {
    margin: "6px 0",
    color: "#16a34a",
    fontWeight: "600",
    fontSize: "14px",
  },
  skillTextMissing: {
    margin: "6px 0",
    color: "#dc2626",
    fontWeight: "600",
    fontSize: "14px",
  },
  infoBox: {
    background: "#f8fafc",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
  },
  infoBoxTitle: {
    margin: "0 0 12px 0",
    fontSize: "16px",
    color: "#1e293b",
  },
  list: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    color: "#334155",
  },
  scoreSection: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
    background: "#f8fafc",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #f1f5f9",
  },
  scoreCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "700",
    boxShadow: "0 4px 10px rgba(37, 99, 235, 0.2)",
  },
  timeline: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  timelineItem: {
    padding: "16px",
    borderLeft: "4px solid #2563eb",
    background: "#f8fafc",
    borderRadius: "0 8px 8px 0",
  },
  questionCard: {
    background: "#f8fafc",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
  },
  button: {
    width: "240px",
    padding: "12px 20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "background 0.2s",
  },
  secondaryButton: {
    padding: "8px 16px",
    background: "#fff",
    color: "#2563eb",
    border: "1px solid #2563eb",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },
  optionButton: {
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  uploadArea: {
    border: "2px dashed #cbd5e1",
    padding: "40px 20px",
    borderRadius: "10px",
    textAlign: "center",
    background: "#f8fafc",
  },
  uploadButton: {
    display: "inline-block",
    padding: "10px 20px",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontFamily: "inherit",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  }
};