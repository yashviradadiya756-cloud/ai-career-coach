import React, {
  useEffect,
  useState,
} from "react";

import {
  FileText,
  RefreshCw,
} from "lucide-react";

import {
  getAdminResumes,
} from "../../api/adminApi";

import AdminResumeModal from "../components/AdminResumeModal";


const AdminResumeManagement = () => {
  const [resumes, setResumes] =
    useState([]);

  const [selectedResume, setSelectedResume] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // LOAD RESUMES
  // ==========================================

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAdminResumes();

      console.log(
        "ADMIN RESUMES RESPONSE:",
        response.data
      );

      if (response.data.success) {
        setResumes(
          response.data.resumes || []
        );
      } else {
        setError(
          response.data.message ||
            "Failed to load resumes"
        );
      }

    } catch (error) {
      console.error(
        "Admin resumes error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load resumes"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-resume-page-loading">
        <div className="admin-resume-spinner" />

        <p>
          Loading resumes...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="admin-resume-page-error">
        <h2>
          Failed to load resumes
        </h2>

        <p>{error}</p>

        <button
          onClick={loadResumes}
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="admin-resume-management">

      {/* HEADER */}

      <div className="admin-resume-page-header">

        <div>
          <span>
            RESUME MANAGEMENT
          </span>

          <h1>
            Resume Analysis
          </h1>

          <p>
            View resumes uploaded by
            CareerPilot users.
          </p>
        </div>

        <button
          className="admin-resume-refresh"
          onClick={loadResumes}
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>

      {/* COUNT */}

      <div className="admin-resume-count">
        <FileText size={18} />

        <span>
          {resumes.length} Resume
          {resumes.length !== 1
            ? "s"
            : ""}
        </span>
      </div>

      {/* EMPTY */}

      {resumes.length === 0 ? (
        <div className="admin-resume-empty">

          <FileText size={40} />

          <h3>
            No resumes found
          </h3>

          <p>
            When users upload resumes,
            they will appear here.
          </p>

        </div>
      ) : (

        /* RESUME LIST */

        <div className="admin-resume-list">

          {resumes.map((resume) => (

            <div
              className="admin-resume-card"
              key={resume._id}
              onClick={() =>
                setSelectedResume(
                  resume
                )
              }
            >

              <div className="admin-resume-card-icon">
                <FileText size={22} />
              </div>

              <div className="admin-resume-card-content">

                <h3>
                  {resume.fileName ||
                    "Resume"}
                </h3>

                <p>
                  {resume.user ||
                    "Unknown User"}
                </p>

                <span>
                  {resume.email ||
                    "No email"}
                </span>

              </div>

              <div className="admin-resume-card-score">

                <strong>
                  {resume.atsScore || 0}
                </strong>

                <span>
                  ATS
                </span>

              </div>

            </div>

          ))}

        </div>
      )}

      {/* EXISTING MODAL */}

      <AdminResumeModal
        resume={selectedResume}
        onClose={() =>
          setSelectedResume(null)
        }
      />

    </div>
  );
};

export default AdminResumeManagement;