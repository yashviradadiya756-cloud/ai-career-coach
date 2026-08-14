import React, { useEffect, useMemo, useState } from "react";

import {
  FileText,
  Upload,
  TrendingUp,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

import {
  getAdminResumes,
} from "../../api/adminApi";

import AdminResumeModal from "../components/AdminResumeModal";

import "../styles/adminResumes.css";

const AdminResumes = () => {
  const [resumes, setResumes] = useState([]);

  const [search, setSearch] = useState("");

  const [scoreFilter, setScoreFilter] =
    useState("All");

  const [dateFilter, setDateFilter] =
    useState("All");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [selectedResume, setSelectedResume] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const resumesPerPage = 6;

  /* =====================================================
     LOAD RESUMES FROM BACKEND
  ===================================================== */

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminResumes();

      console.log(
        "ADMIN RESUMES RESPONSE:",
        response.data
      );

      if (
        response.data &&
        response.data.success
      ) {
        const backendResumes =
          response.data.resumes || [];

        /*
          Normalize backend data.

          This keeps your existing UI unchanged
          even if backend returns user as an object.
        */

        const formattedResumes =
          backendResumes.map(
            (resume, index) => {
              const user =
                resume.user &&
                typeof resume.user === "object"
                  ? resume.user
                  : null;

              const userName =
                user?.username ||
                user?.name ||
                resume.userName ||
                resume.name ||
                (typeof resume.user === "string"
                  ? resume.user
                  : "Unknown User");

              const userEmail =
                user?.email ||
                resume.email ||
                "No email";

              const initials =
                userName
                  .split(" ")
                  .filter(Boolean)
                  .map(
                    (part) =>
                      part.charAt(0)
                  )
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "U";

              const score =
                Number(resume.atsScore) || 0;

              const uploadedDate =
                resume.createdAt ||
                resume.updatedAt ||
                resume.uploadedAt ||
                resume.date;

              let formattedDate =
                "Unknown date";

              if (uploadedDate) {
                const date =
                  new Date(uploadedDate);

                if (
                  !Number.isNaN(
                    date.getTime()
                  )
                ) {
                  formattedDate =
                    date.toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      }
                    );
                }
              }

              /*
                Backend file path handling.

                If backend already sends fileUrl,
                use it.

                Otherwise use filePath.
              */

              let fileUrl =
                resume.fileUrl || "";

              if (
                !fileUrl &&
                resume.filePath
              ) {
                const backendBaseUrl =
                  import.meta.env
                    .VITE_API_URL ||
                  "http://localhost:5000";

                let cleanPath =
                  String(
                    resume.filePath
                  )
                    .replace(/\\/g, "/")
                    .replace(/^\/+/, "");

                if (
                  cleanPath.startsWith(
                    "uploads/"
                  )
                ) {
                  fileUrl =
                    `${backendBaseUrl}/${cleanPath}`;
                } else {
                  fileUrl =
                    `${backendBaseUrl}/uploads/${cleanPath}`;
                }
              }

              return {
                ...resume,

                id:
                  resume._id ||
                  resume.id ||
                  index,

                user: userName,

                email: userEmail,

                initials,

                fileName:
                  resume.fileName ||
                  "Resume",

                atsScore: score,

                date: formattedDate,

                status:
                  resume.status ||
                  "Analyzed",

                fileUrl,

                strengths:
                  Array.isArray(
                    resume.strengths
                  )
                    ? resume.strengths
                    : [],

                weaknesses:
                  Array.isArray(
                    resume.weaknesses
                  )
                    ? resume.weaknesses
                    : [],

                missingSkills:
                  Array.isArray(
                    resume.missingSkills
                  )
                    ? resume.missingSkills
                    : [],

                suggestions:
                  Array.isArray(
                    resume.suggestions
                  )
                    ? resume.suggestions
                    : [],
              };
            }
          );

        setResumes(formattedResumes);
      } else {
        setError(
          response?.data?.message ||
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

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    loadResumes();
  }, []);

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredResumes = useMemo(() => {
    return resumes.filter((resume) => {
      const searchText =
        search.toLowerCase();

      const searchMatch =
        String(resume.user || "")
          .toLowerCase()
          .includes(searchText) ||
        String(resume.email || "")
          .toLowerCase()
          .includes(searchText) ||
        String(resume.fileName || "")
          .toLowerCase()
          .includes(searchText);

      let scoreMatch = true;

      if (
        scoreFilter === "Excellent"
      ) {
        scoreMatch =
          resume.atsScore >= 80;
      }

      if (scoreFilter === "Good") {
        scoreMatch =
          resume.atsScore >= 60 &&
          resume.atsScore < 80;
      }

      if (
        scoreFilter === "Needs Work"
      ) {
        scoreMatch =
          resume.atsScore < 60;
      }

      let dateMatch = true;

      /*
        Use actual current date instead of
        hardcoded Aug 12, 2026.
      */

      if (dateFilter === "Today") {
        const today =
          new Date()
            .toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "2-digit",
                year: "numeric",
              }
            );

        dateMatch =
          resume.date === today;
      }

      if (dateFilter === "Recent") {
        /*
          Show resumes from the last 7 days.
        */

        const sourceDate =
          resume.createdAt ||
          resume.updatedAt ||
          resume.uploadedAt;

        if (sourceDate) {
          const uploaded =
            new Date(sourceDate);

          const now = new Date();

          const difference =
            now.getTime() -
            uploaded.getTime();

          const sevenDays =
            7 *
            24 *
            60 *
            60 *
            1000;

          dateMatch =
            difference >= 0 &&
            difference <= sevenDays;
        } else {
          dateMatch = true;
        }
      }

      return (
        searchMatch &&
        scoreMatch &&
        dateMatch
      );
    });
  }, [
    resumes,
    search,
    scoreFilter,
    dateFilter,
  ]);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages = Math.ceil(
    filteredResumes.length /
      resumesPerPage
  );

  const startIndex =
    (currentPage - 1) *
    resumesPerPage;

  const currentResumes =
    filteredResumes.slice(
      startIndex,
      startIndex + resumesPerPage
    );

  /*
    Prevent page from becoming invalid
    after filtering.
  */

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  /* =====================================================
     STATS
  ===================================================== */

  const totalResumes =
    resumes.length;

  const averageATS =
    totalResumes > 0
      ? Math.round(
          resumes.reduce(
            (sum, resume) =>
              sum +
              (Number(
                resume.atsScore
              ) || 0),
            0
          ) / totalResumes
        )
      : 0;

  const todayString =
    new Date().toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    );

  const uploadedToday =
    resumes.filter(
      (resume) =>
        resume.date === todayString
    ).length;

  const lowScoreResumes =
    resumes.filter(
      (resume) =>
        Number(resume.atsScore) < 60
    ).length;

  /* =====================================================
     SCORE CLASS
  ===================================================== */

  const getScoreClass = (score) => {
    if (score >= 80)
      return "excellent";

    if (score >= 60)
      return "good";

    return "low";
  };

  /* =====================================================
     HANDLERS
  ===================================================== */

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleScoreFilter = (value) => {
    setScoreFilter(value);
    setCurrentPage(1);
  };

  const handleDateFilter = (value) => {
    setDateFilter(value);
    setCurrentPage(1);
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="admin-resumes-page">

        <div
          className="admin-resume-page-loading"
          style={{
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div className="admin-resume-spinner" />

          <p>
            Loading resumes...
          </p>
        </div>

      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <div className="admin-resumes-page">

        <div
          className="admin-resume-page-error"
          style={{
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "12px",
          }}
        >
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

      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="admin-resumes-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-resumes-header">

        <div>
          <span className="admin-resumes-eyebrow">
            RESUME MANAGEMENT
          </span>

          <h1>
            Resumes
          </h1>

          <p>
            Monitor uploaded resumes and
            AI-powered ATS analysis.
          </p>
        </div>

        <div className="admin-resume-header-badge">
          <FileText size={15} />

          Resume Analyzer

          <strong>Active</strong>
        </div>

      </div>

      {/* =================================================
          STATS
      ================================================= */}

      <div className="admin-resume-stats">

        <div className="admin-resume-stat-card">

          <div className="admin-resume-stat-icon blue">
            <FileText size={18} />
          </div>

          <div>
            <span>
              Total Resumes
            </span>

            <strong>
              {totalResumes}
            </strong>

            <small>
              All uploaded resumes
            </small>
          </div>

        </div>

        <div className="admin-resume-stat-card">

          <div className="admin-resume-stat-icon purple">
            <TrendingUp size={18} />
          </div>

          <div>
            <span>
              Average ATS Score
            </span>

            <strong>
              {averageATS}
            </strong>

            <small>
              Out of 100
            </small>
          </div>

        </div>

        <div className="admin-resume-stat-card">

          <div className="admin-resume-stat-icon green">
            <Upload size={18} />
          </div>

          <div>
            <span>
              Uploaded Today
            </span>

            <strong>
              {uploadedToday}
            </strong>

            <small>
              New resumes
            </small>
          </div>

        </div>

        <div className="admin-resume-stat-card">

          <div className="admin-resume-stat-icon orange">
            <AlertTriangle size={18} />
          </div>

          <div>
            <span>
              Low ATS Scores
            </span>

            <strong>
              {lowScoreResumes}
            </strong>

            <small>
              Below 60 score
            </small>
          </div>

        </div>

      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="admin-resume-table-card">

        <div className="admin-resume-table-header">

          <div>
            <span>
              RESUME DATABASE
            </span>

            <h2>
              Uploaded Resumes
            </h2>
          </div>

          <div className="admin-resume-count">
            {filteredResumes.length} resumes
          </div>

        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="admin-resume-toolbar">

          <div className="admin-resume-search">

            <Search size={15} />

            <input
              value={search}
              onChange={(e) =>
                handleSearch(
                  e.target.value
                )
              }
              placeholder="Search user or resume..."
            />

          </div>

          <div className="admin-resume-filters">

            <div className="admin-resume-filter">

              <Filter size={13} />

              <select
                value={scoreFilter}
                onChange={(e) =>
                  handleScoreFilter(
                    e.target.value
                  )
                }
              >
                <option value="All">
                  All ATS Scores
                </option>

                <option value="Excellent">
                  Excellent 80+
                </option>

                <option value="Good">
                  Good 60–79
                </option>

                <option value="Needs Work">
                  Needs Work &lt;60
                </option>
              </select>

            </div>

            <div className="admin-resume-filter">

              <CalendarDays size={13} />

              <select
                value={dateFilter}
                onChange={(e) =>
                  handleDateFilter(
                    e.target.value
                  )
                }
              >
                <option value="All">
                  All Dates
                </option>

                <option value="Today">
                  Today
                </option>

                <option value="Recent">
                  Recent
                </option>
              </select>

            </div>

          </div>

        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="admin-resume-table-wrapper">

          <table className="admin-resume-table">

            <thead>
              <tr>
                <th>User</th>
                <th>Resume</th>
                <th>ATS Score</th>
                <th>Status</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {currentResumes.length > 0 ? (
                currentResumes.map(
                  (resume) => (
                    <tr
                      key={resume.id}
                    >

                      <td>
                        <div className="admin-resume-user">

                          <div className="admin-resume-avatar">
                            {resume.initials}
                          </div>

                          <div>
                            <strong>
                              {resume.user}
                            </strong>

                            <span>
                              {resume.email}
                            </span>
                          </div>

                        </div>
                      </td>

                      <td>
                        <div className="admin-resume-file">

                          <div>
                            <FileText size={15} />
                          </div>

                          <span>
                            {resume.fileName}
                          </span>

                        </div>
                      </td>

                      <td>
                        <div
                          className={`admin-ats-score ${getScoreClass(
                            resume.atsScore
                          )}`}
                        >
                          <strong>
                            {resume.atsScore}
                          </strong>

                          <span>
                            /100
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="admin-resume-status">
                          <i></i>
                          {resume.status}
                        </span>
                      </td>

                      <td>
                        <div className="admin-resume-date">
                          {resume.date}
                        </div>
                      </td>

                      <td>
                        <div className="admin-resume-actions">

                          <button
                            onClick={() =>
                              setSelectedResume(
                                resume
                              )
                            }
                          >
                            <Eye size={14} />
                            View
                          </button>

                          <button
                            onClick={() => {
                              if (
                                resume.fileUrl
                              ) {
                                window.open(
                                  resume.fileUrl,
                                  "_blank",
                                  "noopener,noreferrer"
                                );
                              } else {
                                alert(
                                  "Resume file is not available."
                                );
                              }
                            }}
                          >
                            <Download size={14} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="admin-resume-empty"
                  >
                    <FileText size={30} />

                    <strong>
                      No resumes found
                    </strong>

                    <span>
                      Try changing your
                      search or filters.
                    </span>
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}

        <div className="admin-resume-pagination">

          <span>
            Showing{" "}

            <strong>
              {filteredResumes.length === 0
                ? 0
                : startIndex + 1}
            </strong>{" "}

            to{" "}

            <strong>
              {Math.min(
                startIndex +
                  resumesPerPage,
                filteredResumes.length
              )}
            </strong>{" "}

            of{" "}

            <strong>
              {filteredResumes.length}
            </strong>{" "}

            resumes
          </span>

          <div>

            <button
              disabled={
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  currentPage - 1
                )
              }
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) =>
                index + 1
            ).map((page) => (
              <button
                key={page}
                className={
                  currentPage === page
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setCurrentPage(page)
                }
              >
                {page}
              </button>
            ))}

            <button
              disabled={
                currentPage ===
                  totalPages ||
                totalPages === 0
              }
              onClick={() =>
                setCurrentPage(
                  currentPage + 1
                )
              }
            >
              <ChevronRight size={14} />
            </button>

          </div>

        </div>

      </div>

      {/* =================================================
          MODAL
      ================================================= */}

      {selectedResume && (
        <AdminResumeModal
          resume={selectedResume}
          onClose={() =>
            setSelectedResume(null)
          }
        />
      )}

    </div>
  );
};

export default AdminResumes;