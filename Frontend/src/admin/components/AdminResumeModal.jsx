import React from "react";

import {
  X,
  FileText,
  Calendar,
  Download,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  User,
  Mail,
} from "lucide-react";

const AdminResumeModal = ({ resume, onClose }) => {
  if (!resume) return null;

  // ==========================================
  // SAFE DATA
  // ==========================================

  const strengths = Array.isArray(resume.strengths)
    ? resume.strengths
    : [];

  const weaknesses = Array.isArray(resume.weaknesses)
    ? resume.weaknesses
    : [];

  const suggestions = Array.isArray(resume.suggestions)
    ? resume.suggestions
    : [];

  const missingSkills = Array.isArray(resume.missingSkills)
    ? resume.missingSkills
    : [];

  const atsScore = Number(resume.atsScore) || 0;

  // ==========================================
  // DOWNLOAD / OPEN RESUME
  // ==========================================

  const handleDownload = () => {
    if (!resume.fileUrl) {
      alert("Resume file is not available.");
      return;
    }

    window.open(resume.fileUrl, "_blank", "noopener,noreferrer");
  };

  // ==========================================
  // MODAL
  // ==========================================

  return (
    <div
      className="admin-resume-modal-overlay"
      onClick={onClose}
    >
      <div
        className="admin-resume-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="admin-resume-modal-header">
          <div>
            <span className="admin-resume-eyebrow">
              RESUME ANALYSIS
            </span>

            <h2>
              {resume.fileName || "Resume"}
            </h2>
          </div>

          <button
            type="button"
            className="admin-resume-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* ==========================================
            USER INFORMATION
        ========================================== */}

        <div className="admin-resume-user-info">

          <div className="admin-resume-user-avatar">
            {resume.initials || "U"}
          </div>

          <div className="admin-resume-user-details">
            <strong>
              {resume.user || "Unknown User"}
            </strong>

            <span>
              <Mail size={13} />

              {resume.email || "No email"}
            </span>
          </div>

          <div className="admin-resume-user-meta">

            <span>
              <Calendar size={13} />

              {resume.date || "Unknown date"}
            </span>

            <span>
              <FileText size={13} />

              {resume.fileName || "Resume"}
            </span>

          </div>

        </div>

        {/* ==========================================
            ATS SCORE
        ========================================== */}

        <div className="admin-resume-score-section">

          <div className="admin-resume-score-circle">
            <strong>
              {atsScore}
            </strong>

            <span>/100</span>
          </div>

          <div className="admin-resume-score-content">

            <span className="admin-resume-score-label">
              ATS SCORE
            </span>

            <h3>
              {atsScore >= 70
                ? "Strong Resume"
                : atsScore >= 50
                ? "Needs Improvement"
                : "Needs Major Improvement"}
            </h3>

            <p>
              This score represents the resume's
              compatibility with ATS systems.
            </p>

          </div>

        </div>

        {/* ==========================================
            ANALYSIS
        ========================================== */}

        <div className="admin-resume-analysis-grid">

          {/* ========================================
              STRENGTHS
          ======================================== */}

          <div className="admin-analysis-box">

            <div className="admin-analysis-title success">

              <CheckCircle size={15} />

              <span>
                Strengths
              </span>

            </div>

            {strengths.length > 0 ? (
              <ul>
                {strengths.map(
                  (item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="admin-empty-analysis">
                No strengths available.
              </p>
            )}

          </div>

          {/* ========================================
              WEAKNESSES
          ======================================== */}

          <div className="admin-analysis-box">

            <div className="admin-analysis-title warning">

              <AlertTriangle size={15} />

              <span>
                Weaknesses
              </span>

            </div>

            {weaknesses.length > 0 ? (
              <ul>
                {weaknesses.map(
                  (item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="admin-empty-analysis">
                No weaknesses available.
              </p>
            )}

          </div>

        </div>

        {/* ==========================================
            MISSING SKILLS
        ========================================== */}

        {missingSkills.length > 0 && (
          <div className="admin-resume-missing-skills">

            <div className="admin-analysis-title warning">
              <AlertTriangle size={15} />

              <span>
                Missing Skills
              </span>
            </div>

            <div className="admin-resume-skill-list">

              {missingSkills.map(
                (skill, index) => (
                  <span key={index}>
                    {skill}
                  </span>
                )
              )}

            </div>

          </div>
        )}

        {/* ==========================================
            AI SUGGESTIONS
        ========================================== */}

        <div className="admin-resume-suggestions">

          <div className="admin-analysis-title suggestion">

            <Lightbulb size={15} />

            <span>
              AI Suggestions
            </span>

          </div>

          {suggestions.length > 0 ? (
            <ul>
              {suggestions.map(
                (item, index) => (
                  <li key={index}>
                    {item}
                  </li>
                )
              )}
            </ul>
          ) : (
            <p className="admin-empty-analysis">
              No AI suggestions available.
            </p>
          )}

        </div>

        {/* ==========================================
            FOOTER
        ========================================== */}

        <div className="admin-resume-modal-footer">

          <button
            type="button"
            className="admin-resume-download"
            onClick={handleDownload}
            disabled={!resume.fileUrl}
          >
            <Download size={15} />

            {resume.fileUrl
              ? "Download Resume"
              : "File Unavailable"}
          </button>

          <button
            type="button"
            className="admin-resume-close-button"
            onClick={onClose}
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
};

export default AdminResumeModal;