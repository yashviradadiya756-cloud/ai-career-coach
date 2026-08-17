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
  Target,
  TrendingUp,
  BookOpen,
  ChevronDown,
  BriefcaseBusiness,
} from "lucide-react";

import { getAdminSkillGaps } from "../../api/adminApi";

import "../styles/adminSkillGap.css";


/* =========================================================
   SAFE VALUE HELPERS
========================================================= */

const safeText = (value, fallback = "") => {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "boolean") {
    return String(value);
  }

  if (typeof value === "object") {
    return (
      value.name ||
      value.title ||
      value.role ||
      value.goal ||
      value.username ||
      value.email ||
      value.skill ||
      value.description ||
      fallback
    );
  }

  return fallback;
};


/* =========================================================
   USER NAME
========================================================= */

const getUserName = (item) => {
  if (!item) {
    return "Unknown User";
  }

  if (
    typeof item.user === "object" &&
    item.user !== null
  ) {
    return (
      item.user.name ||
      item.user.username ||
      item.user.email ||
      "Unknown User"
    );
  }

  if (typeof item.user === "string") {
    return item.user;
  }

  return (
    item.name ||
    item.username ||
    item.email ||
    "Unknown User"
  );
};


/* =========================================================
   USER EMAIL
========================================================= */

const getUserEmail = (item) => {
  if (!item) {
    return "No email";
  }

  if (
    typeof item.user === "object" &&
    item.user !== null
  ) {
    return item.user.email || "No email";
  }

  return item.email || "No email";
};


/* =========================================================
   USER ID
========================================================= */

const getUserId = (item) => {
  if (!item) {
    return "";
  }

  if (
    typeof item.user === "object" &&
    item.user !== null
  ) {
    return (
      item.user._id ||
      item.user.email ||
      item.user.username ||
      ""
    );
  }

  return (
    item.user ||
    item.email ||
    item.username ||
    ""
  );
};


/* =========================================================
   USER INITIAL
========================================================= */

const getUserInitial = (item) => {
  const name = getUserName(item);

  if (!name) {
    return "U";
  }

  return name.charAt(0).toUpperCase();
};


/* =========================================================
   CAREER GOAL
========================================================= */

const getCareerGoal = (item) => {
  if (!item) {
    return "Not available";
  }

  /*
    Supports:

    careerGoal: "Full Stack Developer"

    careerGoal: {
      name: "Full Stack Developer"
    }

    careerGoal: {
      title: "Full Stack Developer"
    }

    careerGoal: {
      role: "Full Stack Developer"
    }

    careerGoal: {
      goal: "Full Stack Developer"
    }

    Also checks common alternative field names.
  */

  const possibleValues = [
    item.careerGoal,
    item.career_goal,
    item.goal,
    item.careerObjective,
    item.targetRole,
    item.targetCareer,
    item.desiredRole,
  ];

  for (const value of possibleValues) {
    const text = safeText(value, "");

    if (text && text.trim()) {
      return text;
    }
  }

  return "Not available";
};


/* =========================================================
   ARRAY NORMALIZER
========================================================= */

const getArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (
    typeof value === "object" &&
    value !== null
  ) {
    return [value];
  }

  return [];
};


/* =========================================================
   SKILL DISPLAY
========================================================= */

const getSkillText = (skill) => {
  if (
    skill === null ||
    skill === undefined
  ) {
    return "";
  }

  if (typeof skill === "string") {
    return skill;
  }

  if (typeof skill === "number") {
    return String(skill);
  }

  if (typeof skill === "object") {
    return (
      skill.name ||
      skill.skill ||
      skill.title ||
      skill.description ||
      ""
    );
  }

  return String(skill);
};


/* =========================================================
   RECOMMENDATION DISPLAY
========================================================= */

