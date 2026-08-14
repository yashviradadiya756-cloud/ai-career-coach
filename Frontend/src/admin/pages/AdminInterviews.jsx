import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BrainCircuit,
  Search,
  RefreshCw,
  Mail,
  CalendarDays,
  AlertTriangle,
  X,
  UserRound,
  Target,
  Award,
  ChevronDown,
  MessageSquare,
} from "lucide-react";

import {
  getAdminInterviews,
} from "../../api/adminApi";

import "../styles/adminMockInterviews.css";


// =========================================================
// SAFE TEXT
// =========================================================

const safeText = (value, fallback = "") => {
  if (
    value === null ||
    value === undefined
  ) {
    return fallback;
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (
    typeof value === "object"
  ) {
    return (
      value.name ||
      value.title ||
      value.username ||
      value.email ||
      value.question ||
      value.description ||
      fallback
    );
  }

  return fallback;
};


// =========================================================
// USER NAME
// =========================================================

const getUserName = (interview) => {
  if (!interview) {
    return "Unknown User";
  }

  if (
    interview.user &&
    typeof interview.user === "object"
  ) {
    return (
      interview.user.name ||
      interview.user.username ||
      interview.user.email ||
      "Unknown User"
    );
  }

  if (
    typeof interview.user === "string"
  ) {
    return interview.user;
  }

  return "Unknown User";
};


// =========================================================
// USER EMAIL
// =========================================================

const getUserEmail = (interview) => {
  if (!interview) {
    return "No email";
  }

  if (
    interview.user &&
    typeof interview.user === "object"
  ) {
    return (
      interview.user.email ||
      "No email"
    );
  }

  return interview.email || "No email";
};


// =========================================================
// DATE
// =========================================================

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  const parsed = new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return "—";
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


// =========================================================
// SCORE
// =========================================================

const getScoreClass = (score) => {
  const value = Number(score || 0);

  if (value >= 75) {
    return "good";
  }

  if (value >= 50) {
    return "medium";
  }

  return "low";
};


// =========================================================
// COMPONENT
// =========================================================

const AdminMockInterviews = () => {

  const [
    interviews,
    setInterviews,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedInterview,
    setSelectedInterview,
  ] = useState(null);


  // =======================================================
  // LOAD INTERVIEWS
  // =======================================================

  const loadInterviews = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await getAdminInterviews();

      console.log(
        "ADMIN INTERVIEW RESPONSE:",
        response.data
      );

      const data =
        response.data?.interviews;

      setInterviews(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Admin interview error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to load interviews"
      );

    } finally {

      setLoading(false);

    }
  };


  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {
    loadInterviews();
  }, []);


  // =======================================================
  // SEARCH
  // =======================================================

  const filteredInterviews =
    useMemo(() => {

      const value =
        search
          .toLowerCase()
          .trim();

      if (!value) {
        return interviews;
      }

      return interviews.filter(
        (interview) => {

          const userName =
            getUserName(interview)
              .toLowerCase();

          const email =
            getUserEmail(interview)
              .toLowerCase();

          const role =
            safeText(
              interview.targetRole
            ).toLowerCase();

          return (
            userName.includes(value) ||
            email.includes(value) ||
            role.includes(value)
          );
        }
      );

    }, [
      interviews,
      search,
    ]);


  // =======================================================
  // SUMMARY
  // =======================================================

  const totalQuestions =
    interviews.reduce(
      (total, interview) =>
        total +
        (
          Array.isArray(
            interview.questions
          )
            ? interview.questions.length
            : 0
        ),
      0
    );


  const completedInterviews =
    interviews.filter(
      (interview) =>
        Number(
          interview.totalScore || 0
        ) > 0
    ).length;


  const averageScore =
    interviews.length > 0
      ? Math.round(
          interviews.reduce(
            (total, interview) =>
              total +
              Number(
                interview.totalScore || 0
              ),
            0
          ) /
            interviews.length
        )
      : 0;


  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {

    return (
      <div className="ami-page">

        <div className="ami-loading">

          <div className="ami-spinner" />

          <span>
            Loading interviews...
          </span>

        </div>

      </div>
    );
  }


  // =======================================================
  // ERROR
  // =======================================================

  if (error) {

    return (
      <div className="ami-page">

        <div className="ami-error">

          <div className="ami-error-icon">
            <AlertTriangle size={23} />
          </div>

          <h2>
            Unable to load interviews
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={loadInterviews}
          >
            <RefreshCw size={15} />
            Try Again
          </button>

        </div>

      </div>
    );
  }


  // =======================================================
  // PAGE
  // =======================================================

  return (

    <div className="ami-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="ami-header">

        <div>

          <span className="ami-eyebrow">
            INTERVIEW MANAGEMENT
          </span>

          <h1>
            Mock Interviews
          </h1>

          <p>
            Monitor AI-generated mock
            interviews across CareerPilot users.
          </p>

        </div>


        <button
          className="ami-refresh"
          onClick={loadInterviews}
        >

          <RefreshCw size={15} />

          Refresh

        </button>

      </div>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="ami-summary-grid">

        <div className="ami-summary-card">

          <div className="ami-summary-icon">
            <BrainCircuit size={21} />
          </div>

          <div>

            <span>
              Total Interviews
            </span>

            <strong>
              {interviews.length}
            </strong>

          </div>

        </div>


        <div className="ami-summary-card">

          <div className="ami-summary-icon">
            <MessageSquare size={21} />
          </div>

          <div>

            <span>
              Questions
            </span>

            <strong>
              {totalQuestions}
            </strong>

          </div>

        </div>


        <div className="ami-summary-card">

          <div className="ami-summary-icon">
            <Award size={21} />
          </div>

          <div>

            <span>
              Completed
            </span>

            <strong>
              {completedInterviews}
            </strong>

          </div>

        </div>


        <div className="ami-summary-card">

          <div className="ami-summary-icon">
            <Target size={21} />
          </div>

          <div>

            <span>
              Average Score
            </span>

            <strong>
              {averageScore}%
            </strong>

          </div>

        </div>

      </div>


      {/* =================================================
          MAIN BOX
      ================================================= */}

      <div className="ami-box">

        <div className="ami-toolbar">

          <div>

            <h2>
              All Mock Interviews
            </h2>

            <span>
              {filteredInterviews.length}{" "}
              interview
              {filteredInterviews.length !== 1
                ? "s"
                : ""}
            </span>

          </div>


          <div className="ami-search">

            <Search size={16} />

            <input
              type="text"
              placeholder="Search user or target role..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (

              <button
                onClick={() =>
                  setSearch("")
                }
              >

                <X size={14} />

              </button>

            )}

          </div>

        </div>


        {/* =================================================
            TABLE
        ================================================= */}

        <div className="ami-table-wrapper">

          <table className="ami-table">

            <thead>

              <tr>

                <th>
                  USER
                </th>

                <th>
                  TARGET ROLE
                </th>

                <th>
                  QUESTIONS
                </th>

                <th>
                  SCORE
                </th>

                <th>
                  CREATED
                </th>

                <th>
                  DETAILS
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredInterviews.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="ami-empty"
                  >

                    <div className="ami-empty-icon">
                      <BrainCircuit size={23} />
                    </div>

                    <strong>
                      No interviews found
                    </strong>

                    <span>
                      Try another search term.
                    </span>

                  </td>

                </tr>

              ) : (

                filteredInterviews.map(
                  (interview, index) => {

                    const questions =
                      Array.isArray(
                        interview.questions
                      )
                        ? interview.questions
                        : [];

                    const score =
                      Number(
                        interview.totalScore || 0
                      );

                    return (

                      <tr
                        key={
                          interview._id ||
                          index
                        }
                      >

                        {/* USER */}

                        <td>

                          <div className="ami-user">

                            <div className="ami-avatar">

                              {getUserName(
                                interview
                              )
                                .charAt(0)
                                .toUpperCase()}

                            </div>

                            <div>

                              <strong>
                                {getUserName(
                                  interview
                                )}
                              </strong>

                              <span>

                                <Mail size={12} />

                                {getUserEmail(
                                  interview
                                )}

                              </span>

                            </div>

                          </div>

                        </td>


                        {/* ROLE */}

                        <td>

                          <div className="ami-role">

                            <Target size={14} />

                            {safeText(
                              interview.targetRole,
                              "Not available"
                            )}

                          </div>

                        </td>


                        {/* QUESTIONS */}

                        <td>

                          <span className="ami-question-count">

                            {questions.length}

                          </span>

                        </td>


                        {/* SCORE */}

                        <td>

                          <span
                            className={`ami-score ${getScoreClass(
                              score
                            )}`}
                          >

                            {score}%

                          </span>

                        </td>


                        {/* DATE */}

                        <td>

                          <div className="ami-date">

                            <CalendarDays size={13} />

                            {formatDate(
                              interview.createdAt
                            )}

                          </div>

                        </td>


                        {/* DETAILS */}

                        <td>

                          <button
                            className="ami-details-btn"
                            onClick={() =>
                              setSelectedInterview(
                                interview
                              )
                            }
                          >

                            View

                            <ChevronDown
                              size={14}
                            />

                          </button>

                        </td>

                      </tr>

                    );
                  }
                )

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =================================================
          MODAL
      ================================================= */}

      {selectedInterview && (

        <div className="ami-modal-overlay">

          <div className="ami-modal">

            <button
              className="ami-modal-close"
              onClick={() =>
                setSelectedInterview(null)
              }
            >
              <X size={17} />
            </button>


            {/* HEADER */}

            <div className="ami-modal-header">

              <div className="ami-modal-avatar">

                {getUserName(
                  selectedInterview
                )
                  .charAt(0)
                  .toUpperCase()}

              </div>

              <div>

                <span>
                  MOCK INTERVIEW
                </span>

                <h2>
                  {getUserName(
                    selectedInterview
                  )}
                </h2>

                <p>

                  <Mail size={13} />

                  {getUserEmail(
                    selectedInterview
                  )}

                </p>

              </div>

            </div>


            {/* ROLE + DATE */}

            <div className="ami-modal-meta">

              <div>

                <Target size={14} />

                <strong>
                  Target Role:
                </strong>

                <span>
                  {safeText(
                    selectedInterview.targetRole,
                    "Not available"
                  )}
                </span>

              </div>


              <div>

                <CalendarDays size={14} />

                <strong>
                  Created:
                </strong>

                <span>
                  {formatDate(
                    selectedInterview.createdAt
                  )}
                </span>

              </div>

            </div>


            {/* SCORE */}

            <div className="ami-modal-score">

              <span>
                Total Score
              </span>

              <strong>
                {Number(
                  selectedInterview.totalScore || 0
                )}
                %
              </strong>

            </div>


            {/* QUESTIONS */}

            <div className="ami-questions">

              <h3>
                Interview Questions
              </h3>

              {(
                Array.isArray(
                  selectedInterview.questions
                )
                  ? selectedInterview.questions
                  : []
              ).map(
                (question, index) => (

                  <div
                    className="ami-question"
                    key={index}
                  >

                    <div className="ami-question-number">
                      {index + 1}
                    </div>

                    <div className="ami-question-body">

                      <strong>
                        {safeText(
                          question.question,
                          "Question unavailable"
                        )}
                      </strong>


                      {safeText(
                        question.answer
                      ) && (

                        <div className="ami-answer">

                          <span>
                            Answer
                          </span>

                          <p>
                            {safeText(
                              question.answer
                            )}
                          </p>

                        </div>

                      )}


                      {safeText(
                        question.feedback
                      ) && (

                        <div className="ami-feedback">

                          <span>
                            AI Feedback
                          </span>

                          <p>
                            {safeText(
                              question.feedback
                            )}
                          </p>

                        </div>

                      )}


                      {question.score !== undefined && (

                        <div className="ami-question-score">

                          Score:{" "}

                          <strong>
                            {Number(
                              question.score || 0
                            )}
                            /10
                          </strong>

                        </div>

                      )}

                    </div>

                  </div>

                )
              )}

            </div>


            {/* IMPROVEMENT */}

            {safeText(
              selectedInterview.improvement
            ) && (

              <div className="ami-improvement">

                <h3>
                  Overall Improvement
                </h3>

                <p>
                  {safeText(
                    selectedInterview.improvement
                  )}
                </p>

              </div>

            )}


            <div className="ami-modal-footer">

              <button
                onClick={() =>
                  setSelectedInterview(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminMockInterviews;