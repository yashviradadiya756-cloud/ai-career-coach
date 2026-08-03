import React, { useState } from "react";
import {
  generateInterview,
  submitInterview,
} from "../../api/interviewApi";

export default function Interview() {
  const [targetRole, setTargetRole] = useState("");

  const [interview, setInterview] = useState(null);

  const [answers, setAnswers] = useState([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [loading, setLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [result, setResult] = useState(null);

  // ===============================
  // START INTERVIEW
  // ===============================

  const handleStartInterview = async () => {
    if (!targetRole.trim()) {
      alert("Please enter your target role.");
      return;
    }

    try {
      setLoading(true);

      const res = await generateInterview(
        targetRole.trim()
      );

      console.log("Interview generated:", res.data);

      const newInterview = res.data.interview;

      setInterview(newInterview);

      setAnswers(
        newInterview.questions.map(() => "")
      );

      setCurrentQuestion(0);

      setResult(null);

    } catch (error) {
      console.log(
        "Interview Error:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
        "Unable to start interview."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // ANSWER CHANGE
  // ===============================

  const handleAnswerChange = (value) => {
    const updatedAnswers = [...answers];

    updatedAnswers[currentQuestion] = value;

    setAnswers(updatedAnswers);
  };

  // ===============================
  // NEXT QUESTION
  // ===============================

  const handleNext = () => {
    if (!answers[currentQuestion]?.trim()) {
      alert("Please answer the question first.");
      return;
    }

    if (
      currentQuestion <
      interview.questions.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );
    }
  };

  // ===============================
  // PREVIOUS QUESTION
  // ===============================

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        currentQuestion - 1
      );
    }
  };

  // ===============================
  // FINISH INTERVIEW
  // ===============================

  const handleFinish = async () => {
    if (!answers[currentQuestion]?.trim()) {
      alert("Please answer the current question.");
      return;
    }

    const unanswered = answers.some(
      (answer) => !answer.trim()
    );

    if (unanswered) {
      alert(
        "Please answer all interview questions before finishing."
      );
      return;
    }

    try {
      setSubmitting(true);

      const res = await submitInterview(
        interview._id,
        answers
      );

      console.log(
        "Interview Result:",
        res.data
      );

      setResult(res.data.interview);

    } catch (error) {
      console.log(
        "Submit Error:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
        "Interview evaluation failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ===============================
  // WELCOME SCREEN
  // ===============================

  if (!interview) {
    return (
      <div style={styles.container}>

        <div style={styles.welcomeCard}>

          <div style={styles.bigIcon}>
            🎤
          </div>

          <div style={styles.aiBadge}>
            🤖 AI POWERED
          </div>

          <h1 style={styles.welcomeTitle}>
            AI Mock Interview
          </h1>

          <p style={styles.welcomeText}>
            Practice a real interview with your
            AI interviewer. Answer questions one
            by one and receive personalized
            feedback at the end.
          </p>

          <div style={styles.roleBox}>

            <label style={styles.label}>
              Target Job Role
            </label>

            <input
              type="text"
              value={targetRole}
              onChange={(e) =>
                setTargetRole(e.target.value)
              }
              placeholder="Example: Full Stack Developer"
              style={styles.roleInput}
            />

            <button
              onClick={handleStartInterview}
              disabled={loading}
              style={styles.startButton}
            >
              {loading
                ? "🤖 Preparing Interview..."
                : "🎤 Start Mock Interview"}
            </button>

          </div>

        </div>

        <div style={styles.featureGrid}>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              💬
            </div>

            <h3>Real Interview</h3>

            <p>
              Answer one question at a time
              just like an actual interview.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              🧠
            </div>

            <h3>AI Questions</h3>

            <p>
              Questions are generated according
              to your target career.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              📊
            </div>

            <h3>AI Evaluation</h3>

            <p>
              Get your performance score and
              detailed improvement suggestions.
            </p>
          </div>

        </div>

      </div>
    );
  }

  // ===============================
  // RESULT SCREEN
  // ===============================

  if (result) {
    return (
      <div style={styles.container}>

        <div style={styles.resultCard}>

          <div style={styles.trophy}>
            🏆
          </div>

          <div style={styles.aiBadge}>
            INTERVIEW COMPLETED
          </div>

          <h1>
            Great Job!
          </h1>

          <p style={styles.resultSubtitle}>
            Your AI interview has been evaluated.
          </p>

          <div style={styles.scoreCircle}>
            {result.totalScore || 0}
            <span>/100</span>
          </div>

          <h2>
            Overall Interview Score
          </h2>

          <div style={styles.resultGrid}>

            <div style={styles.resultBox}>
              <strong>
                {result.questions?.length || 0}
              </strong>

              <span>
                Questions
              </span>
            </div>

            <div style={styles.resultBox}>
              <strong>
                {result.targetRole}
              </strong>

              <span>
                Target Role
              </span>
            </div>

            <div style={styles.resultBox}>
              <strong>
                AI
              </strong>

              <span>
                Evaluation
              </span>
            </div>

          </div>

          <div style={styles.feedbackSection}>

            <h2>
              🤖 AI Feedback
            </h2>

            {result.questions?.map(
              (question, index) => (

                <div
                  key={index}
                  style={styles.feedbackCard}
                >

                  <h3>
                    Question {index + 1}
                  </h3>

                  <p>
                    <strong>
                      {question.question}
                    </strong>
                  </p>

                  <p>
                    <strong>
                      Your Answer:
                    </strong>{" "}
                    {question.answer}
                  </p>

                  <p>
                    <strong>
                      AI Feedback:
                    </strong>{" "}
                    {question.feedback}
                  </p>

                  <p>
                    <strong>
                      Improvement:
                    </strong>{" "}
                    {question.improvement}
                  </p>

                  <div style={styles.questionScore}>
                    Score: {question.score}/100
                  </div>

                </div>

              )
            )}

          </div>

          <button
            onClick={() => {
              setInterview(null);
              setAnswers([]);
              setCurrentQuestion(0);
              setResult(null);
              setTargetRole("");
            }}
            style={styles.newInterviewButton}
          >
            🔄 Start New Interview
          </button>

        </div>

      </div>
    );
  }

  // ===============================
  // MOCK INTERVIEW SCREEN
  // ===============================

  const question =
    interview.questions[currentQuestion];

  const totalQuestions =
    interview.questions.length;

  const progress =
    ((currentQuestion + 1) /
      totalQuestions) *
    100;

  const isLastQuestion =
    currentQuestion ===
    totalQuestions - 1;

  return (
    <div style={styles.container}>

      {/* TOP BAR */}

      <div style={styles.interviewHeader}>

        <div>

          <div style={styles.aiBadge}>
            🎤 LIVE MOCK INTERVIEW
          </div>

          <h1>
            {interview.targetRole}
          </h1>

          <p>
            AI Interview Session
          </p>

        </div>

        <div style={styles.progressText}>
          Question{" "}
          <strong>
            {currentQuestion + 1}
          </strong>{" "}
          / {totalQuestions}
        </div>

      </div>

      {/* PROGRESS */}

      <div style={styles.progressBackground}>

        <div
          style={{
            ...styles.progressFill,
            width: `${progress}%`,
          }}
        />

      </div>

      {/* INTERVIEWER */}

      <div style={styles.interviewerCard}>

        <div style={styles.avatar}>
          🤖
        </div>

        <div>

          <strong>
            AI Interviewer
          </strong>

          <p>
            Take your time and answer clearly.
          </p>

        </div>

      </div>

      {/* QUESTION */}

      <div style={styles.questionCard}>

        <div style={styles.questionNumber}>
          Question {currentQuestion + 1}
        </div>

        <h2 style={styles.questionText}>
          {question.question}
        </h2>

        <textarea
          value={
            answers[currentQuestion] || ""
          }
          onChange={(e) =>
            handleAnswerChange(
              e.target.value
            )
          }
          placeholder="Type your answer here..."
          style={styles.answerBox}
        />

        <div style={styles.answerHint}>
          💡 Tip: Explain your answer clearly
          and provide examples from your projects
          or experience when possible.
        </div>

      </div>

      {/* CONTROLS */}

      <div style={styles.controls}>

        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          style={{
            ...styles.previousButton,
            opacity:
              currentQuestion === 0
                ? 0.5
                : 1,
          }}
        >
          ← Previous
        </button>

        {!isLastQuestion ? (

          <button
            onClick={handleNext}
            style={styles.nextButton}
          >
            Next Question →
          </button>

        ) : (

          <button
            onClick={handleFinish}
            disabled={submitting}
            style={styles.finishButton}
          >
            {submitting
              ? "🤖 Evaluating..."
              : "🏁 Finish Interview"}
          </button>

        )}

      </div>

    </div>
  );
}

const styles = {

  container: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "30px",
  },

  welcomeCard: {
    maxWidth: "800px",
    margin: "30px auto",
    background: "#ffffff",
    padding: "50px",
    borderRadius: "24px",
    textAlign: "center",
    boxShadow:
      "0 15px 40px rgba(0,0,0,.08)",
  },

  bigIcon: {
    fontSize: "70px",
    marginBottom: "10px",
  },

  aiBadge: {
    display: "inline-block",
    background: "#dbeafe",
    color: "#2563eb",
    padding: "7px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: ".5px",
  },

  welcomeTitle: {
    fontSize: "38px",
    margin: "18px 0 10px",
    color: "#111827",
  },

  welcomeText: {
    color: "#6b7280",
    fontSize: "17px",
    lineHeight: "1.7",
    maxWidth: "650px",
    margin: "auto",
  },

  roleBox: {
    marginTop: "35px",
    textAlign: "left",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
  },

  roleInput: {
    width: "100%",
    padding: "15px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "16px",
    boxSizing: "border-box",
  },

  startButton: {
    width: "100%",
    marginTop: "15px",
    padding: "15px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
  },

  featureGrid: {
    maxWidth: "1000px",
    margin: "30px auto",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
  },

  featureCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow:
      "0 5px 20px rgba(0,0,0,.05)",
  },

  featureIcon: {
    fontSize: "35px",
  },

  interviewHeader: {
    background: "#fff",
    padding: "25px",
    borderRadius: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow:
      "0 5px 20px rgba(0,0,0,.05)",
  },

  progressText: {
    fontSize: "18px",
    color: "#374151",
  },

  progressBackground: {
    height: "10px",
    background: "#e5e7eb",
    borderRadius: "20px",
    margin: "20px 0",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "#2563eb",
    borderRadius: "20px",
    transition: "width .3s ease",
  },

  interviewerCard: {
    maxWidth: "800px",
    margin: "25px auto",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    background: "#eff6ff",
    padding: "18px 25px",
    borderRadius: "15px",
  },

  avatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "#2563eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "25px",
  },

  questionCard: {
    maxWidth: "850px",
    margin: "20px auto",
    background: "#fff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,.07)",
  },

  questionNumber: {
    color: "#2563eb",
    fontWeight: "700",
    marginBottom: "15px",
  },

  questionText: {
    fontSize: "25px",
    lineHeight: "1.5",
    color: "#111827",
  },

  answerBox: {
    width: "100%",
    minHeight: "180px",
    marginTop: "20px",
    padding: "16px",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    fontSize: "16px",
    resize: "vertical",
    boxSizing: "border-box",
  },

  answerHint: {
    marginTop: "12px",
    padding: "12px",
    background: "#fffbeb",
    borderRadius: "10px",
    color: "#92400e",
    fontSize: "14px",
  },

  controls: {
    maxWidth: "850px",
    margin: "20px auto",
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
  },

  previousButton: {
    padding: "13px 25px",
    background: "#fff",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  nextButton: {
    marginLeft: "auto",
    padding: "13px 30px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
  },

  finishButton: {
    marginLeft: "auto",
    padding: "13px 30px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
  },

  resultCard: {
    maxWidth: "900px",
    margin: "30px auto",
    background: "#fff",
    padding: "45px",
    borderRadius: "24px",
    textAlign: "center",
    boxShadow:
      "0 10px 35px rgba(0,0,0,.08)",
  },

  trophy: {
    fontSize: "65px",
  },

  resultSubtitle: {
    color: "#6b7280",
  },

  scoreCircle: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    background: "#eff6ff",
    color: "#2563eb",
    margin: "30px auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "45px",
    fontWeight: "800",
  },

  resultGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3,1fr)",
    gap: "15px",
    margin: "30px 0",
  },

  resultBox: {
    padding: "20px",
    background: "#f8fafc",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  feedbackSection: {
    textAlign: "left",
    marginTop: "35px",
  },

  feedbackCard: {
    padding: "20px",
    background: "#f8fafc",
    borderRadius: "12px",
    marginBottom: "15px",
    borderLeft: "4px solid #2563eb",
  },

  questionScore: {
    fontWeight: "700",
    color: "#2563eb",
    marginTop: "10px",
  },

  newInterviewButton: {
    marginTop: "25px",
    padding: "14px 30px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
  },
};