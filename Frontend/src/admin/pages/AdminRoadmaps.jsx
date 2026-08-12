import React, {
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

import "../styles/adminRoadmaps.css";

const AdminRoadmaps = () => {

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [careerFilter, setCareerFilter] =
    useState("All");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [selectedRoadmap, setSelectedRoadmap] =
    useState(null);

  const roadmapsPerPage = 6;

  /* =====================================================
     DEMO DATA
  ===================================================== */

  const [roadmaps] = useState([
    {
      id: 1,
      user: "Yashvi Radariya",
      email: "yashvi@example.com",
      initials: "YR",
      career: "Frontend Developer",
      progress: 68,
      status: "Active",
      createdAt: "Aug 12, 2026",
      updatedAt: "Today",
      duration: "6 months",
      completedSteps: 4,
      totalSteps: 6,
      currentStep: 4,

      steps: [
        {
          title: "HTML & CSS",
          duration: "3 weeks",
          description:
            "Learn semantic HTML, responsive CSS and modern layouts.",
          completed: true,
        },
        {
          title: "JavaScript",
          duration: "5 weeks",
          description:
            "Master modern JavaScript, ES6+ and browser fundamentals.",
          completed: true,
        },
        {
          title: "React",
          duration: "6 weeks",
          description:
            "Learn components, hooks, routing and state management.",
          completed: true,
        },
        {
          title: "Advanced React",
          duration: "4 weeks",
          description:
            "Learn performance, architecture and advanced patterns.",
          completed: false,
        },
        {
          title: "Testing",
          duration: "2 weeks",
          description:
            "Learn frontend testing and quality practices.",
          completed: false,
        },
        {
          title: "Portfolio Project",
          duration: "4 weeks",
          description:
            "Build and deploy a production-level project.",
          completed: false,
        },
      ],
    },

    {
      id: 2,
      user: "Priya Shah",
      email: "priya@example.com",
      initials: "PS",
      career: "UI/UX Designer",
      progress: 42,
      status: "Active",
      createdAt: "Aug 11, 2026",
      updatedAt: "Yesterday",
      duration: "5 months",
      completedSteps: 2,
      totalSteps: 5,
      currentStep: 2,

      steps: [
        {
          title: "Design Fundamentals",
          duration: "3 weeks",
          description:
            "Learn color, typography, spacing and visual hierarchy.",
          completed: true,
        },
        {
          title: "Figma",
          duration: "4 weeks",
          description:
            "Learn professional interface design using Figma.",
          completed: true,
        },
        {
          title: "UX Research",
          duration: "4 weeks",
          description:
            "Learn user research and usability testing.",
          completed: false,
        },
        {
          title: "Case Studies",
          duration: "3 weeks",
          description:
            "Create detailed UX case studies.",
          completed: false,
        },
        {
          title: "Portfolio",
          duration: "3 weeks",
          description:
            "Build a professional design portfolio.",
          completed: false,
        },
      ],
    },

    {
      id: 3,
      user: "Rahul Patel",
      email: "rahul@example.com",
      initials: "RP",
      career: "Full Stack Developer",
      progress: 31,
      status: "Active",
      createdAt: "Aug 10, 2026",
      updatedAt: "2 days ago",
      duration: "8 months",
      completedSteps: 2,
      totalSteps: 7,
      currentStep: 2,

      steps: [
        {
          title: "JavaScript",
          duration: "5 weeks",
          description:
            "Learn modern JavaScript fundamentals.",
          completed: true,
        },
        {
          title: "React",
          duration: "6 weeks",
          description:
            "Learn frontend application development.",
          completed: true,
        },
        {
          title: "Node.js",
          duration: "5 weeks",
          description:
            "Build backend applications using Node.js.",
          completed: false,
        },
        {
          title: "Express APIs",
          duration: "3 weeks",
          description:
            "Build REST APIs and authentication.",
          completed: false,
        },
        {
          title: "MongoDB",
          duration: "4 weeks",
          description:
            "Learn database design and MongoDB.",
          completed: false,
        },
        {
          title: "Deployment",
          duration: "2 weeks",
          description:
            "Deploy full-stack applications.",
          completed: false,
        },
        {
          title: "Final Project",
          duration: "5 weeks",
          description:
            "Build a production-ready full-stack project.",
          completed: false,
        },
      ],
    },

    {
      id: 4,
      user: "Neha Patel",
      email: "neha@example.com",
      initials: "NP",
      career: "Data Analyst",
      progress: 84,
      status: "Active",
      createdAt: "Aug 09, 2026",
      updatedAt: "Yesterday",
      duration: "4 months",
      completedSteps: 5,
      totalSteps: 6,
      currentStep: 5,

      steps: [
        {
          title: "Excel",
          duration: "3 weeks",
          description:
            "Learn advanced Excel and data cleaning.",
          completed: true,
        },
        {
          title: "SQL",
          duration: "5 weeks",
          description:
            "Learn queries and relational databases.",
          completed: true,
        },
        {
          title: "Statistics",
          duration: "4 weeks",
          description:
            "Learn statistics for data analysis.",
          completed: true,
        },
        {
          title: "Power BI",
          duration: "4 weeks",
          description:
            "Build interactive dashboards.",
          completed: true,
        },
        {
          title: "Projects",
          duration: "3 weeks",
          description:
            "Complete practical data projects.",
          completed: true,
        },
        {
          title: "Job Preparation",
          duration: "2 weeks",
          description:
            "Prepare resume and interviews.",
          completed: false,
        },
      ],
    },

    {
      id: 5,
      user: "Aarav Mehta",
      email: "aarav@example.com",
      initials: "AM",
      career: "Backend Developer",
      progress: 100,
      status: "Completed",
      createdAt: "Aug 05, 2026",
      updatedAt: "Aug 10, 2026",
      duration: "5 months",
      completedSteps: 5,
      totalSteps: 5,
      currentStep: 5,

      steps: [
        {
          title: "Node.js",
          duration: "5 weeks",
          description:
            "Learn Node.js fundamentals.",
          completed: true,
        },
        {
          title: "Express",
          duration: "3 weeks",
          description:
            "Build REST APIs using Express.",
          completed: true,
        },
        {
          title: "MongoDB",
          duration: "4 weeks",
          description:
            "Learn database design.",
          completed: true,
        },
        {
          title: "Authentication",
          duration: "3 weeks",
          description:
            "Build secure authentication systems.",
          completed: true,
        },
        {
          title: "Deployment",
          duration: "3 weeks",
          description:
            "Deploy backend applications.",
          completed: true,
        },
      ],
    },

    {
      id: 6,
      user: "Kavya Joshi",
      email: "kavya@example.com",
      initials: "KJ",
      career: "Python Developer",
      progress: 52,
      status: "Active",
      createdAt: "Aug 04, 2026",
      updatedAt: "Aug 11, 2026",
      duration: "6 months",
      completedSteps: 3,
      totalSteps: 6,
      currentStep: 3,

      steps: [
        {
          title: "Python",
          duration: "5 weeks",
          description:
            "Learn Python fundamentals.",
          completed: true,
        },
        {
          title: "OOP",
          duration: "3 weeks",
          description:
            "Learn object-oriented programming.",
          completed: true,
        },
        {
          title: "Django",
          duration: "5 weeks",
          description:
            "Build web applications with Django.",
          completed: true,
        },
        {
          title: "REST APIs",
          duration: "3 weeks",
          description:
            "Build REST APIs.",
          completed: false,
        },
        {
          title: "Database",
          duration: "4 weeks",
          description:
            "Learn SQL and database design.",
          completed: false,
        },
        {
          title: "Deployment",
          duration: "2 weeks",
          description:
            "Deploy Python applications.",
          completed: false,
        },
      ],
    },

    {
      id: 7,
      user: "Harsh Trivedi",
      email: "harsh@example.com",
      initials: "HT",
      career: "Frontend Developer",
      progress: 100,
      status: "Completed",
      createdAt: "Aug 01, 2026",
      updatedAt: "Aug 08, 2026",
      duration: "5 months",
      completedSteps: 5,
      totalSteps: 5,
      currentStep: 5,

      steps: [
        {
          title: "HTML & CSS",
          duration: "3 weeks",
          description:
            "Learn frontend fundamentals.",
          completed: true,
        },
        {
          title: "JavaScript",
          duration: "5 weeks",
          description:
            "Master modern JavaScript.",
          completed: true,
        },
        {
          title: "React",
          duration: "6 weeks",
          description:
            "Build React applications.",
          completed: true,
        },
        {
          title: "Projects",
          duration: "5 weeks",
          description:
            "Build practical projects.",
          completed: true,
        },
        {
          title: "Job Preparation",
          duration: "3 weeks",
          description:
            "Prepare for frontend jobs.",
          completed: true,
        },
      ],
    },
  ]);

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredRoadmaps = useMemo(() => {
    return roadmaps.filter((roadmap) => {

      const searchMatch =
        roadmap.user
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        roadmap.email
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        roadmap.career
          .toLowerCase()
          .includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "All" ||
        roadmap.status === statusFilter;

      const careerMatch =
        careerFilter === "All" ||
        roadmap.career === careerFilter;

      return (
        searchMatch &&
        statusMatch &&
        careerMatch
      );
    });
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

  const totalRoadmaps = roadmaps.length;

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

  const averageProgress = Math.round(
    roadmaps.reduce(
      (sum, item) =>
        sum + item.progress,
      0
    ) / roadmaps.length
  );

  /* =====================================================
     HANDLERS
  ===================================================== */

  const getProgressClass = (progress) => {
    if (progress >= 80)
      return "high";

    if (progress >= 50)
      return "medium";

    return "low";
  };

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

            <div>
              <span>
                Frontend Developer
              </span>

              <strong>
                31%
              </strong>

              <div>
                <i
                  style={{
                    width: "31%",
                  }}
                />
              </div>
            </div>

            <div>
              <span>
                Full Stack Developer
              </span>

              <strong>
                24%
              </strong>

              <div>
                <i
                  style={{
                    width: "24%",
                  }}
                />
              </div>
            </div>

            <div>
              <span>
                Data Analyst
              </span>

              <strong>
                18%
              </strong>

              <div>
                <i
                  style={{
                    width: "18%",
                  }}
                />
              </div>
            </div>

            <div>
              <span>
                UI/UX Designer
              </span>

              <strong>
                15%
              </strong>

              <div>
                <i
                  style={{
                    width: "15%",
                  }}
                />
              </div>
            </div>

            <div>
              <span>
                Other
              </span>

              <strong>
                12%
              </strong>

              <div>
                <i
                  style={{
                    width: "12%",
                  }}
                />
              </div>
            </div>

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

              {currentRoadmaps.length > 0 ? (
                currentRoadmaps.map(
                  (roadmap) => (

                    <tr key={roadmap.id}>

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
                              {roadmap.completedSteps}/
                              {roadmap.totalSteps}
                            </span>

                          </div>

                          <div className="admin-roadmap-mini-bar">

                            <i
                              className={
                                getProgressClass(
                                  roadmap.progress
                                )
                              }
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

                          {roadmap.completedSteps}/
                          {roadmap.totalSteps}

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
              {filteredRoadmaps.length === 0
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

      {/* MODAL */}

      {selectedRoadmap && (
        <AdminRoadmapModal
          roadmap={selectedRoadmap}
          onClose={() =>
            setSelectedRoadmap(null)
          }
        />
      )}

    </div>
  );
};

export default AdminRoadmaps;