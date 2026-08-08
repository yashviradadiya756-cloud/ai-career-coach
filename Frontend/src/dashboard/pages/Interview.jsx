import React, { useState } from "react";

import {
  generateInterview,
  submitInterview,
} from "../../api/interviewApi";

const Interview = () => {
  // ==========================================
  // STATE
  // ==========================================

  const [targetRole, setTargetRole] = useState("");

  const [interview, setInterview] = useState(null);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answer, setAnswer] = useState("");

  const [loading, setLoading] = useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [result, setResult] = useState(null);

  // ==========================================
  // START INTERVIEW
  // ==========================================

  const startInterview = async () => {
    try {
      setError("");
      setSuccess("");
      setResult(null);

      if (!targetRole.trim()) {
        setError(
          "Please enter your target job role."
        );
        return;
      }

      setLoading(true);

      console.log(
        "Starting interview:",
        targetRole
      );

      const data = await generateInterview(
        targetRole.trim()
      );

      console.log(
        "Interview API Response:",
        data
      );

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to generate interview"
        );
      }

      if (
        !data.interview ||
        !Array.isArray(
          data.interview.questions
        ) ||
        data.interview.questions.length === 0
      ) {
        throw new Error(
          "No interview questions were generated."
        );
      }

      setInterview(data.interview);

      setCurrentQuestion(0);

      setAnswer("");

      setSuccess(
        "Interview generated successfully!"
      );
    } catch (error) {
      console.error(
        "Interview generation error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to generate interview."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // NEXT QUESTION
  // ==========================================

  const nextQuestion = () => {
    if (!answer.trim()) {
      setError(
        "Please answer the question before continuing."
      );
      return;
    }

    setError("");

    const updatedQuestions = [
      ...interview.questions,
    ];

    updatedQuestions[currentQuestion] = {
      ...updatedQuestions[currentQuestion],
      answer: answer.trim(),
    };

    setInterview({
      ...interview,
      questions: updatedQuestions,
    });

    if (
      currentQuestion <
      interview.questions.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );

      setAnswer("");
    } else {
      setSuccess(
        "All questions answered. Submit your interview."
      );
    }
  };

  // ==========================================
  // PREVIOUS QUESTION
  // ==========================================

  const previousQuestion = () => {
    if (currentQuestion === 0) {
      return;
    }

    const updatedQuestions = [
      ...interview.questions,
    ];

    updatedQuestions[currentQuestion] = {
      ...updatedQuestions[currentQuestion],
      answer: answer.trim(),
    };

    setInterview({
      ...interview,
      questions: updatedQuestions,
    });

    const previousIndex =
      currentQuestion - 1;

    setCurrentQuestion(previousIndex);

    setAnswer(
      updatedQuestions[previousIndex]
        ?.answer || ""
    );

    setError("");
  };

  // ==========================================
  // SUBMIT INTERVIEW
  // ==========================================

  const handleSubmit = async () => {
    try {
      setError("");
      setSuccess("");

      if (!interview) {
        return;
      }

      const questions = [
        ...interview.questions,
      ];

      questions[currentQuestion] = {
        ...questions[currentQuestion],
        answer: answer.trim(),
      };

      const unanswered = questions.some(
        (question) =>
          !question.answer ||
          !question.answer.trim()
      );

      if (unanswered) {
        setError(
          "Please answer all interview questions before submitting."
        );
        return;
      }

      setSubmitting(true);

      const data = await submitInterview({
        interviewId: interview._id,
        questions,
      });

      console.log(
        "Submit Interview Response:",
        data
      );

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to submit interview"
        );
      }

      setResult(data);

      setSuccess(
        "Interview submitted successfully!"
      );
    } catch (error) {
      console.error(
        "Interview submit error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit interview."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // RESET
  // ==========================================

  const resetInterview = () => {
    setInterview(null);

    setTargetRole("");

    setCurrentQuestion(0);

    setAnswer("");

    setError("");

    setSuccess("");

    setResult(null);
  };

  // ==========================================
  // RESULT
  // ==========================================

  if (result) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            🎯 Interview Result
          </h1>

          <p style={styles.subtitle}>
            Your AI interview has been evaluated.
          </p>
        </div>

        <div style={styles.resultCard}>
          <h2>
            Interview Completed
          </h2>

          <div style={styles.score}>
            {result.interview?.totalScore ??
              result.totalScore ??
              0}
            %
          </div>

          <p>
            {result.interview?.improvement ||
              result.improvement ||
              "Keep practicing to improve your interview performance."}
          </p>

          <button
            style={styles.primaryButton}
            onClick={resetInterview}
          >
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // INTERVIEW SCREEN
  // ==========================================

  if (interview) {
    const question =
      interview.questions[currentQuestion];

    const totalQuestions =
      interview.questions.length;

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            🎤 AI Mock Interview
          </h1>

          <p style={styles.subtitle}>
            Target Role:{" "}
            <strong>
              {interview.targetRole}
            </strong>
          </p>
        </div>

        {error && (
          <div style={styles.error}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={styles.success}>
            ✓ {success}
          </div>
        )}

        <div style={styles.progressText}>
          Question {currentQuestion + 1} of{" "}
          {totalQuestions}
        </div>

        <div style={styles.progressContainer}>
          <div
            style={{
              ...styles.progressBar,
              width: `${
                ((currentQuestion + 1) /
                  totalQuestions) *
                100
              }%`,
            }}
          />
        </div>

        <div style={styles.questionCard}>
          <div style={styles.questionNumber}>
            Question {currentQuestion + 1}
          </div>

          <h2 style={styles.question}>
            {question.question}
          </h2>

          <textarea
            value={answer}
            onChange={(e) =>
              setAnswer(e.target.value)
            }
            placeholder="Type your answer here..."
            style={styles.textarea}
            rows={8}
          />

          <div style={styles.buttonRow}>
            <button
              style={styles.secondaryButton}
              onClick={previousQuestion}
              disabled={
                currentQuestion === 0
              }
            >
              ← Previous
            </button>

            {currentQuestion <
            totalQuestions - 1 ? (
              <button
                style={styles.primaryButton}
                onClick={nextQuestion}
              >
                Next →
              </button>
            ) : (
              <button
                style={styles.submitButton}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Interview"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // START SCREEN
  // ==========================================

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          🎤 AI Mock Interview
        </h1>

        <p style={styles.subtitle}>
          Practice with AI-generated interview
          questions based on your target role.
        </p>
      </div>

      {error && (
        <div style={styles.error}>
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div style={styles.success}>
          ✓ {success}
        </div>
      )}

      <div style={styles.startCard}>
        <div style={styles.icon}>
          🤖
        </div>

        <h2>
          Start Your AI Interview
        </h2>

        <p>
          Enter your target role and CareerPilot
          will generate technical interview
          questions for you.
        </p>

        <label style={styles.label}>
          Target Job Role
        </label>

        <input
          type="text"
          value={targetRole}
          onChange={(e) =>
            setTargetRole(e.target.value)
          }
          placeholder="e.g. React Developer"
          style={styles.input}
        />

        <button
          style={styles.primaryButton}
          onClick={startInterview}
          disabled={loading}
        >
          {loading
            ? "Generating Questions..."
            : "Start Interview"}
        </button>
      </div>
    </div>
  );
};

// ==========================================
// STYLES
// ==========================================

const styles = {
  container: {
    padding: "30px",
    minHeight: "100vh",
    background: "#f5f7fb",
  },

  header: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "16px",
    marginBottom: "20px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.08)",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    color: "#111827",
  },

  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
  },

  startCard: {
    maxWidth: "650px",
    margin: "40px auto",
    background: "#ffffff",
    padding: "40px",
    borderRadius: "18px",
    textAlign: "center",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.08)",
  },

  icon: {
    fontSize: "50px",
    marginBottom: "10px",
  },

  label: {
    display: "block",
    textAlign: "left",
    fontWeight: "600",
    marginBottom: "8px",
    marginTop: "25px",
  },

  input: {
    width: "100%",
    padding: "13px",
    border:
      "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    boxSizing: "border-box",
    marginBottom: "20px",
  },

  questionCard: {
    maxWidth: "900px",
    margin: "25px auto",
    background: "#ffffff",
    padding: "35px",
    borderRadius: "18px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.08)",
  },

  questionNumber: {
    color: "#2563eb",
    fontWeight: "700",
    marginBottom: "15px",
  },

  question: {
    fontSize: "22px",
    lineHeight: "1.5",
    marginBottom: "25px",
    color: "#111827",
  },

  textarea: {
    width: "100%",
    padding: "15px",
    border:
      "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "16px",
    resize: "vertical",
    boxSizing: "border-box",
    marginBottom: "20px",
  },

  progressText: {
    maxWidth: "900px",
    margin: "0 auto 8px",
    fontWeight: "600",
    color: "#374151",
  },

  progressContainer: {
    maxWidth: "900px",
    margin: "0 auto",
    height: "8px",
    background: "#e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    background: "#2563eb",
    borderRadius: "10px",
    transition: "width 0.3s ease",
  },

  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
  },

  primaryButton: {
    padding: "12px 24px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },

  secondaryButton: {
    padding: "12px 24px",
    background: "#e5e7eb",
    color: "#111827",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },

  submitButton: {
    padding: "12px 24px",
    background: "#16a34a",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },

  error: {
    maxWidth: "900px",
    margin: "0 auto 20px",
    padding: "14px 18px",
    background: "#fee2e2",
    color: "#991b1b",
    borderRadius: "8px",
    fontWeight: "500",
  },

  success: {
    maxWidth: "900px",
    margin: "0 auto 20px",
    padding: "14px 18px",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "8px",
    fontWeight: "500",
  },

  resultCard: {
    maxWidth: "650px",
    margin: "40px auto",
    background: "#ffffff",
    padding: "40px",
    borderRadius: "18px",
    textAlign: "center",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.08)",
  },

  score: {
    fontSize: "60px",
    fontWeight: "800",
    color: "#2563eb",
    margin: "20px 0",
  },
};

export default Interview;