const getRecommendationText = (recommendation) => {
  if (
    recommendation === null ||
    recommendation === undefined
  ) {
    return "";
  }

  if (typeof recommendation === "string") {
    return recommendation;
  }

  if (typeof recommendation === "number") {
    return String(recommendation);
  }

  if (typeof recommendation === "object") {
    return (
      recommendation.title ||
      recommendation.name ||
      recommendation.description ||
      recommendation.resource ||
      recommendation.url ||
      ""
    );
  }

  return String(recommendation);
};


/* =========================================================
   COMPONENT
========================================================= */

const AdminSkillGap = () => {

  const [skillGaps, setSkillGaps] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [selectedSkillGap, setSelectedSkillGap] =
    useState(null);


  /* =======================================================
     LOAD DATA
  ======================================================= */

  const loadSkillGaps = async () => {
    try {

      setLoading(true);
      setError("");

      const response = await getAdminSkillGaps();

      console.log(
        "ADMIN SKILL GAP RESPONSE:",
        response
      );

      const data = response?.skillGaps;

      setSkillGaps(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Admin skill gap error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load skill gap analyses"
      );

    } finally {

      setLoading(false);

    }
  };


  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadSkillGaps();
  }, []);


  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredSkillGaps = useMemo(() => {

    const value =
      search.toLowerCase().trim();

    if (!value) {
      return skillGaps;
    }

    return skillGaps.filter((item) => {

      const userName =
        getUserName(item)
          .toLowerCase();

      const userEmail =
        getUserEmail(item)
          .toLowerCase();

      const username =
        typeof item.username === "string"
          ? item.username.toLowerCase()
          : "";

      const careerGoal =
        getCareerGoal(item)
          .toLowerCase();

      return (
        userName.includes(value) ||
        userEmail.includes(value) ||
        username.includes(value) ||
        careerGoal.includes(value)
      );

    });

  }, [skillGaps, search]);


  /* =======================================================
     DATE
  ======================================================= */

  const formatDate = (date) => {

    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  /* =======================================================
     SKILLS
  ======================================================= */

  const getSkills = (item) => {

    if (!item) {
      return [];
    }

    return getArray(
      item.missingSkills ||
      item.skillsToLearn ||
      item.gaps ||
      item.skillGaps ||
      item.missing ||
      []
    );
  };


  /* =======================================================
     STRENGTHS
  ======================================================= */

  const getStrengths = (item) => {

    if (!item) {
      return [];
    }

    return getArray(
      item.strengths ||
      item.currentSkills ||
      item.existingSkills ||
      []
    );
  };


  /* =======================================================
     RECOMMENDATIONS
  ======================================================= */

  const getRecommendations = (item) => {

    if (!item) {
      return [];
    }

    return getArray(
      item.recommendations ||
      item.suggestions ||
      item.learningRecommendations ||
      item.resources ||
      []
    );
  };


  /* =======================================================
     SCORE
  ======================================================= */

  const getScore = (item) => {

    if (!item) {
      return null;
    }

    const possibleScores = [
      item.skillGapScore,
      item.score,
      item.overallScore,
      item.readinessScore,
      item.matchScore,
    ];

    const score =
      possibleScores.find(
        (value) =>
          value !== undefined &&
          value !== null &&
          value !== ""
      );

    if (
      score === undefined ||
      score === null
    ) {
      return null;
    }

    const numberScore = Number(score);

    return Number.isNaN(numberScore)
      ? null
      : numberScore;
  };


  /* =======================================================
     SCORE CLASS
  ======================================================= */

  const getScoreClass = (score) => {

    if (score === null) {
      return "unknown";
    }

    if (score >= 75) {
      return "good";
    }

    if (score >= 50) {
      return "medium";
    }

    return "low";
  };


  /* =======================================================
     SUMMARY
  ======================================================= */

  const totalMissingSkills =
    skillGaps.reduce(
      (total, item) =>
        total +
        getSkills(item).length,
      0
    );


  const totalRecommendations =
    skillGaps.reduce(
      (total, item) =>
        total +
        getRecommendations(item).length,
      0
    );


  const totalUsers =
    new Set(
      skillGaps
        .map((item) => getUserId(item))
        .filter(Boolean)
    ).size;


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (
      <div className="asg-page">

        <div className="asg-loading">

          <div className="asg-spinner"></div>

          <span>
            Loading skill gap analyses...
          </span>

        </div>

      </div>
    );
  }


  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {

    return (
      <div className="asg-page">

        <div className="asg-error">

          <div className="asg-error-icon">
            <AlertTriangle size={23} />
          </div>

          <h2>
            Unable to load skill gaps
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={loadSkillGaps}
          >
            <RefreshCw size={15} />
            Try Again
          </button>

        </div>

      </div>
    );
  }


  /* =======================================================
     PAGE
  ======================================================= */

  return (

    <div className="asg-page">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="asg-header">

        <div>

          <span className="asg-eyebrow">
            SKILL GAP MANAGEMENT
          </span>

          <h1>
            Skill Gap Analysis
          </h1>

          <p>
            Monitor AI-generated skill gap
            analyses across CareerPilot users.
          </p>

        </div>

        <button
          className="asg-refresh"
          onClick={loadSkillGaps}
        >

          <RefreshCw size={15} />

          Refresh

        </button>

      </div>


      {/* ===================================================
          SUMMARY
      =================================================== */}

      <div className="asg-summary-grid">

        {/* TOTAL */}

        <div className="asg-summary-card">

          <div className="asg-summary-icon">
            <BrainCircuit size={21} />
          </div>

          <div>

            <span>
              Total Analyses
            </span>

            <strong>
              {skillGaps.length}
            </strong>

          </div>

        </div>


        {/* SKILLS */}

        <div className="asg-summary-card">

          <div className="asg-summary-icon">
            <Target size={21} />
          </div>

          <div>

            <span>
              Skills Identified
            </span>

            <strong>
              {totalMissingSkills}
            </strong>

          </div>

        </div>


        {/* RECOMMENDATIONS */}

        <div className="asg-summary-card">

          <div className="asg-summary-icon">
            <BookOpen size={21} />
          </div>

          <div>

            <span>
              Recommendations
            </span>

            <strong>
              {totalRecommendations}
            </strong>

          </div>

        </div>


        {/* USERS */}

        <div className="asg-summary-card">

          <div className="asg-summary-icon">
            <TrendingUp size={21} />
          </div>

          <div>

            <span>
              User Analyses
            </span>

            <strong>
              {totalUsers}
            </strong>

          </div>

        </div>

      </div>


      {/* ===================================================
          MAIN BOX
      =================================================== */}

      <div className="asg-box">

        {/* TOOLBAR */}

        <div className="asg-toolbar">

          <div>

            <h2>
              All Skill Gap Analyses
            </h2>

            <span>

              {filteredSkillGaps.length}{" "}

              analysis

              {filteredSkillGaps.length !== 1
                ? "es"
                : ""}

            </span>

          </div>


          <div className="asg-search">

            <Search size={16} />

            <input
              type="text"
              placeholder="Search name, email or career goal..."
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

        <div className="asg-table-wrapper">

          <table className="asg-table">

            <thead>

              <tr>

                <th>
                  USER
                </th>

                <th>
                  CAREER GOAL
                </th>

                <th>
                  SKILLS TO IMPROVE
                </th>

                <th>
                  CURRENT SKILLS
                </th>

                <th>
                  SCORE
                </th>

                <th>
                  ANALYZED
                </th>

                <th>
                  DETAILS
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredSkillGaps.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="asg-empty"
                  >

                    <div className="asg-empty-icon">
                      <BrainCircuit size={23} />
                    </div>

                    <strong>
                      No skill gap analyses found
                    </strong>

                    <span>
                      Try another search term.
                    </span>

                  </td>

                </tr>

              ) : (

                filteredSkillGaps.map(
                  (item, index) => {

                    const missingSkills =
                      getSkills(item);

                    const strengths =
                      getStrengths(item);

                    const score =
                      getScore(item);

                    const userName =
                      getUserName(item);

                    const userEmail =
                      getUserEmail(item);

                    const careerGoal =
                      getCareerGoal(item);

                    return (

                      <tr
                        key={
                          item._id ||
                          `${getUserId(item)}-${index}`
                        }
                      >

                        {/* USER */}

                        <td>

                          <div className="asg-user">

                            <div className="asg-avatar">

                              {getUserInitial(item)}

                            </div>

                            <div>

                              <strong>
                                {userName}
                              </strong>

                              <span>

                                <Mail size={12} />

                                {userEmail}

                              </span>

                            </div>

                          </div>

                        </td>


                        {/* CAREER GOAL */}

                        <td>

                          <div
                            className="asg-career-goal"
                            title={careerGoal}
                          >

                            <BriefcaseBusiness
                              size={14}
                            />

                            <span>
                              {careerGoal}
                            </span>

                          </div>

                        </td>


                        {/* MISSING SKILLS */}

                        <td>

                          <div className="asg-tags">

                            {missingSkills
                              .slice(0, 3)
                              .map(
                                (skill, skillIndex) => {

                                  const text =
                                    getSkillText(skill);

                                  return (

                                    <span
                                      className="asg-tag missing"
                                      key={skillIndex}
                                    >

                                      {text ||
                                        "Unknown skill"}

                                    </span>

                                  );
                                }
                              )}

                            {missingSkills.length > 3 && (

                              <span className="asg-more">

                                +
                                {missingSkills.length - 3}

                              </span>

                            )}

                            {missingSkills.length === 0 && (

                              <span className="asg-none">
                                No skills listed
                              </span>

                            )}

                          </div>

                        </td>


                        {/* CURRENT SKILLS */}

                        <td>

                          <div className="asg-tags">

                            {strengths
                              .slice(0, 3)
                              .map(
                                (skill, skillIndex) => {

                                  const text =
                                    getSkillText(skill);

                                  return (

                                    <span
                                      className="asg-tag current"
                                      key={skillIndex}
                                    >

                                      {text ||
                                        "Unknown skill"}

                                    </span>

                                  );
                                }
                              )}

                            {strengths.length > 3 && (

                              <span className="asg-more">

                                +
                                {strengths.length - 3}

                              </span>

                            )}

                            {strengths.length === 0 && (

                              <span className="asg-none">
                                Not available
                              </span>

                            )}

                          </div>

                        </td>


                        {/* SCORE */}

                        <td>

                          {score !== null ? (

                            <span
                              className={`asg-score ${getScoreClass(
                                score
                              )}`}
                            >

                              {score}%

                            </span>

                          ) : (

                            <span className="asg-score unknown">
                              —
                            </span>

                          )}

                        </td>


                        {/* DATE */}

                        <td>

                          <div className="asg-date">

                            <CalendarDays size={13} />

                            {formatDate(
                              item.createdAt ||
                              item.date ||
                              item.updatedAt
                            )}

                          </div>

                        </td>


                        {/* DETAILS */}

                        <td>

                          <button
                            className="asg-details-btn"
                            onClick={() =>
                              setSelectedSkillGap(item)
                            }
                          >

                            View

                            <ChevronDown size={14} />

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


      {/* ===================================================
          MODAL
      =================================================== */}

      {selectedSkillGap && (

        <div className="asg-modal-overlay">

          <div className="asg-modal">

            {/* CLOSE */}

            <button
              className="asg-modal-close"
              onClick={() =>
                setSelectedSkillGap(null)
              }
            >

              <X size={17} />

            </button>


            {/* HEADER */}

            <div className="asg-modal-header">

              <div className="asg-modal-avatar">

                {getUserInitial(
                  selectedSkillGap
                )}

              </div>


              <div>

                <span>
                  SKILL GAP ANALYSIS
                </span>

                <h2>
                  {getUserName(
                    selectedSkillGap
                  )}
                </h2>

                <p>

                  <Mail size={13} />

                  {getUserEmail(
                    selectedSkillGap
                  )}

                </p>

              </div>

            </div>


            {/* DATE */}

            <div className="asg-modal-date">

              <CalendarDays size={14} />

              Analyzed on{" "}

              {formatDate(
                selectedSkillGap.createdAt ||
                selectedSkillGap.date ||
                selectedSkillGap.updatedAt
              )}

            </div>


            {/* CONTENT */}

            <div className="asg-modal-content">


              {/* =================================================
                  CAREER GOAL
              ================================================= */}

              <div className="asg-detail-section">

                <div className="asg-detail-title">

                  <BriefcaseBusiness size={17} />

                  <h3>
                    Career Goal
                  </h3>

                </div>

                <div className="asg-career-goal-modal">

                  <span>

                    {getCareerGoal(
                      selectedSkillGap
                    )}

                  </span>

                </div>

              </div>


              {/* =================================================
                  SKILLS TO IMPROVE
              ================================================= */}

              <div className="asg-detail-section">

                <div className="asg-detail-title">

                  <Target size={17} />

                  <h3>
                    Skills to Improve
                  </h3>

                </div>


                <div className="asg-detail-list">

                  {getSkills(
                    selectedSkillGap
                  ).length > 0 ? (

                    getSkills(
                      selectedSkillGap
                    ).map(
                      (skill, index) => {

                        const text =
                          getSkillText(skill);

                        return (

                          <span
                            key={index}
                            className="asg-detail-tag missing"
                          >

                            {text ||
                              "Unknown skill"}

                          </span>

                        );
                      }
                    )

                  ) : (

                    <span className="asg-none">

                      No skill gap data available.

                    </span>

                  )}

                </div>

              </div>


              {/* =================================================
                  CURRENT SKILLS
              ================================================= */}

              <div className="asg-detail-section">

                <div className="asg-detail-title">

                  <TrendingUp size={17} />

                  <h3>
                    Current Skills
                  </h3>

                </div>


                <div className="asg-detail-list">

                  {getStrengths(
                    selectedSkillGap
                  ).length > 0 ? (

                    getStrengths(
                      selectedSkillGap
                    ).map(
                      (skill, index) => {

                        const text =
                          getSkillText(skill);

                        return (

                          <span
                            key={index}
                            className="asg-detail-tag current"
                          >

                            {text ||
                              "Unknown skill"}

                          </span>

                        );
                      }
                    )

                  ) : (

                    <span className="asg-none">

                      No current skill data available.

                    </span>

                  )}

                </div>

              </div>


              {/* =================================================
                  RECOMMENDATIONS
              ================================================= */}

              <div className="asg-detail-section">

                <div className="asg-detail-title">

                  <BookOpen size={17} />

                  <h3>
                    Recommendations
                  </h3>

                </div>


                {getRecommendations(
                  selectedSkillGap
                ).length > 0 ? (

                  <ul className="asg-recommendations">

                    {getRecommendations(
                      selectedSkillGap
                    ).map(
                      (recommendation, index) => {

                        const text =
                          getRecommendationText(
                            recommendation
                          );

                        return (

                          <li key={index}>

                            <span>
                              {index + 1}
                            </span>

                            <p>

                              {text ||
                                "Recommendation unavailable"}

                            </p>

                          </li>

                        );
                      }
                    )}

                  </ul>

                ) : (

                  <span className="asg-none">

                    No recommendations available.

                  </span>

                )}

              </div>


              {/* =================================================
                  TARGET ROLE
              ================================================= */}

              {selectedSkillGap.targetRole && (

                <div className="asg-info-row">

                  <strong>
                    Target Role
                  </strong>

                  <span>

                    {safeText(
                      selectedSkillGap.targetRole,
                      "Not available"
                    )}

                  </span>

                </div>

              )}

            </div>


            {/* FOOTER */}

            <div className="asg-modal-footer">

              <button
                onClick={() =>
                  setSelectedSkillGap(null)
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


export default AdminSkillGap;