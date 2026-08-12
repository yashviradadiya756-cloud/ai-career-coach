import React, { useMemo, useState } from "react";

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
} from "lucide-react";

import AdminResumeModal from "../components/AdminResumeModal";

import "../styles/adminResumes.css";

const AdminResumes = () => {
  const [search, setSearch] = useState("");

  const [scoreFilter, setScoreFilter] =
    useState("All");

  const [dateFilter, setDateFilter] =
    useState("All");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [selectedResume, setSelectedResume] =
    useState(null);

  const resumesPerPage = 6;

  const [resumes] = useState([
    {
      id: 1,
      user: "Yashvi Radariya",
      email: "yashvi@example.com",
      initials: "YR",
      fileName: "Yashvi_Resume.pdf",
      atsScore: 82,
      date: "Aug 12, 2026",
      status: "Analyzed",
      strengths: [
        "Strong React experience",
        "Good project section",
        "Relevant technical skills",
      ],
      weaknesses: [
        "Limited measurable achievements",
        "Summary can be improved",
      ],
      suggestions: [
        "Add measurable results to projects",
        "Improve professional summary",
        "Add relevant keywords for target roles",
      ],
    },

    {
      id: 2,
      user: "Priya Shah",
      email: "priya@example.com",
      initials: "PS",
      fileName: "Priya_Resume.pdf",
      atsScore: 68,
      date: "Aug 12, 2026",
      status: "Analyzed",
      strengths: [
        "Good education section",
        "Clear formatting",
      ],
      weaknesses: [
        "Missing several technical keywords",
        "Project descriptions are short",
      ],
      suggestions: [
        "Add more technical keywords",
        "Expand project descriptions",
      ],
    },

    {
      id: 3,
      user: "Rahul Patel",
      email: "rahul@example.com",
      initials: "RP",
      fileName: "Rahul_CV.pdf",
      atsScore: 47,
      date: "Aug 11, 2026",
      status: "Analyzed",
      strengths: [
        "Good educational background",
      ],
      weaknesses: [
        "Weak project section",
        "Missing technical skills",
        "Poor keyword matching",
      ],
      suggestions: [
        "Add 2–3 strong technical projects",
        "Improve skills section",
        "Use job-specific keywords",
      ],
    },

    {
      id: 4,
      user: "Neha Patel",
      email: "neha@example.com",
      initials: "NP",
      fileName: "Neha_Resume.pdf",
      atsScore: 76,
      date: "Aug 11, 2026",
      status: "Analyzed",
      strengths: [
        "Strong professional summary",
        "Relevant skills",
        "Good structure",
      ],
      weaknesses: [
        "Some sections are too long",
      ],
      suggestions: [
        "Shorten unnecessary content",
        "Add quantified achievements",
      ],
    },

    {
      id: 5,
      user: "Aarav Mehta",
      email: "aarav@example.com",
      initials: "AM",
      fileName: "Aarav_Resume.pdf",
      atsScore: 91,
      date: "Aug 10, 2026",
      status: "Analyzed",
      strengths: [
        "Excellent technical skills",
        "Strong project descriptions",
        "Excellent keyword usage",
      ],
      weaknesses: [
        "Could improve visual consistency",
      ],
      suggestions: [
        "Add links to portfolio projects",
        "Keep formatting consistent",
      ],
    },

    {
      id: 6,
      user: "Kavya Joshi",
      email: "kavya@example.com",
      initials: "KJ",
      fileName: "Kavya_CV.pdf",
      atsScore: 54,
      date: "Aug 10, 2026",
      status: "Analyzed",
      strengths: [
        "Good academic section",
        "Clear career objective",
      ],
      weaknesses: [
        "Not enough technical projects",
        "Skills need improvement",
      ],
      suggestions: [
        "Build more real-world projects",
        "Add technical certifications",
      ],
    },

    {
      id: 7,
      user: "Harsh Trivedi",
      email: "harsh@example.com",
      initials: "HT",
      fileName: "Harsh_Resume.pdf",
      atsScore: 73,
      date: "Aug 09, 2026",
      status: "Analyzed",
      strengths: [
        "Good technical profile",
        "Good project variety",
      ],
      weaknesses: [
        "Some descriptions lack metrics",
      ],
      suggestions: [
        "Add measurable project results",
      ],
    },

    {
      id: 8,
      user: "Riya Desai",
      email: "riya@example.com",
      initials: "RD",
      fileName: "Riya_Resume.pdf",
      atsScore: 42,
      date: "Aug 09, 2026",
      status: "Analyzed",
      strengths: [
        "Good education section",
      ],
      weaknesses: [
        "Low keyword match",
        "Weak experience section",
        "Missing technical skills",
      ],
      suggestions: [
        "Rewrite the experience section",
        "Add technical keywords",
        "Improve project descriptions",
      ],
    },

    {
      id: 9,
      user: "Meet Joshi",
      email: "meet@example.com",
      initials: "MJ",
      fileName: "Meet_Resume.pdf",
      atsScore: 64,
      date: "Aug 08, 2026",
      status: "Analyzed",
      strengths: [
        "Good technical foundation",
      ],
      weaknesses: [
        "Resume lacks measurable results",
      ],
      suggestions: [
        "Add metrics and outcomes",
      ],
    },
  ]);

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredResumes = useMemo(() => {
    return resumes.filter((resume) => {
      const searchMatch =
        resume.user
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        resume.email
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        resume.fileName
          .toLowerCase()
          .includes(search.toLowerCase());

      let scoreMatch = true;

      if (scoreFilter === "Excellent") {
        scoreMatch = resume.atsScore >= 80;
      }

      if (scoreFilter === "Good") {
        scoreMatch =
          resume.atsScore >= 60 &&
          resume.atsScore < 80;
      }

      if (scoreFilter === "Needs Work") {
        scoreMatch = resume.atsScore < 60;
      }

      let dateMatch = true;

      if (dateFilter === "Today") {
        dateMatch =
          resume.date === "Aug 12, 2026";
      }

      if (dateFilter === "Recent") {
        dateMatch =
          resume.date !== "Aug 08, 2026";
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

  /* =====================================================
     STATS
  ===================================================== */

  const totalResumes = resumes.length;

  const averageATS = Math.round(
    resumes.reduce(
      (sum, resume) =>
        sum + resume.atsScore,
      0
    ) / resumes.length
  );

  const uploadedToday = resumes.filter(
    (resume) =>
      resume.date === "Aug 12, 2026"
  ).length;

  const lowScoreResumes = resumes.filter(
    (resume) => resume.atsScore < 60
  ).length;

  /* =====================================================
     SCORE CLASS
  ===================================================== */

  const getScoreClass = (score) => {
    if (score >= 80) return "excellent";

    if (score >= 60) return "good";

    return "low";
  };

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
            <span>Total Resumes</span>

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
            <span>Average ATS Score</span>

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
            <span>Uploaded Today</span>

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
            <span>Low ATS Scores</span>

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
                    <tr key={resume.id}>

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
                                  "_blank"
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
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(
                  currentPage - 1
                )
              }
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
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
                currentPage === totalPages ||
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