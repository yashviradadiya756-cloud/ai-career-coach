import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

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

import { getAdminResumes } from "../../api/adminApi";

import AdminResumeModal from "../components/AdminResumeModal";

import "../styles/adminResumes.css";

const AdminResumes = () => {
  // =====================================================
  // STATE
  // =====================================================

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

  // =====================================================
  // GET BACKEND BASE URL
  // =====================================================

  const getBackendUrl = () => {
    const envUrl =
      import.meta.env.VITE_API_URL;

    if (envUrl) {
      return envUrl.replace(/\/+$/, "");
    }

    return "http://localhost:5000";
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Unknown date";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }

    return date.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // CREATE FILE URL
  // =====================================================

  const createFileUrl = (resume) => {
    // If backend already provides fileUrl
    if (resume.fileUrl) {
      return resume.fileUrl;
    }

    // If backend provides URL
    if (resume.url) {
      return resume.url;
    }

    if (!resume.filePath) {
      return "";
    }

    const backendUrl =
      getBackendUrl();

    let cleanPath =
      String(resume.filePath)
        .replace(/\\/g, "/")
        .replace(/^\/+/, "");

    /*
      Example:

      uploads/resume.pdf
      OR
      resume.pdf
    */

    if (
      cleanPath.startsWith(
        "uploads/"
      )
    ) {
      return `${backendUrl}/${cleanPath}`;
    }

    return `${backendUrl}/uploads/${cleanPath}`;
  };

  // =====================================================
  // FORMAT USER NAME
  // =====================================================

  const getUserName = (resume) => {
    const user = resume.user;

    // user is populated object
    if (
      user &&
      typeof user === "object"
    ) {
      return (
        user.username ||
        user.name ||
        user.fullName ||
        user.email ||
        "Unknown User"
      );
    }

    // backend sends separate username
    if (resume.userName) {
      return resume.userName;
    }

    if (resume.username) {
      return resume.username;
    }

    if (resume.name) {
      return resume.name;
    }

    // backend sends user as string
    if (
      typeof user === "string"
    ) {
      return user;
    }

    return "Unknown User";
  };

  // =====================================================
  // GET USER EMAIL
  // =====================================================

  const getUserEmail = (resume) => {
    const user = resume.user;

    if (
      user &&
      typeof user === "object"
    ) {
      return (
        user.email ||
        resume.email ||
        "No email"
      );
    }

    return (
      resume.email ||
      "No email"
    );
  };

  // =====================================================
  // GET INITIALS
  // =====================================================

  const getInitials = (name) => {
    if (!name) {
      return "U";
    }

    const initials = String(name)
      .split(" ")
      .filter(Boolean)
      .map(
        (part) =>
          part.charAt(0)
      )
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return initials || "U";
  };

  // =====================================================
  // NORMALIZE RESUME
  // =====================================================

  const normalizeResume = (
    resume,
    index
  ) => {
    const userName =
      getUserName(resume);

    const userEmail =
      getUserEmail(resume);

    const score =
      Number(
        resume.atsScore ??
          resume.score ??
          0
      );

    const uploadedDate =
      resume.createdAt ||
      resume.updatedAt ||
      resume.uploadedAt ||
      resume.date;

    return {
      ...resume,

      id:
        resume._id ||
        resume.id ||
        index,

      user: userName,

      email: userEmail,

      initials:
        getInitials(userName),

      fileName:
        resume.fileName ||
        resume.originalName ||
        resume.filename ||
        "Resume",

      atsScore:
        Number.isFinite(score)
          ? score
          : 0,

      date:
        formatDate(
          uploadedDate
        ),

      uploadedDate,

      status:
        resume.status ||
        "Analyzed",

      fileUrl:
        createFileUrl(
          resume
        ),

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
  };

  // =====================================================
  // LOAD RESUMES
  // =====================================================

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAdminResumes();

      console.log(
        "ADMIN RESUMES RAW RESPONSE:",
        response
      );

      /*
        Supports both:

        1. getAdminResumes() returns Axios response

        {
          data: {
            success: true,
            resumes: []
          }
        }

        2. getAdminResumes() returns response.data

        {
          success: true,
          resumes: []
        }
      */

      const data =
        response?.data?.success !== undefined
          ? response.data
          : response;

      console.log(
        "ADMIN RESUMES DATA:",
        data
      );

      if (!data?.success) {
        setError(
          data?.message ||
            "Failed to load resumes"
        );

        setResumes([]);

        return;
      }

      const backendResumes =
        Array.isArray(
          data.resumes
        )
          ? data.resumes
          : [];

      const formattedResumes =
        backendResumes.map(
          normalizeResume
        );

      console.log(
        "FORMATTED ADMIN RESUMES:",
        formattedResumes
      );

      setResumes(
        formattedResumes
      );

    } catch (err) {
      console.error(
        "ADMIN RESUMES ERROR:",
        err
      );

      const message =
        err?.response?.data
          ?.message ||
        err?.message ||
        "Failed to load resumes";

      setError(message);

      setResumes([]);

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadResumes();
  }, []);

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredResumes =
    useMemo(() => {
      return resumes.filter(
        (resume) => {
          const searchText =
            search
              .trim()
              .toLowerCase();

          const searchMatch =
            !searchText ||
            String(
              resume.user || ""
            )
              .toLowerCase()
              .includes(searchText) ||
            String(
              resume.email || ""
            )
              .toLowerCase()
              .includes(searchText) ||
            String(
              resume.fileName || ""
            )
              .toLowerCase()
              .includes(searchText);

          // -------------------------------------------
          // SCORE FILTER
          // -------------------------------------------

          let scoreMatch = true;

          if (
            scoreFilter ===
            "Excellent"
          ) {
            scoreMatch =
              resume.atsScore >= 80;
          }

          if (
            scoreFilter ===
            "Good"
          ) {
            scoreMatch =
              resume.atsScore >= 60 &&
              resume.atsScore < 80;
          }

          if (
            scoreFilter ===
            "Needs Work"
          ) {
            scoreMatch =
              resume.atsScore < 60;
          }

          // -------------------------------------------
          // DATE FILTER
          // -------------------------------------------

          let dateMatch = true;

          if (
            dateFilter ===
            "Today"
          ) {
            if (
              resume.uploadedDate
            ) {
              const uploaded =
                new Date(
                  resume.uploadedDate
                );

              const today =
                new Date();

              dateMatch =
                uploaded.getDate() ===
                  today.getDate() &&
                uploaded.getMonth() ===
                  today.getMonth() &&
                uploaded.getFullYear() ===
                  today.getFullYear();
            } else {
              dateMatch = false;
            }
          }

          if (
            dateFilter ===
            "Recent"
          ) {
            if (
              resume.uploadedDate
            ) {
              const uploaded =
                new Date(
                  resume.uploadedDate
                );

              const now =
                new Date();

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
                difference <=
                  sevenDays;
            } else {
              dateMatch = false;
            }
          }

          return (
            searchMatch &&
            scoreMatch &&
            dateMatch
          );
        }
      );
    }, [
      resumes,
      search,
      scoreFilter,
      dateFilter,
    ]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages =
    Math.ceil(
      filteredResumes.length /
        resumesPerPage
    );

  const startIndex =
    (currentPage - 1) *
    resumesPerPage;

  const currentResumes =
    filteredResumes.slice(
      startIndex,
      startIndex +
        resumesPerPage
    );

  // =====================================================
  // RESET INVALID PAGE
  // =====================================================

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(
        totalPages
      );
    }

    if (
      totalPages === 0 &&
      currentPage !== 1
    ) {
      setCurrentPage(1);
    }
  }, [
    totalPages,
    currentPage,
  ]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalResumes =
    resumes.length;

  const averageATS =
    totalResumes > 0
      ? Math.round(
          resumes.reduce(
            (sum, resume) =>
              sum +
              Number(
                resume.atsScore || 0
              ),
            0
          ) /
            totalResumes
        )
      : 0;

  const uploadedToday =
    resumes.filter(
      (resume) => {
        if (
          !resume.uploadedDate
        ) {
          return false;
        }

        const uploaded =
          new Date(
            resume.uploadedDate
          );

        const today =
          new Date();

        return (
          uploaded.getDate() ===
            today.getDate() &&
          uploaded.getMonth() ===
            today.getMonth() &&
          uploaded.getFullYear() ===
            today.getFullYear()
        );
      }
    ).length;

  const lowScoreResumes =
    resumes.filter(
      (resume) =>
        Number(
          resume.atsScore
        ) < 60
    ).length;

  // =====================================================
  // SCORE CLASS
  // =====================================================

  const getScoreClass = (
    score
  ) => {
    if (score >= 80) {
      return "excellent";
    }

    if (score >= 60) {
      return "good";
    }

    return "low";
  };

  // =====================================================
  // FILTER HANDLERS
  // =====================================================

  const handleSearch = (
    value
  ) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleScoreFilter = (
    value
  ) => {
    setScoreFilter(value);
    setCurrentPage(1);
  };

  const handleDateFilter = (
    value
  ) => {
    setDateFilter(value);
    setCurrentPage(1);
  };

  // =====================================================
  // DOWNLOAD / OPEN RESUME
  // =====================================================

  const handleDownload = (
    resume
  ) => {
    if (!resume.fileUrl) {
      alert(
        "Resume file is not available."
      );

      return;
    }

    window.open(
      resume.fileUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="admin-resumes-page">
        <div
          className="admin-resume-page-loading"
          style={{
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            flexDirection:
              "column",
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

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="admin-resumes-page">
        <div
          className="admin-resume-page-error"
          style={{
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            flexDirection:
              "column",
            gap: "12px",
          }}
        >
          <AlertTriangle
            size={40}
          />

          <h2>
            Failed to load resumes
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={
              loadResumes
            }
          >
            <RefreshCw
              size={16}
            />

            Retry
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

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
            Monitor uploaded resumes
            and AI-powered ATS
            analysis.
          </p>
        </div>

        <div className="admin-resume-header-actions">

          <button
            className="admin-resume-refresh"
            onClick={
              loadResumes
            }
          >
            <RefreshCw
              size={15}
            />

            Refresh
          </button>

          <div className="admin-resume-header-badge">

            <FileText
              size={15}
            />

            Resume Analyzer

            <strong>
              Active
            </strong>

          </div>

        </div>

      </div>

      {/* =================================================
          STATS
      ================================================= */}

      <div className="admin-resume-stats">

        {/* TOTAL */}

        <div className="admin-resume-stat-card">

          <div className="admin-resume-stat-icon blue">
            <FileText
              size={18}
            />
          </div>

          <div>
            <span>
              Total Resumes
            </span>

            <strong>
              {totalResumes}
            </strong>

            <small>
              All uploaded
              resumes
            </small>
          </div>

        </div>

        {/* AVERAGE */}

        <div className="admin-resume-stat-card">

          <div className="admin-resume-stat-icon purple">
            <TrendingUp
              size={18}
            />
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

        {/* TODAY */}

        <div className="admin-resume-stat-card">

          <div className="admin-resume-stat-icon green">
            <Upload
              size={18}
            />
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

        {/* LOW */}

        <div className="admin-resume-stat-card">

          <div className="admin-resume-stat-icon orange">
            <AlertTriangle
              size={18}
            />
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
          DATABASE
      ================================================= */}

      <div className="admin-resume-table-card">

        {/* TABLE HEADER */}

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
            {filteredResumes.length}{" "}
            resume
            {filteredResumes.length !==
            1
              ? "s"
              : ""}
          </div>

        </div>

        {/* =================================================
            TOOLBAR
        ================================================= */}

        <div className="admin-resume-toolbar">

          {/* SEARCH */}

          <div className="admin-resume-search">

            <Search
              size={15}
            />

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

          {/* FILTERS */}

          <div className="admin-resume-filters">

            {/* SCORE */}

            <div className="admin-resume-filter">

              <Filter
                size={13}
              />

              <select
                value={
                  scoreFilter
                }
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

            {/* DATE */}

            <div className="admin-resume-filter">

              <CalendarDays
                size={13}
              />

              <select
                value={
                  dateFilter
                }
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
                  Last 7 Days
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
                <th>
                  User
                </th>

                <th>
                  Resume
                </th>

                <th>
                  ATS Score
                </th>

                <th>
                  Status
                </th>

                <th>
                  Uploaded
                </th>

                <th>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {currentResumes.length >
              0 ? (
                currentResumes.map(
                  (resume) => (
                    <tr
                      key={
                        resume.id
                      }
                    >

                      {/* USER */}

                      <td>
                        <div className="admin-resume-user">

                          <div className="admin-resume-avatar">
                            {
                              resume.initials
                            }
                          </div>

                          <div>
                            <strong>
                              {
                                resume.user
                              }
                            </strong>

                            <span>
                              {
                                resume.email
                              }
                            </span>
                          </div>

                        </div>
                      </td>

                      {/* FILE */}

                      <td>
                        <div className="admin-resume-file">

                          <div>
                            <FileText
                              size={15}
                            />
                          </div>

                          <span
                            title={
                              resume.fileName
                            }
                          >
                            {
                              resume.fileName
                            }
                          </span>

                        </div>
                      </td>

                      {/* ATS */}

                      <td>
                        <div
                          className={`admin-ats-score ${getScoreClass(
                            resume.atsScore
                          )}`}
                        >
                          <strong>
                            {
                              resume.atsScore
                            }
                          </strong>

                          <span>
                            /100
                          </span>
                        </div>
                      </td>

                      {/* STATUS */}

                      <td>
                        <span className="admin-resume-status">

                          <i />

                          {
                            resume.status
                          }

                        </span>
                      </td>

                      {/* DATE */}

                      <td>
                        <div className="admin-resume-date">
                          {
                            resume.date
                          }
                        </div>
                      </td>

                      {/* ACTIONS */}

                      <td>
                        <div className="admin-resume-actions">

                          <button
                            onClick={() =>
                              setSelectedResume(
                                resume
                              )
                            }
                          >
                            <Eye
                              size={14}
                            />

                            View
                          </button>

                          <button
                            title="Open Resume"
                            onClick={() =>
                              handleDownload(
                                resume
                              )
                            }
                          >
                            <Download
                              size={14}
                            />
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
                    <FileText
                      size={30}
                    />

                    <strong>
                      No resumes found
                    </strong>

                    <span>
                      Try changing
                      your search or
                      filters.
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
              {filteredResumes.length ===
              0
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
              {
                filteredResumes.length
              }
            </strong>{" "}

            resumes
          </span>

          <div>

            {/* PREVIOUS */}

            <button
              disabled={
                currentPage ===
                1
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    page - 1
                )
              }
            >
              <ChevronLeft
                size={14}
              />
            </button>

            {/* PAGE NUMBERS */}

            {Array.from(
              {
                length:
                  totalPages,
              },
              (_, index) =>
                index + 1
            ).map(
              (page) => (
                <button
                  key={page}
                  className={
                    currentPage ===
                    page
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setCurrentPage(
                      page
                    )
                  }
                >
                  {page}
                </button>
              )
            )}

            {/* NEXT */}

            <button
              disabled={
                totalPages ===
                  0 ||
                currentPage ===
                  totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    page + 1
                )
              }
            >
              <ChevronRight
                size={14}
              />
            </button>

          </div>

        </div>

      </div>

      {/* =================================================
          MODAL
      ================================================= */}

      {selectedResume && (
        <AdminResumeModal
          resume={
            selectedResume
          }
          onClose={() =>
            setSelectedResume(
              null
            )
          }
        />
      )}

    </div>
  );
};

export default AdminResumes;