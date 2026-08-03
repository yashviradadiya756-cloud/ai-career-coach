import React, { useEffect, useState, useRef } from "react";
import axios from "../../api/axios";

export default function Interview() {
  const [interview, setInterview] = useState(null);

  const [targetRole, setTargetRole] = useState("Full Stack Developer");

  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState("");

  const [listening, setListening] = useState(false);

  const [feedback, setFeedback] = useState(null);

  const [completed, setCompleted] = useState(false);

  const recognitionRef = useRef(null);

  // =====================================================
  // CHECK BROWSER SPEECH SUPPORT
  // =====================================================

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  // =====================================================
  // SPEAK QUESTION
  // =====================================================

  const speakQuestion = (question) => {
    if (!window.speechSynthesis) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(question);

    speech.lang = "en-US";
    speech.rate = 0.9;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  // =====================================================
  // GENERATE INTERVIEW
  // =====================================================

  const startInterview = async () => {
    if (!targetRole.trim()) {
      alert("Please enter target role");
      return;
    }

    try {
      setStarting(true);

      const res = await axios.post("/api/interview/generate", {
        targetRole: targetRole.trim(),
      });

      console.log("Interview:", res.data);

      setInterview(res.data.interview);

      setCurrentIndex(0);

      setAnswer("");

      setFeedback(null);

      setCompleted(false);

      // Speak first question
      setTimeout(() => {
        speakQuestion(res.data.interview.questions[0].question);
      }, 500);

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Unable to start interview"
      );
    } finally {
      setStarting(false);
    }
  };

  // =====================================================
  // START SPEAKING
  // =====================================================

  const startListening = () => {
    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser. Please use Google Chrome."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = true;

    recognition.interimResults = true;

    recognitionRef.current = recognition;

    let finalTranscript = answer;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      setAnswer(
        finalTranscript + interimTranscript
      );
    };

    recognition.onerror = (event) => {
      console.log("Speech error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  // =====================================================
  // STOP SPEAKING
  // =====================================================

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setListening(false);
  };

  // =====================================================
  // SUBMIT ANSWER
  // =====================================================

  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert("Please answer the question first.");
      return;
    }

    try {
      setLoading(true);

      stopListening();

      const currentQuestion =
        interview.questions[currentIndex];

      const res = await axios.post(
        "/api/interview/submit",
        {
          interviewId: interview._id,

          questionIndex: currentIndex,

          question: currentQuestion.question,

          answer: answer.trim(),
        }
      );

      console.log("Evaluation:", res.data);

      setFeedback(res.data.evaluation);

      // Update current question locally
      const updatedQuestions = [
        ...interview.questions,
      ];

      updatedQuestions[currentIndex] = {
        ...updatedQuestions[currentIndex],
        answer: answer.trim(),
        score: res.data.evaluation.score,
        feedback: res.data.evaluation.feedback,
        improvement:
          res.data.evaluation.improvement,
      };

      setInterview({
        ...interview,
        questions: updatedQuestions,
      });

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Unable to evaluate answer"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // NEXT QUESTION
  // =====================================================

  const nextQuestion = () => {
    const nextIndex = currentIndex + 1;

    if (
      nextIndex >= interview.questions.length
    ) {
      setCompleted(true);

      window.speechSynthesis.cancel();

      return;
    }

    setCurrentIndex(nextIndex);

    setAnswer("");

    setFeedback(null);

    setTimeout(() => {
      speakQuestion(
        interview.questions[nextIndex].question
      );
    }, 300);
  };

  // =====================================================
  // REPEAT QUESTION
  // =====================================================

  const repeatQuestion = () => {
    if (!interview) return;

    speakQuestion(
      interview.questions[currentIndex].question
    );
  };

  // =====================================================
  // CLEANUP
  // =====================================================

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // =====================================================
  // START SCREEN
  // =====================================================

  if (!interview) {
    return (
      <div style={styles.container}>

        <div style={styles.startCard}>

          <div style={styles.robot}>
            🤖
          </div>

          <h1>
            AI Mock Interview
          </h1>

          <p style={styles.subtitle}>
            Practice a real interview with your
            AI interviewer.
          </p>

          <div style={styles.infoGrid}>

            <div style={styles.infoCard}>
              🎙️
              <h3>Speak Your Answer</h3>
              <p>
                Answer questions using your voice.
              </p>
            </div>

            <div style={styles.infoCard}>
              🔊
              <h3>AI Speaks</h3>
              <p>
                Questions are asked by voice.
              </p>
            </div>

            <div style={styles.infoCard}>
              🧠
              <h3>AI Evaluation</h3>
              <p>
                Get score and feedback.
              </p>
            </div>

          </div>

          <div style={styles.roleBox}>

            <label>
              Target Job Role
            </label>

            <input
              value={targetRole}
              onChange={(e) =>
                setTargetRole(e.target.value)
              }
              placeholder="Example: Full Stack Developer"
              style={styles.input}
            />

          </div>

          <button
            onClick={startInterview}
            disabled={starting}
            style={styles.startButton}
          >
            {starting
              ? "Preparing Interview..."
              : "🎤 Start AI Interview"}
          </button>

          <p style={styles.tip}>
            💡 Use Google Chrome and allow microphone
            permission when asked.
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // COMPLETED SCREEN
  // =====================================================

  if (completed) {

    const answeredQuestions =
      interview.questions.filter(
        (q) => q.answer
      );

    const totalScore =
      answeredQuestions.reduce(
        (sum, q) => sum + (q.score || 0),
        0
      );

    const averageScore =
      answeredQuestions.length > 0
        ? Math.round(
            totalScore /
              answeredQuestions.length
          )
        : 0;

    return (
      <div style={styles.container}>

        <div style={styles.resultCard}>

          <div style={styles.successIcon}>
            🎉
          </div>

          <h1>
            Interview Completed!
          </h1>

          <p>
            Great job completing your AI mock
            interview.
          </p>

          <div style={styles.scoreCircle}>
            <span>
              {averageScore}
            </span>
            <small>/100</small>
          </div>

          <h2>
            Overall Interview Score
          </h2>

          <div style={styles.reviewBox}>

            <h3>
              🤖 AI Interview Review
            </h3>

            <p>
              You completed{" "}
              <strong>
                {answeredQuestions.length}
              </strong>{" "}
              questions for the role of{" "}
              <strong>
                {interview.targetRole}
              </strong>.
            </p>

            <p>
              Continue practicing communication,
              technical concepts, project
              explanations and confidence.
            </p>

          </div>

          <button
            style={styles.startButton}
            onClick={() => {
              setInterview(null);
              setCompleted(false);
              setCurrentIndex(0);
              setAnswer("");
              setFeedback(null);
            }}
          >
            🔄 Start New Interview
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // INTERVIEW SCREEN
  // =====================================================

  const currentQuestion =
    interview.questions[currentIndex];

  const progress =
    ((currentIndex + 1) /
      interview.questions.length) *
    100;

  return (
    <div style={styles.container}>

      <div style={styles.interviewContainer}>

        {/* Header */}

        <div style={styles.interviewHeader}>

          <div>

            <span style={styles.badge}>
              🤖 AI Interviewer
            </span>

            <h1>
              {interview.targetRole}
            </h1>

          </div>

          <div style={styles.questionCounter}>
            Question{" "}
            {currentIndex + 1} /{" "}
            {interview.questions.length}
          </div>

        </div>

        {/* Progress */}

        <div style={styles.progressBackground}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progress}%`,
            }}
          />
        </div>

        {/* Question */}

        <div style={styles.questionCard}>

          <div style={styles.questionIcon}>
            🤖
          </div>

          <div style={{ flex: 1 }}>

            <span style={styles.aiLabel}>
              AI INTERVIEWER
            </span>

            <h2>
              {currentQuestion.question}
            </h2>

          </div>

          <button
            onClick={repeatQuestion}
            style={styles.repeatButton}
          >
            🔊 Repeat
          </button>

        </div>

        {/* Answer */}

        <div style={styles.answerCard}>

          <h2>
            🎙️ Your Answer
          </h2>

          <p style={styles.answerHint}>
            Click the microphone and speak your
            answer naturally.
          </p>

          <textarea
            value={answer}
            onChange={(e) =>
              setAnswer(e.target.value)
            }
            placeholder="Your spoken answer will appear here..."
            style={styles.textarea}
          />

          <div style={styles.voiceControls}>

            {!listening ? (
              <button
                onClick={startListening}
                style={styles.micButton}
              >
                🎙️ Start Speaking
              </button>
            ) : (
              <button
                onClick={stopListening}
                style={styles.stopButton}
              >
                ⏹ Stop Speaking
              </button>
            )}

            <button
              onClick={submitAnswer}
              disabled={
                loading || !answer.trim()
              }
              style={styles.submitButton}
            >
              {loading
                ? "🤖 AI Evaluating..."
                : "✅ Submit Answer"}
            </button>

          </div>

          {listening && (
            <div style={styles.listening}>
              🔴 Listening... Speak now
            </div>
          )}

        </div>

        {/* AI Feedback */}

        {feedback && (

          <div style={styles.feedbackCard}>

            <h2>
              🤖 AI Evaluation
            </h2>

            <div style={styles.feedbackScore}>
              {feedback.score}/100
            </div>

            <h3>
              💬 Feedback
            </h3>

            <p>
              {feedback.feedback}
            </p>

            <h3>
              📈 How to Improve
            </h3>

            <p>
              {feedback.improvement}
            </p>

            <button
              onClick={nextQuestion}
              style={styles.nextButton}
            >
              {currentIndex + 1 >=
              interview.questions.length
                ? "🏆 Finish Interview"
                : "➡️ Next Question"}
            </button>

          </div>

        )}

        {/* Tip */}

        <div style={styles.tipBox}>
          💡 Speak clearly and explain your
          answer with examples from your
          projects or experience.
        </div>

      </div>

    </div>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = {

  container: {
    minHeight: "100vh",
    padding: "30px",
    background:
      "linear-gradient(135deg,#f8fafc,#eef2ff)",
  },

  startCard: {
    maxWidth: "900px",
    margin: "40px auto",
    background: "#fff",
    padding: "45px",
    borderRadius: "25px",
    textAlign: "center",
    boxShadow:
      "0 20px 60px rgba(15,23,42,.12)",
  },

  robot: {
    fontSize: "70px",
    marginBottom: "10px",
  },

  subtitle: {
    color: "#64748b",
    fontSize: "18px",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(200px,1fr))",
    gap: "20px",
    marginTop: "35px",
    marginBottom: "35px",
  },

  infoCard: {
    padding: "25px",
    borderRadius: "16px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    fontSize: "15px",
  },

  roleBox: {
    textAlign: "left",
    marginBottom: "25px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px",
    marginTop: "8px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
  },

  startButton: {
    width: "100%",
    padding: "16px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg,#2563eb,#4f46e5)",
    color: "#fff",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer",
  },

  tip: {
    color: "#64748b",
    marginTop: "20px",
  },

  interviewContainer: {
    maxWidth: "1000px",
    margin: "0 auto",
  },

  interviewHeader: {
    background: "#fff",
    padding: "25px",
    borderRadius: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    boxShadow:
      "0 8px 30px rgba(15,23,42,.08)",
  },

  badge: {
    background: "#eef2ff",
    color: "#4338ca",
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "700",
  },

  questionCounter: {
    fontWeight: "700",
    color: "#475569",
  },

  progressBackground: {
    height: "8px",
    background: "#e2e8f0",
    borderRadius: "20px",
    margin: "15px 0 25px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background:
      "linear-gradient(90deg,#2563eb,#7c3aed)",
    borderRadius: "20px",
    transition: "width .3s ease",
  },

  questionCard: {
    background:
      "linear-gradient(135deg,#eef2ff,#f8fafc)",
    padding: "30px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "20px",
  },

  questionIcon: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    background: "#4f46e5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "27px",
  },

  aiLabel: {
    fontSize: "12px",
    fontWeight: "800",
    color: "#4f46e5",
  },

  repeatButton: {
    padding: "10px 15px",
    border: "1px solid #cbd5e1",
    background: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  answerCard: {
    background: "#fff",
    padding: "30px",
    borderRadius: "20px",
    boxShadow:
      "0 8px 30px rgba(15,23,42,.08)",
  },

  answerHint: {
    color: "#64748b",
  },

  textarea: {
    width: "100%",
    minHeight: "180px",
    boxSizing: "border-box",
    padding: "18px",
    borderRadius: "14px",
    border: "2px solid #e2e8f0",
    fontSize: "16px",
    resize: "vertical",
    outline: "none",
  },

  voiceControls: {
    display: "flex",
    gap: "15px",
    marginTop: "20px",
    flexWrap: "wrap",
  },

  micButton: {
    flex: 1,
    padding: "15px",
    border: "none",
    borderRadius: "12px",
    background: "#2563eb",
    color: "#fff",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
  },

  stopButton: {
    flex: 1,
    padding: "15px",
    border: "none",
    borderRadius: "12px",
    background: "#dc2626",
    color: "#fff",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
  },

  submitButton: {
    flex: 1,
    padding: "15px",
    border: "none",
    borderRadius: "12px",
    background: "#16a34a",
    color: "#fff",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
  },

  listening: {
    marginTop: "15px",
    color: "#dc2626",
    fontWeight: "700",
  },

  feedbackCard: {
    marginTop: "20px",
    background: "#fff",
    padding: "30px",
    borderRadius: "20px",
    border: "2px solid #bbf7d0",
    boxShadow:
      "0 8px 30px rgba(15,23,42,.08)",
  },

  feedbackScore: {
    fontSize: "40px",
    fontWeight: "800",
    color: "#16a34a",
    margin: "15px 0",
  },

  nextButton: {
    marginTop: "20px",
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "12px",
    background: "#4f46e5",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
  },

  tipBox: {
    marginTop: "20px",
    background: "#fff7ed",
    color: "#9a3412",
    padding: "15px",
    borderRadius: "12px",
  },

  resultCard: {
    maxWidth: "750px",
    margin: "50px auto",
    background: "#fff",
    padding: "45px",
    borderRadius: "25px",
    textAlign: "center",
    boxShadow:
      "0 20px 60px rgba(15,23,42,.12)",
  },

  successIcon: {
    fontSize: "70px",
  },

  scoreCircle: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg,#2563eb,#7c3aed)",
    color: "#fff",
    margin: "30px auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },

  reviewBox: {
    textAlign: "left",
    padding: "20px",
    background: "#f8fafc",
    borderRadius: "15px",
    marginBottom: "25px",
  },
};