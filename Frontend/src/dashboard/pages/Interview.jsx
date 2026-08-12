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

  const [interviewType, setInterviewType] =
    useState("Student / Fresher");

  const [difficulty, setDifficulty] =
    useState("Medium");

  const [questionCount, setQuestionCount] =
    useState("5");

  const [customType, setCustomType] =
    useState("");

  const [interview, setInterview] =
    useState(null);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answer, setAnswer] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] =
    useState("");

  const [result, setResult] =
    useState(null);

  // ==========================================
  // INTERVIEW TYPES
  // ==========================================

  const interviewTypes = [
    {
      id: "Student / Fresher",
      icon: "🎓",
      title: "Student / Fresher",
      description:
        "Fundamentals, projects, academics and beginner questions",
    },
    {
      id: "Job Seeker",
      icon: "💼",
      title: "Job Seeker",
      description:
        "Technical, behavioral and job-focused questions",
    },
    {
      id: "Experienced Professional",
      icon: "👨‍💻",
      title: "Experienced",
      description:
        "Advanced technical and real-world scenario questions",
    },
    {
      id: "Career Switcher",
      icon: "🔄",
      title: "Career Switcher",
      description:
        "Transition, transferable skills and role-specific questions",
    },
    {
      id: "HR / Behavioral",
      icon: "🧑‍💼",
      title: "HR / Behavioral",
      description:
        "Communication, teamwork, leadership and situational questions",
    },
    {
      id: "Technical",
      icon: "⚙️",
      title: "Technical",
      description:
        "Technical concepts, coding and problem-solving questions",
    },
    {
      id: "Internship",
      icon: "🚀",
      title: "Internship",
      description:
        "Internship-level technical and behavioral questions",
    },
    {
      id: "Custom",
      icon: "✨",
      title: "Custom",
      description:
        "Create an interview based on your own requirements",
    },
  ];

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

      if (
        interviewType === "Custom" &&
        !customType.trim()
      ) {
        setError(
          "Please describe your custom interview type."
        );
        return;
      }

      setLoading(true);

      console.log(
        "Starting interview:",
        {
          targetRole,
          interviewType,
          difficulty,
          questionCount,
          customType,
        }
      );

      /*
       * CURRENT BACKEND
       *
       * Your existing API accepts only targetRole.
       *
       * Later, when you update the backend, change this to:
       *
       * generateInterview({
       *   targetRole,
       *   interviewType,
       *   difficulty,
       *   questionCount,
       *   customType,
       * });
       */

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

      // Add frontend metadata temporarily.
      const interviewWithSettings = {
        ...data.interview,
        frontendInterviewType:
          interviewType === "Custom"
            ? customType
            : interviewType,
        frontendDifficulty: difficulty,
        frontendQuestionCount: questionCount,
      };

      setInterview(interviewWithSettings);

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
  // SAVE CURRENT ANSWER
  // ==========================================

  const saveCurrentAnswer = () => {
    if (!interview) return;

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

    saveCurrentAnswer();

    if (
      currentQuestion <
      interview.questions.length - 1
    ) {
      const nextIndex =
        currentQuestion + 1;

      setCurrentQuestion(nextIndex);

      setAnswer(
        interview.questions[nextIndex]
          ?.answer || ""
      );
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

    saveCurrentAnswer();

    const previousIndex =
      currentQuestion - 1;

    setCurrentQuestion(previousIndex);

    setAnswer(
      interview.questions[previousIndex]
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

    setInterviewType(
      "Student / Fresher"
    );

    setDifficulty("Medium");

    setQuestionCount("5");

    setCustomType("");

    setCurrentQuestion(0);

    setAnswer("");

    setError("");

    setSuccess("");

    setResult(null);
  };

  // ==========================================
  // RESULT SCREEN
  // ==========================================

  if (result) {
    const finalScore =
      result.interview?.totalScore ??
      result.totalScore ??
      0;

    const improvement =
      result.interview?.improvement ??
      result.improvement ??
      "Keep practicing to improve your interview performance.";

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            🎯
          </div>

          <div>
            <h1 style={styles.title}>
              Interview Result
            </h1>

            <p style={styles.subtitle}>
              Your AI interview has been
              evaluated.
            </p>
          </div>
        </div>

        <div style={styles.resultCard}>
          <div style={styles.resultIcon}>
            🏆
          </div>

          <p style={styles.resultLabel}>
            Your Interview Score
          </p>

          <div style={styles.score}>
            {finalScore}%
          </div>

          <div style={styles.scoreTrack}>
            <div
              style={{
                ...styles.scoreFill,
                width: `${Math.min(
                  Number(finalScore) || 0,
                  100
                )}%`,
              }}
            />
          </div>

          <div style={styles.resultInfoGrid}>
            <div style={styles.resultInfo}>
              <span>Role</span>
              <strong>
                {interview?.targetRole ||
                  targetRole}
              </strong>
            </div>

            <div style={styles.resultInfo}>
              <span>Interview Type</span>
              <strong>
                {interview?.frontendInterviewType ||
                  interviewType}
              </strong>
            </div>

            <div style={styles.resultInfo}>
              <span>Difficulty</span>
              <strong>
                {interview?.frontendDifficulty ||
                  difficulty}
              </strong>
            </div>
          </div>

          <div style={styles.improvementBox}>
            <h3>
              💡 AI Feedback
            </h3>

            <p>{improvement}</p>
          </div>

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

    const progress =
      ((currentQuestion + 1) /
        totalQuestions) *
      100;

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
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

          <div style={styles.interviewBadge}>
            <span>
              {interview.frontendInterviewType ===
              "Student / Fresher"
                ? "🎓"
                : "🎯"}
            </span>

            {interview.frontendInterviewType}
          </div>
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

        <div style={styles.interviewMeta}>
          <div>
            <span>Interview Type</span>
            <strong>
              {interview.frontendInterviewType}
            </strong>
          </div>

          <div>
            <span>Difficulty</span>
            <strong>
              {interview.frontendDifficulty}
            </strong>
          </div>

          <div>
            <span>Questions</span>
            <strong>
              {totalQuestions}
            </strong>
          </div>
        </div>

        <div style={styles.progressHeader}>
          <span>
            Question{" "}
            {currentQuestion + 1} of{" "}
            {totalQuestions}
          </span>

          <strong>
            {Math.round(progress)}%
          </strong>
        </div>

        <div style={styles.progressContainer}>
          <div
            style={{
              ...styles.progressBar,
              width: `${progress}%`,
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

          <div style={styles.answerHint}>
            💡 Try to provide a clear,
            structured answer with examples
            where possible.
          </div>

          <div style={styles.buttonRow}>
            <button
              style={{
                ...styles.secondaryButton,
                opacity:
                  currentQuestion === 0
                    ? 0.5
                    : 1,
                cursor:
                  currentQuestion === 0
                    ? "not-allowed"
                    : "pointer",
              }}
              onClick={
                previousQuestion
              }
              disabled={
                currentQuestion === 0
              }
            >
              ← Previous
            </button>

            {currentQuestion <
            totalQuestions - 1 ? (
              <button
                style={
                  styles.primaryButton
                }
                onClick={nextQuestion}
              >
                Save & Next →
              </button>
            ) : (
              <button
                style={
                  styles.submitButton
                }
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Interview ✓"}
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
        <div style={styles.headerIcon}>
          🎤
        </div>

        <div>
          <h1 style={styles.title}>
            AI Mock Interview
          </h1>

          <p style={styles.subtitle}>
            Practice with AI-generated
            questions based on your career
            goals and interview type.
          </p>
        </div>
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

      <div style={styles.setupCard}>
        <div style={styles.setupHeader}>
          <div>
            <h2 style={styles.setupTitle}>
              Prepare Your Interview
            </h2>

            <p style={styles.setupSubtitle}>
              Customize your mock interview
              before you begin.
            </p>
          </div>

          <div style={styles.setupIcon}>
            🤖
          </div>
        </div>

        {/* TARGET ROLE */}

        <div style={styles.formGroup}>
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

          <p style={styles.fieldHint}>
            Enter the job role you want to
            practice for.
          </p>
        </div>

        {/* INTERVIEW TYPE */}

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Select Interview Type
          </label>

          <div style={styles.typeGrid}>
            {interviewTypes.map((type) => {
              const selected =
                interviewType === type.id;

              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() =>
                    setInterviewType(
                      type.id
                    )
                  }
                  style={{
                    ...styles.typeCard,
                    ...(selected
                      ? styles.typeCardSelected
                      : {}),
                  }}
                >
                  <div
                    style={
                      styles.typeIcon
                    }
                  >
                    {type.icon}
                  </div>

                  <div
                    style={
                      styles.typeContent
                    }
                  >
                    <strong>
                      {type.title}
                    </strong>

                    <span>
                      {type.description}
                    </span>
                  </div>

                  <div
                    style={{
                      ...styles.radio,
                      ...(selected
                        ? styles.radioSelected
                        : {}),
                    }}
                  >
                    {selected && "✓"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CUSTOM TYPE */}

        {interviewType === "Custom" && (
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Describe Your Interview
            </label>

            <textarea
              value={customType}
              onChange={(e) =>
                setCustomType(
                  e.target.value
                )
              }
              placeholder="Example: Product Manager interview focused on leadership and product strategy..."
              style={
                styles.customTextarea
              }
              rows={4}
            />
          </div>
        )}

        {/* DIFFICULTY + QUESTIONS */}

        <div style={styles.settingsGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Difficulty Level
            </label>

            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(
                  e.target.value
                )
              }
              style={styles.select}
            >
              <option value="Easy">
                🟢 Easy
              </option>

              <option value="Medium">
                🟡 Medium
              </option>

              <option value="Hard">
                🔴 Hard
              </option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Number of Questions
            </label>

            <select
              value={questionCount}
              onChange={(e) =>
                setQuestionCount(
                  e.target.value
                )
              }
              style={styles.select}
            >
              <option value="5">
                5 Questions
              </option>

              <option value="10">
                10 Questions
              </option>

              <option value="15">
                15 Questions
              </option>
            </select>
          </div>
        </div>

        {/* SELECTED SUMMARY */}

        <div style={styles.summaryBox}>
          <div>
            <span>Role</span>
            <strong>
              {targetRole ||
                "Not selected"}
            </strong>
          </div>

          <div>
            <span>Type</span>
            <strong>
              {interviewType ===
              "Custom"
                ? customType ||
                  "Custom"
                : interviewType}
            </strong>
          </div>

          <div>
            <span>Level</span>
            <strong>
              {difficulty}
            </strong>
          </div>

          <div>
            <span>Questions</span>
            <strong>
              {questionCount}
            </strong>
          </div>
        </div>

        {/* START BUTTON */}

        <button
          style={{
            ...styles.startButton,
            opacity: loading ? 0.7 : 1,
            cursor: loading
              ? "not-allowed"
              : "pointer",
          }}
          onClick={startInterview}
          disabled={loading}
        >
          {loading
            ? "Generating Questions..."
            : "🚀 Start AI Interview"}
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
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "24px",
    minHeight: "100vh",
    background: "#f8fafc",
    boxSizing: "border-box",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: "#111827",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    background: "#ffffff",
    padding: "24px",
    borderRadius: "16px",
    marginBottom: "20px",
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 2px 8px rgba(15, 23, 42, 0.04)",
  },

  headerIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
    flexShrink: 0,
  },

  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "750",
    color: "#111827",
    letterSpacing: "-0.02em",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  interviewBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: "999px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: "13px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  error: {
    padding: "13px 16px",
    background: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: "500",
  },

  success: {
    padding: "13px 16px",
    background: "#f0fdf4",
    color: "#166534",
    border: "1px solid #bbf7d0",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: "500",
  },

  setupCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "28px",
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 2px 8px rgba(15, 23, 42, 0.04)",
  },

  setupHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
    paddingBottom: "20px",
    borderBottom: "1px solid #f1f5f9",
  },

  setupTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827",
  },

  setupSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  setupIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "14px",
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
  },

  formGroup: {
    marginBottom: "24px",
  },

  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "700",
    color: "#334155",
    marginBottom: "9px",
  },

  input: {
    width: "100%",
    padding: "13px 15px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "15px",
    boxSizing: "border-box",
    outline: "none",
    color: "#111827",
    background: "#ffffff",
  },

  fieldHint: {
    margin: "6px 0 0",
    fontSize: "12px",
    color: "#94a3b8",
  },

  typeGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "12px",
  },

  typeCard: {
    position: "relative",
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    textAlign: "left",
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
  },

  typeCardSelected: {
    border: "1.5px solid #2563eb",
    background: "#eff6ff",
    boxShadow:
      "0 0 0 3px rgba(37, 99, 235, 0.08)",
  },

  typeIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  typeContent: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    paddingRight: "18px",
  },

  typeContentStrong: {
    fontSize: "14px",
  },

  typeContentSpan: {
    fontSize: "12px",
  },

  radio: {
    position: "absolute",
    top: "14px",
    right: "14px",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: "1px solid #cbd5e1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    color: "#ffffff",
    background: "#ffffff",
  },

  radioSelected: {
    background: "#2563eb",
    borderColor: "#2563eb",
  },

  customTextarea: {
    width: "100%",
    padding: "13px 15px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    resize: "vertical",
    color: "#111827",
  },

  settingsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },

  select: {
    width: "100%",
    padding: "13px 15px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#111827",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
  },

  summaryBox: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "12px",
    padding: "16px",
    borderRadius: "12px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    marginBottom: "20px",
  },

  summaryItem: {
    display: "flex",
    flexDirection: "column",
  },

  startButton: {
    width: "100%",
    padding: "14px 20px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "700",
  },

  interviewMeta: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "12px",
    marginBottom: "20px",
  },

  progressHeader: {
    maxWidth: "900px",
    margin: "0 auto 8px",
    display: "flex",
    justifyContent: "space-between",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "600",
  },

  progressContainer: {
    maxWidth: "900px",
    height: "8px",
    margin: "0 auto",
    background: "#e2e8f0",
    borderRadius: "99px",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    background: "#2563eb",
    borderRadius: "99px",
    transition: "width 0.3s ease",
  },

  questionCard: {
    maxWidth: "900px",
    margin: "22px auto",
    background: "#ffffff",
    padding: "28px",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 2px 8px rgba(15, 23, 42, 0.04)",
  },

  questionNumber: {
    display: "inline-block",
    padding: "6px 10px",
    background: "#eff6ff",
    color: "#2563eb",
    borderRadius: "7px",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "14px",
  },

  question: {
    margin: "0 0 20px",
    fontSize: "21px",
    lineHeight: "1.5",
    color: "#111827",
  },

  textarea: {
    width: "100%",
    padding: "15px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "15px",
    resize: "vertical",
    boxSizing: "border-box",
    outline: "none",
    color: "#111827",
    lineHeight: "1.6",
  },

  answerHint: {
    marginTop: "8px",
    color: "#64748b",
    fontSize: "12px",
  },

  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginTop: "22px",
  },

  primaryButton: {
    padding: "12px 22px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
  },

  secondaryButton: {
    padding: "12px 22px",
    background: "#f1f5f9",
    color: "#334155",
    border: "1px solid #e2e8f0",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },

  submitButton: {
    padding: "12px 22px",
    background: "#16a34a",
    color: "#ffffff",
    border: "none",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
  },

  resultCard: {
    maxWidth: "700px",
    margin: "30px auto",
    background: "#ffffff",
    padding: "35px",
    borderRadius: "18px",
    textAlign: "center",
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 4px 15px rgba(15, 23, 42, 0.06)",
  },

  resultIcon: {
    fontSize: "45px",
    marginBottom: "8px",
  },

  resultLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "600",
  },

  score: {
    fontSize: "58px",
    fontWeight: "800",
    color: "#2563eb",
    margin: "8px 0 15px",
  },

  scoreTrack: {
    width: "100%",
    height: "9px",
    background: "#e2e8f0",
    borderRadius: "99px",
    overflow: "hidden",
    marginBottom: "25px",
  },

  scoreFill: {
    height: "100%",
    background: "#2563eb",
    borderRadius: "99px",
  },

  resultInfoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "12px",
    marginBottom: "22px",
  },

  resultInfo: {
    padding: "14px",
    borderRadius: "10px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  improvementBox: {
    textAlign: "left",
    padding: "18px",
    borderRadius: "12px",
    background: "#eff6ff",
    border: "1px solid #dbeafe",
    marginBottom: "22px",
  },
};

export default Interview;