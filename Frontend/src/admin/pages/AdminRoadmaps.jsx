import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Map,
  Users,
  CheckCircle,
  TrendingUp,
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  Clock,
  Target,
} from "lucide-react";

import AdminRoadmapModal from "../components/AdminRoadmapModal";

import api from "../../api/axios";

import "../styles/adminRoadmaps.css";

const AdminRoadmaps = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [careerFilter, setCareerFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedRoadmap, setSelectedRoadmap] =
    useState(null);

  const [roadmaps, setRoadmaps] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const roadmapsPerPage = 6;

  /* =====================================================
     GET ADMIN ROADMAPS
     GET /api/admin/roadmap
  ===================================================== */

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/api/admin/roadmap"
        );

        console.log(
          "ADMIN ROADMAP API:",
          response.data
        );

        const backendRoadmaps =
          Array.isArray(response.data?.roadmaps)
            ? response.data.roadmaps
            : [];

        /* ================================================
           MAP BACKEND DATA TO EXISTING UI STRUCTURE
        ================================================ */

        const formattedRoadmaps =
          backendRoadmaps.map(
            (roadmap, index) => {
              const user =
                roadmap.user &&
                typeof roadmap.user === "object"
                  ? roadmap.user
                  : null;

              const userName =
                user?.username ||
                user?.name ||
                "Unknown User";

              const userEmail =
                user?.email ||
                roadmap.email ||
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

              /* ==========================================
                 PHASES -> EXISTING UI STEPS
              ========================================== */

              const phases =
                Array.isArray(
                  roadmap.phases
                )
                  ? roadmap.phases
                  : [];

              const steps = phases.map(
                (phase) => {
                  let description = "";

                  if (
                    typeof phase.description ===
                    "string"
                  ) {
                    description =
                      phase.description;
                  } else if (
                    Array.isArray(
                      phase.topics
                    )
                  ) {
                    description =
                      phase.topics.join(", ");
                  } else if (
                    Array.isArray(
                      phase.projects
                    )
                  ) {
                    description =
                      phase.projects.join(", ");
                  }

                  return {
                    title:
                      phase.title ||
                      phase.name ||
                      "Learning Phase",

                    duration:
                      phase.duration ||
                      "Not specified",

                    description:
                      description ||
                      "No description available.",

                    completed:
                      Boolean(
                        phase.completed
                      ),
                  };
                }
              );

              const totalSteps =
                steps.length;

              const completedSteps =
                steps.filter(
                  (step) =>
                    step.completed
                ).length;

              /* ==========================================
                 CALCULATE PROGRESS
              ========================================== */

              let progress = 0;

              if (
                typeof roadmap.progress ===
                "number"
              ) {
                progress =
                  Math.max(
                    0,
                    Math.min(
                      100,
                      roadmap.progress
                    )
                  );
              } else if (
                totalSteps > 0
              ) {
                progress = Math.round(
                  (completedSteps /
                    totalSteps) *
                    100
                );
              }

              /* ==========================================
                 STATUS
              ========================================== */

              const status =
                progress >= 100
                  ? "Completed"
                  : "Active";

              /* ==========================================
                 CURRENT STEP
              ========================================== */

              const currentStep =
                steps.findIndex(
                  (step) =>
                    !step.completed
                );

              const currentStepNumber =
                currentStep === -1
                  ? totalSteps
                  : currentStep + 1;

              /* ==========================================
                 DATE
              ========================================== */

              const formatDate = (
                dateValue
              ) => {
                if (!dateValue) {
                  return "Unknown date";
                }

                const date =
                  new Date(dateValue);

                if (
                  Number.isNaN(
                    date.getTime()
                  )
                ) {
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

              const updatedDate =
                roadmap.updatedAt ||
                roadmap.createdAt;

              /* ==========================================
                 RETURN UI-FRIENDLY OBJECT
              ========================================== */

              return {
                id:
                  roadmap._id ||
                  roadmap.id ||
                  index,

                user: userName,

                email: userEmail,

                initials,

                career:
                  roadmap.targetRole ||
                  roadmap.career ||
                  "Career Goal",

                roadmapTitle:
                  roadmap.roadmapTitle ||
                  "",

                progress,

                status,

                createdAt:
                  formatDate(
                    roadmap.createdAt
                  ),

                updatedAt:
                  formatDate(
                    updatedDate
                  ),

                duration:
                  roadmap.duration ||
                  "Personalized",

                completedSteps,

                totalSteps,

                currentStep:
                  currentStepNumber,

                steps,

                /* Keep original backend data
                   available for modal if needed */
                originalRoadmap:
                  roadmap,
              };
            }
          );

        setRoadmaps(
          formattedRoadmaps
        );
      } catch (err) {
        console.error(
          "ADMIN ROADMAP FETCH ERROR:",
          err
        );

        const message =
          err?.response?.data?.message ||
          "Failed to load roadmaps.";

        setError(message);

        setRoadmaps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredRoadmaps = useMemo(() => {
    return roadmaps.filter(
      (roadmap) => {
        const searchText =
          search.toLowerCase().trim();

        const searchMatch =
          roadmap.user
            .toLowerCase()
            .includes(searchText) ||
          roadmap.email
            .toLowerCase()
            .includes(searchText) ||
          roadmap.career
            .toLowerCase()
            .includes(searchText);

        const statusMatch =
          statusFilter === "All" ||
          roadmap.status ===
            statusFilter;

        const careerMatch =
          careerFilter === "All" ||
          roadmap.career ===
            careerFilter;

        return (
          searchMatch &&
          statusMatch &&
          careerMatch
        );
      }
    );
  }, [
    roadmaps,
    search,
    statusFilter,
    careerFilter,
  ]);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages = Math.ceil(
    filteredRoadmaps.length /
      roadmapsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    roadmapsPerPage;

  const currentRoadmaps =
    filteredRoadmaps.slice(
      startIndex,
      startIndex + roadmapsPerPage
    );

  /* =====================================================
     STATS
  ===================================================== */

  const totalRoadmaps =
    roadmaps.length;

  const activeRoadmaps =
    roadmaps.filter(
      (item) =>
        item.status === "Active"
    ).length;

  const completedRoadmaps =
    roadmaps.filter(
      (item) =>
        item.status === "Completed"
    ).length;

  const averageProgress =
    roadmaps.length > 0
      ? Math.round(
          roadmaps.reduce(
            (sum, item) =>
              sum + item.progress,
            0
          ) / roadmaps.length
        )
      : 0;

  /* =====================================================
     CAREER DEMAND
  ===================================================== */

  const careerDemand = useMemo(() => {
    if (roadmaps.length === 0) {
      return [
        {
          name: "Frontend Developer",
          percentage: 0,
        },
        {
          name: "Full Stack Developer",
          percentage: 0,
        },
        {
          name: "Data Analyst",
          percentage: 0,
        },
        {
          name: "UI/UX Designer",
          percentage: 0,
        },
        {
          name: "Other",
          percentage: 0,
        },
      ];
    }

    const careerCounts = {};

    roadmaps.forEach(
      (roadmap) => {
        const career =
          roadmap.career ||
          "Other";

        careerCounts[career] =
          (careerCounts[career] ||
            0) + 1;
      }
    );

    const total =
      roadmaps.length;

    const knownCareers = [
      "Frontend Developer",
      "Full Stack Developer",
      "Data Analyst",
      "UI/UX Designer",
    ];

    const known = knownCareers.map(
      (career) => ({
        name: career,
        percentage: Math.round(
          ((careerCounts[
            career
          ] || 0) /
            total) *
            100
        ),
      })
    );

    const knownCount =
      knownCareers.reduce(
        (sum, career) =>
          sum +
          (careerCounts[
            career
          ] || 0),
        0
      );

    const otherPercentage =
      Math.round(
        ((total - knownCount) /
          total) *
          100
      );

    return [
      ...known,
      {
        name: "Other",
        percentage:
          otherPercentage,
      },
    ];
  }, [roadmaps]);

  /* =====================================================
     HANDLERS
  ===================================================== */

  const getProgressClass = (
    progress
  ) => {
    if (progress >= 80)
      return "high";

    if (progress >= 50)
      return "medium";

    return "low";
  };

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div className="admin-roadmaps-page">

      {/* HEADER */}

      <div className="admin-roadmaps-header">

        <div>

          <span className="admin-roadmaps-eyebrow">
            CAREER ROADMAP MANAGEMENT
          </span>

          <h1>
            Career Roadmaps
          </h1>

          <p>
            Monitor personalized career
            roadmaps and learner progress.
          </p>

        </div>

        <div className="admin-roadmap-live">

          <Map size={14} />

          Roadmap Engine

          <strong>Active</strong>

        </div>

      </div>

      {/* STATS */}

      <div className="admin-roadmap-stats">

        <div className="admin-roadmap-stat-card">

          <div className="admin-roadmap-stat-icon blue">
            <Map size={18} />
          </div>

          <div>
            <span>Total Roadmaps</span>

            <strong>
              {totalRoadmaps}
            </strong>

            <small>
              Generated roadmaps
            </small>
          </div>

        </div>

        <div className="admin-roadmap-stat-card">

          <div className="admin-roadmap-stat-icon purple">
            <Users size={18} />
          </div>

          <div>
            <span>Active</span>

            <strong>
              {activeRoadmaps}
            </strong>

            <small>
              Currently learning
            </small>
          </div>

        </div>

        <div className="admin-roadmap-stat-card">

          <div className="admin-roadmap-stat-icon green">
            <CheckCircle size={18} />
          </div>

          <div>
            <span>Completed</span>

            <strong>
              {completedRoadmaps}
            </strong>

            <small>
              Finished roadmaps
            </small>
          </div>

        </div>

        <div className="admin-roadmap-stat-card">

          <div className="admin-roadmap-stat-icon orange">
            <TrendingUp size={18} />
          </div>

          <div>
            <span>Average Progress</span>

            <strong>
              {averageProgress}%
            </strong>

            <small>
              Across all learners
            </small>
          </div>

        </div>

      </div>

      {/* OVERVIEW */}

      <div className="admin-roadmap-overview">

        <div className="admin-roadmap-careers-card">

          <div className="admin-roadmap-card-header">

            <div>
              <span>
                CAREER DEMAND
              </span>

              <h2>
                Popular Career Goals
              </h2>
            </div>

            <Target size={17} />

          </div>

          <div className="admin-career-bars">

            {careerDemand.map(
              (career) => (
                <div
                  key={
                    career.name
                  }
                >

                  <span>
                    {career.name}
                  </span>

                  <strong>
                    {career.percentage}%
                  </strong>

                  <div>

                    <i
                      style={{
                        width: `${career.percentage}%`,
                      }}
                    />

                  </div>

                </div>
              )
            )}

          </div>

        </div>

        <div className="admin-roadmap-progress-card">

          <span>
            LEARNING PROGRESS
          </span>

          <h2>
            Average learner progress
          </h2>

          <div className="admin-roadmap-big-progress">

            <strong>
              {averageProgress}%
            </strong>

            <div>

              <i
                style={{
                  width: `${averageProgress}%`,
                }}
              />

            </div>

          </div>

          <p>
            Learners are progressing steadily
            through their personalized plans.
          </p>

        </div>

      </div>

      {/* TABLE */}

      <div className="admin-roadmap-table-card">

        <div className="admin-roadmap-table-header">

          <div>

            <span>
              ROADMAP DATABASE
            </span>

            <h2>
              Learner Roadmaps
            </h2>

          </div>

          <div className="admin-roadmap-count">

            {filteredRoadmaps.length} roadmaps

          </div>

        </div>

        {/* FILTERS */}

        <div className="admin-roadmap-toolbar">

          <div className="admin-roadmap-search">

            <Search size={15} />

            <input
              value={search}
              onChange={(e) => {
                setSearch(
                  e.target.value
                );

                setCurrentPage(1);
              }}
              placeholder="Search user or career..."
            />

          </div>

          <div className="admin-roadmap-filters">

            <div className="admin-roadmap-filter">

              <Filter size={13} />

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(
                    e.target.value
                  );

                  setCurrentPage(1);
                }}
              >

                <option value="All">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Completed">
                  Completed
                </option>

              </select>

            </div>

            <select
              className="admin-roadmap-filter-select"
              value={careerFilter}
              onChange={(e) => {
                setCareerFilter(
                  e.target.value
                );

                setCurrentPage(1);
              }}
            >

              <option value="All">
                All Careers
              </option>

              <option value="Frontend Developer">
                Frontend Developer
              </option>

              <option value="Full Stack Developer">
                Full Stack Developer
              </option>

              <option value="Backend Developer">
                Backend Developer
              </option>

              <option value="UI/UX Designer">
                UI/UX Designer
              </option>

              <option value="Data Analyst">
                Data Analyst
              </option>

              <option value="Python Developer">
                Python Developer
              </option>

            </select>

          </div>

        </div>

        {/* TABLE */}

        <div className="admin-roadmap-table-wrapper">

          <table className="admin-roadmap-table">

            <thead>

              <tr>
                <th>User</th>
                <th>Career Goal</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Steps</th>
                <th>Updated</th>
                <th></th>
              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="7"
                    className="admin-roadmap-empty"
                  >

                    <Map size={30} />

                    <strong>
                      Loading roadmaps...
                    </strong>

                    <span>
                      Fetching roadmap data from backend.
                    </span>

                  </td>

                </tr>

              ) : error ? (

                <tr>

                  <td
                    colSpan="7"
                    className="admin-roadmap-empty"
                  >

                    <Map size={30} />

                    <strong>
                      Failed to load roadmaps
                    </strong>

                    <span>
                      {error}
                    </span>

                  </td>

                </tr>

              ) : currentRoadmaps.length >
                0 ? (

                currentRoadmaps.map(
                  (roadmap) => (

                    <tr
                      key={roadmap.id}
                    >

                      <td>

                        <div className="admin-roadmap-user">

                          <div className="admin-roadmap-avatar">
                            {roadmap.initials}
                          </div>

                          <div>

                            <strong>
                              {roadmap.user}
                            </strong>

                            <span>
                              {roadmap.email}
                            </span>

                          </div>

                        </div>

                      </td>

                      <td>

                        <span className="admin-roadmap-career-badge">

                          <Map size={12} />

                          {roadmap.career}

                        </span>

                      </td>

                      <td>

                        <div className="admin-roadmap-progress-cell">

                          <div>

                            <strong>
                              {roadmap.progress}%
                            </strong>

                            <span>
                              {
                                roadmap.completedSteps
                              }
                              /
                              {
                                roadmap.totalSteps
                              }
                            </span>

                          </div>

                          <div className="admin-roadmap-mini-bar">

                            <i
                              className={getProgressClass(
                                roadmap.progress
                              )}
                              style={{
                                width: `${roadmap.progress}%`,
                              }}
                            />

                          </div>

                        </div>

                      </td>

                      <td>

                        <span
                          className={`admin-roadmap-status ${roadmap.status.toLowerCase()}`}
                        >

                          <i></i>

                          {roadmap.status}

                        </span>

                      </td>

                      <td>

                        <div className="admin-roadmap-steps-count">

                          <CheckCircle
                            size={13}
                          />

                          {
                            roadmap.completedSteps
                          }
                          /
                          {
                            roadmap.totalSteps
                          }

                        </div>

                      </td>

                      <td>

                        <div className="admin-roadmap-updated">

                          <Clock
                            size={12}
                          />

                          {roadmap.updatedAt}

                        </div>

                      </td>

                      <td>

                        <button
                          className="admin-roadmap-view"
                          onClick={() =>
                            setSelectedRoadmap(
                              roadmap
                            )
                          }
                        >

                          <Eye size={14} />

                          View

                        </button>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="admin-roadmap-empty"
                  >

                    <Map size={30} />

                    <strong>
                      No roadmaps found
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

        {/* PAGINATION */}

        <div className="admin-roadmap-pagination">

          <span>

            Showing{" "}

            <strong>
              {filteredRoadmaps.length ===
              0
                ? 0
                : startIndex + 1}
            </strong>{" "}

            to{" "}

            <strong>
              {Math.min(
                startIndex +
                  roadmapsPerPage,
                filteredRoadmaps.length
              )}
            </strong>{" "}

            of{" "}

            <strong>
              {filteredRoadmaps.length}
            </strong>{" "}

            roadmaps

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

      {/* MODAL */}

      {selectedRoadmap && (
        <AdminRoadmapModal
          roadmap={
            selectedRoadmap
          }
          onClose={() =>
            setSelectedRoadmap(null)
          }
        />
      )}

    </div>
  );
};

export default AdminRoadmaps;