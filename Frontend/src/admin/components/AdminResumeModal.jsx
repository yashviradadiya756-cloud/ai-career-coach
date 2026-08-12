import React from "react";

import {
  X,
  FileText,
  User,
  Mail,
  Calendar,
  Download,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

const AdminResumeModal = ({ resume, onClose }) => {
  if (!resume) return null;

  return (
    <div
      className="admin-resume-modal-overlay"
      onClick={onClose}
    >
      <div
        className="admin-resume-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-resume-modal-header">
          <div>
            <span className="admin-resume-eyebrow">
              RESUME ANALYSIS
            </span>

            <h2>{resume.fileName}</h2>
          </div>

          <button
            className="admin-resume-close"
            onClick={onClose}
          >
            <X size={17} />
          </button>
        </div>

        <div className="admin-resume-user-info">
          <div className="admin-resume-user-avatar">
            {resume.initials}
          </div>

          <div>
            <strong>{resume.user}</strong>
            <span>{resume.email}</span>
          </div>

          <div className="admin-resume-user-meta">
            <span>
              <Calendar size={13} />
              {resume.date}
            </span>

            <span>
              <FileText size={13} />
              {resume.fileName}
            </span>
          </div>
        </div>

        <div className="admin-resume-score-section">
          <div className="admin-resume-score-circle">
            <strong>{resume.atsScore}</strong>
            <span>/100</span>
          </div>

          <div>
            <span className="admin-resume-score-label">
              ATS SCORE
            </span>

            <h3>
              {resume.atsScore >= 70
                ? "Strong Resume"
                : resume.atsScore >= 50
                ? "Needs Improvement"
                : "Needs Major Improvement"}
            </h3>

            <p>
              This score represents the resume's
              compatibility with ATS systems.
            </p>
          </div>
        </div>

        <div className="admin-resume-analysis-grid">
          <div className="admin-analysis-box">
            <div className="admin-analysis-title success">
              <CheckCircle size={15} />
              <span>Strengths</span>
            </div>

            <ul>
              {resume.strengths.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="admin-analysis-box">
            <div className="admin-analysis-title warning">
              <AlertTriangle size={15} />
              <span>Weaknesses</span>
            </div>

            <ul>
              {resume.weaknesses.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="admin-resume-suggestions">
          <div className="admin-analysis-title suggestion">
            <Lightbulb size={15} />
            <span>AI Suggestions</span>
          </div>

          <ul>
            {resume.suggestions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="admin-resume-modal-footer">
          <button
            className="admin-resume-download"
            onClick={() => {
              if (resume.fileUrl) {
                window.open(resume.fileUrl, "_blank");
              }
            }}
          >
            <Download size={14} />
            Download Resume
          </button>

          <button
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