import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BrainCircuit,
  Search,
  RefreshCw,
  UserRound,
  Mail,
  CalendarDays,
  AlertTriangle,
  X,
  Target,
  TrendingUp,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import {
  getAdminSkillGaps,
} from "../../api/adminApi";

import "../styles/adminSkillGap.css";


const AdminSkillGap = () => {

  const [skillGaps, setSkillGaps] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [selectedSkillGap, setSelectedSkillGap] =
    useState(null);


  // ==========================================
  // LOAD SKILL GAP DATA
  // ==========================================

  const loadSkillGaps = async () => {

    try {

      setLoading(true);

      setError("");

      const response =
        await getAdminSkillGaps();

      console.log(
        "ADMIN SKILL GAP RESPONSE:",
        response.data
      );

      setSkillGaps(
        response.data?.skillGaps || []
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


  useEffect(() => {

    loadSkillGaps();

  }, []);


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredSkillGaps = useMemo(() => {

    const value =
      search.toLowerCase().trim();

    if (!value) {
      return skillGaps;
    }

    return skillGaps.filter((item) => {

      const user =
        item.user?.toLowerCase() || "";

      const username =
        item.username?.toLowerCase() || "";

      const email =
        item.email?.toLowerCase() || "";

      return (
        user.includes(value) ||
        username.includes(value) ||
        email.includes(value)
      );

    });

  }, [skillGaps, search]);


  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (date) => {

    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // ==========================================
  // GET ARRAY SAFELY
  // ==========================================

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

    return [];

  };


  // ==========================================
  // GET SKILLS
  // ==========================================

  const getSkills = (item) => {

    return getArray(
      item.missingSkills ||
      item.skillsToLearn ||
      item.gaps ||
      item.skillGaps ||
      item.missing ||
      []
    );

  };


  // ==========================================
  // GET STRENGTHS
  // ==========================================

  const getStrengths = (item) => {

    return getArray(
      item.strengths ||
      item.currentSkills ||
      item.existingSkills ||
      []
    );

  };


  // ==========================================
  // GET RECOMMENDATIONS
  // ==========================================

  const getRecommendations = (item) => {

    return getArray(
      item.recommendations ||
      item.suggestions ||
      item.learningRecommendations ||
      item.resources ||
      []
    );

  };


  // ==========================================
  // GET SCORE
  // ==========================================

  const getScore = (item) => {

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

    const numberScore =
      Number(score);

    return Number.isNaN(numberScore)
      ? null
      : numberScore;

  };


  // ==========================================
  // SCORE CLASS
  // ==========================================

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


  // ==========================================
  // SUMMARY
  // ==========================================

  const totalMissingSkills =
    skillGaps.reduce(
      (total, item) =>
        total + getSkills(item).length,
      0
    );


  const totalRecommendations =
    skillGaps.reduce(
      (total, item) =>
        total +
        getRecommendations(item).length,
      0
    );


  // ==========================================
  // LOADING
  // ==========================================

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


  // ==========================================
  // ERROR
  // ==========================================

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


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="asg-page">

      {/* =====================================
          HEADER
      ===================================== */}

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


      {/* =====================================
          SUMMARY CARDS
      ===================================== */}

      <div className="asg-summary-grid">


        {/* TOTAL ANALYSES */}

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


        {/* MISSING SKILLS */}

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
              {new Set(
                skillGaps.map(
                  (item) =>
                    item.email ||
                    item.user
                )
              ).size}
            </strong>

          </div>

        </div>

      </div>


      {/* =====================================
          MAIN BOX
      ===================================== */}

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
              placeholder="Search name or email..."
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


        {/* =====================================
            TABLE
        ===================================== */}

        <div className="asg-table-wrapper">

          <table className="asg-table">

            <thead>

              <tr>

                <th>
                  USER
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
                    colSpan="6"
                    className="asg-empty"
                  >

                    <div className="asg-empty-icon">

                      <BrainCircuit
                        size={23}
                      />

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
                  (item) => {

                    const missingSkills =
                      getSkills(item);

                    const strengths =
                      getStrengths(item);

                    const score =
                      getScore(item);

                    return (

                      <tr
                        key={item._id}
                      >

                        {/* USER */}

                        <td>

                          <div className="asg-user">

                            <div className="asg-avatar">

                              {item.initials ||
                                item.user
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                "U"}

                            </div>

                            <div>

                              <strong>
                                {item.user ||
                                  "Unknown User"}
                              </strong>

                              <span>

                                <Mail
                                  size={12}
                                />

                                {item.email ||
                                  "No email"}

                              </span>

                            </div>

                          </div>

                        </td>


                        {/* MISSING SKILLS */}

                        <td>

                          <div className="asg-tags">

                            {missingSkills
                              .slice(0, 3)
                              .map(
                                (skill, index) => (

                                  <span
                                    className="asg-tag missing"
                                    key={index}
                                  >
                                    {typeof skill ===
                                    "object"
                                      ? skill.name ||
                                        skill.skill ||
                                        JSON.stringify(
                                          skill
                                        )
                                      : skill}
                                  </span>

                                )
                              )}

                            {missingSkills.length >
                              3 && (

                              <span className="asg-more">

                                +
                                {missingSkills.length -
                                  3}

                              </span>

                            )}

                            {missingSkills.length ===
                              0 && (

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
                                (skill, index) => (

                                  <span
                                    className="asg-tag current"
                                    key={index}
                                  >
                                    {typeof skill ===
                                    "object"
                                      ? skill.name ||
                                        skill.skill ||
                                        JSON.stringify(
                                          skill
                                        )
                                      : skill}
                                  </span>

                                )
                              )}

                            {strengths.length >
                              3 && (

                              <span className="asg-more">

                                +
                                {strengths.length -
                                  3}

                              </span>

                            )}

                            {strengths.length ===
                              0 && (

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

                            <CalendarDays
                              size={13}
                            />

                            {formatDate(
                              item.createdAt ||
                                item.date
                            )}

                          </div>

                        </td>


                        {/* DETAILS */}

                        <td>

                          <button
                            className="asg-details-btn"
                            onClick={() =>
                              setSelectedSkillGap(
                                item
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


      {/* =====================================
          DETAILS MODAL
      ===================================== */}

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


            {/* MODAL HEADER */}

            <div className="asg-modal-header">

              <div className="asg-modal-avatar">

                {selectedSkillGap.initials ||
                  selectedSkillGap.user
                    ?.charAt(0)
                    ?.toUpperCase() ||
                  "U"}

              </div>

              <div>

                <span>
                  SKILL GAP ANALYSIS
                </span>

                <h2>
                  {selectedSkillGap.user ||
                    "Unknown User"}
                </h2>

                <p>

                  <Mail size={13} />

                  {selectedSkillGap.email ||
                    "No email"}

                </p>

              </div>

            </div>


            {/* DATE */}

            <div className="asg-modal-date">

              <CalendarDays size={14} />

              Analyzed on{" "}

              {formatDate(
                selectedSkillGap.createdAt ||
                  selectedSkillGap.date
              )}

            </div>


            {/* DETAILS */}

            <div className="asg-modal-content">


              {/* SKILLS TO IMPROVE */}

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
                      (skill, index) => (

                        <span
                          key={index}
                          className="asg-detail-tag missing"
                        >

                          {typeof skill ===
                          "object"
                            ? skill.name ||
                              skill.skill ||
                              JSON.stringify(
                                skill
                              )
                            : skill}

                        </span>

                      )
                    )

                  ) : (

                    <span className="asg-none">
                      No skill gap data available.
                    </span>

                  )}

                </div>

              </div>


              {/* CURRENT SKILLS */}

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
                      (skill, index) => (

                        <span
                          key={index}
                          className="asg-detail-tag current"
                        >

                          {typeof skill ===
                          "object"
                            ? skill.name ||
                              skill.skill ||
                              JSON.stringify(
                                skill
                              )
                            : skill}

                        </span>

                      )
                    )

                  ) : (

                    <span className="asg-none">
                      No current skill data available.
                    </span>

                  )}

                </div>

              </div>


              {/* RECOMMENDATIONS */}

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
                      (recommendation, index) => (

                        <li key={index}>

                          <span>
                            {index + 1}
                          </span>

                          <p>

                            {typeof recommendation ===
                            "object"
                              ? recommendation.title ||
                                recommendation.name ||
                                recommendation.description ||
                                JSON.stringify(
                                  recommendation
                                )
                              : recommendation}

                          </p>

                        </li>

                      )
                    )}

                  </ul>

                ) : (

                  <span className="asg-none">
                    No recommendations available.
                  </span>

                )}

              </div>


              {/* RAW ADDITIONAL DATA */}

              {selectedSkillGap.targetRole && (

                <div className="asg-info-row">

                  <strong>
                    Target Role
                  </strong>

                  <span>
                    {selectedSkillGap.targetRole}
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