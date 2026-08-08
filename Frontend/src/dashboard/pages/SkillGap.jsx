import React, { useEffect, useState } from "react";

import {
  analyzeSkillGap,
  getLatestSkillGap,
} from "../../api/skillGapApi";

const SkillGap = () => {
  const [skillGap, setSkillGap] = useState(null);

  const [targetRole, setTargetRole] = useState("");

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // LOAD LATEST SKILL GAP
  // ==========================================

  useEffect(() => {
    loadSkillGap();
  }, []);

  const loadSkillGap = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getLatestSkillGap();

      console.log(
        "Skill Gap response:",
        response
      );

      if (
        response?.success &&
        response?.skillGap
      ) {
        setSkillGap(response.skillGap);

        setTargetRole(
          response.skillGap.targetRole || ""
        );
      } else {
        setSkillGap(null);
      }
    } catch (error) {
      console.error(
        "Skill Gap API Error:",
        error.response?.data ||
          error.message
      );

      // 404 simply means no Skill Gap yet.
      if (
        error.response?.status === 404
      ) {
        setSkillGap(null);
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to load Skill Gap Analysis."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ANALYZE SKILL GAP
  // ==========================================

  const handleAnalyze = async () => {
    try {
      if (!targetRole.trim()) {
        setError(
          "Please enter a target career role."
        );
        return;
      }

      setAnalyzing(true);
      setError("");

      console.log(
        "Analyzing Skill Gap for:",
        targetRole
      );

      const response =
        await analyzeSkillGap(
          targetRole.trim()
        );

      console.log(
        "Skill Gap Analyze Result:",
        response
      );

      if (
        response?.success &&
        response?.skillGap
      ) {
        setSkillGap(
          response.skillGap
        );
      } else {
        setError(
          response?.message ||
            "Skill Gap Analysis failed."
        );
      }
    } catch (error) {
      console.error(
        "Skill Gap Analyze Error:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to analyze Skill Gap."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="skill-gap-page">
        <h2>Loading Skill Gap Analysis...</h2>
      </div>
    );
  }

  // ==========================================
  // DATA
  // ==========================================

  const currentSkills =
    skillGap?.currentSkills || [];

  const missingSkills =
    skillGap?.missingSkills || [];

  const recommendedCourses =
    skillGap?.recommendedCourses || [];

  const roadmap =
    skillGap?.roadmap || [];

  const readinessScore =
    Number(skillGap?.readinessScore) || 0;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="skill-gap-page">

      {/* ================================== */}
      {/* HEADER */}
      {/* ================================== */}

      <div className="skill-gap-header">

        <h1>🎯 Skill Gap Analysis</h1>

        <p>
          Identify the skills you already have
          and discover what you need to learn
          for your target career.
        </p>

      </div>

      {/* ================================== */}
      {/* ERROR */}
      {/* ================================== */}

      {error && (
        <div className="skill-gap-error">
          ⚠️ {error}
        </div>
      )}

      {/* ================================== */}
      {/* TARGET ROLE */}
      {/* ================================== */}

      <div className="skill-gap-input-card">

        <h2>Target Career Role</h2>

        <div className="skill-gap-input-row">

          <input
            type="text"
            value={targetRole}
            onChange={(e) =>
              setTargetRole(e.target.value)
            }
            placeholder="Example: Full Stack Developer"
          />

          <button
            onClick={handleAnalyze}
            disabled={analyzing}
          >
            {analyzing
              ? "Analyzing..."
              : "Analyze Skill Gap"}
          </button>

        </div>

      </div>

      {/* ================================== */}
      {/* NO DATA */}
      {/* ================================== */}

      {!skillGap ? (
        <div className="skill-gap-empty">

          <h2>
            No Skill Gap Analysis Found
          </h2>

          <p>
            Enter your target role and click
            "Analyze Skill Gap".
          </p>

        </div>
      ) : (
        <>
          {/* ================================== */}
          {/* TARGET ROLE + SCORE */}
          {/* ================================== */}

          <div className="skill-gap-overview">

            <div className="skill-gap-role-card">

              <h3>Target Role</h3>

              <h2>
                {skillGap.targetRole}
              </h2>

            </div>

            <div className="skill-gap-score-card">

              <h3>Readiness Score</h3>

              <h1>
                {readinessScore}%
              </h1>

            </div>

          </div>

          {/* ================================== */}
          {/* CURRENT SKILLS */}
          {/* ================================== */}

          <div className="skill-section">

            <div className="skill-section-header">

              <h2>
                ✅ Current Skills
              </h2>

              <span>
                {currentSkills.length}
              </span>

            </div>

            {currentSkills.length === 0 ? (
              <p>
                No current skills found.
              </p>
            ) : (
              <div className="skill-list">

                {currentSkills.map(
                  (skill, index) => (
                    <span
                      className="skill-tag current"
                      key={index}
                    >
                      {skill}
                    </span>
                  )
                )}

              </div>
            )}

          </div>

          {/* ================================== */}
          {/* MISSING SKILLS */}
          {/* ================================== */}

          <div className="skill-section">

            <div className="skill-section-header">

              <h2>
                ⚠️ Missing Skills
              </h2>

              <span>
                {missingSkills.length}
              </span>

            </div>

            {missingSkills.length === 0 ? (
              <p>
                🎉 No major skill gaps found!
              </p>
            ) : (
              <div className="skill-list">

                {missingSkills.map(
                  (skill, index) => (
                    <span
                      className="skill-tag missing"
                      key={index}
                    >
                      {skill}
                    </span>
                  )
                )}

              </div>
            )}

          </div>

          {/* ================================== */}
          {/* RECOMMENDED COURSES */}
          {/* ================================== */}

          <div className="skill-section">

            <h2>
              📚 Recommended Courses
            </h2>

            {recommendedCourses.length === 0 ? (
              <p>
                No recommended courses found.
              </p>
            ) : (
              <div className="course-list">

                {recommendedCourses.map(
                  (course, index) => (
                    <div
                      className="course-item"
                      key={index}
                    >
                      <span>
                        {index + 1}
                      </span>

                      <p>
                        {course}
                      </p>
                    </div>
                  )
                )}

              </div>
            )}

          </div>

          {/* ================================== */}
          {/* ROADMAP */}
          {/* ================================== */}

          <div className="skill-section">

            <h2>
              🗺️ Recommended Roadmap
            </h2>

            {roadmap.length === 0 ? (
              <p>
                No roadmap available.
              </p>
            ) : (
              <div className="roadmap-list">

                {roadmap.map(
                  (step, index) => (
                    <div
                      className="roadmap-item"
                      key={index}
                    >

                      <div className="roadmap-number">
                        {index + 1}
                      </div>

                      <div className="roadmap-content">
                        <p>{step}</p>
                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

        </>
      )}

    </div>
  );
};

export default SkillGap;