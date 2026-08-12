import React, { useMemo, useState } from "react";

import {
  Bot,
  MessageSquare,
  Users,
  Clock,
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Activity,
  Sparkles,
} from "lucide-react";

import AdminCoachModal from "../components/AdminCoachModal";

import "../styles/adminAICoach.css";

const AdminAICoach = () => {

  /* =====================================================
     STATE
  ===================================================== */

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [topicFilter, setTopicFilter] =
    useState("All");

  const [dateFilter, setDateFilter] =
    useState("All");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [selectedSession, setSelectedSession] =
    useState(null);

  const sessionsPerPage = 6;

  /* =====================================================
     DEMO DATA
  ===================================================== */

  const [sessions] = useState([
    {
      id: 1,
      user: "Yashvi Radariya",
      email: "yashvi@example.com",
      initials: "YR",
      topic: "Frontend Development",
      status: "Completed",
      date: "Aug 12, 2026",
      time: "10:42 AM",
      duration: "18 min",
      messages: 14,
      question:
        "What skills should I improve to become a better React developer?",
      answer:
        "You should focus on advanced React patterns, state management, performance optimization, testing and modern frontend architecture.",
      followUp:
        "Can you suggest a learning roadmap for these skills?",
      finalAnswer:
        "Start with advanced hooks and component architecture, then learn state management, React testing, performance optimization and finally build a production-level project.",
    },

    {
      id: 2,
      user: "Priya Shah",
      email: "priya@example.com",
      initials: "PS",
      topic: "Career Planning",
      status: "Completed",
      date: "Aug 12, 2026",
      time: "09:30 AM",
      duration: "24 min",
      messages: 19,
      question:
        "I am confused between UI/UX design and frontend development. Which career should I choose?",
      answer:
        "Both careers can be strong choices. Your decision should depend on whether you enjoy visual problem solving or building interactive applications.",
      followUp:
        "How can I decide which one is better for me?",
      finalAnswer:
        "Try small projects in both areas. Build one UI case study and one frontend application, then compare which type of work you enjoy more.",
    },

    {
      id: 3,
      user: "Rahul Patel",
      email: "rahul@example.com",
      initials: "RP",
      topic: "Resume Guidance",
      status: "Completed",
      date: "Aug 11, 2026",
      time: "06:20 PM",
      duration: "12 min",
      messages: 9,
      question:
        "How can I improve my resume for a full stack developer role?",
      answer:
        "Your resume should highlight measurable project results, relevant technologies, APIs, databases and deployment experience.",
      followUp:
        "Should I include every project I have created?",
      finalAnswer:
        "Focus on 2–4 strong projects that match the role. Explain the problem, technologies used, your contribution and measurable results.",
    },

    {
      id: 4,
      user: "Neha Patel",
      email: "neha@example.com",
      initials: "NP",
      topic: "Interview Preparation",
      status: "Active",
      date: "Aug 11, 2026",
      time: "04:15 PM",
      duration: "31 min",
      messages: 26,
      question:
        "What should I prepare for a data analyst interview?",
      answer:
        "Focus on SQL, Excel, statistics, data visualization, business cases and explaining your analysis clearly.",
      followUp:
        "Can you give me some SQL interview questions?",
      finalAnswer:
        "Practice joins, aggregations, subqueries, window functions, CTEs and analytical case studies.",
    },

    {
      id: 5,
      user: "Aarav Mehta",
      email: "aarav@example.com",
      initials: "AM",
      topic: "Backend Development",
      status: "Completed",
      date: "Aug 10, 2026",
      time: "03:45 PM",
      duration: "16 min",
      messages: 12,
      question:
        "What should I learn after Node.js and Express?",
      answer:
        "Next focus on database design, authentication, API architecture, testing, caching, security and deployment.",
      followUp:
        "Should I learn Docker now?",
      finalAnswer:
        "Yes, once you are comfortable building APIs. Docker will help you understand reproducible development and deployment environments.",
    },

    {
      id: 6,
      user: "Kavya Joshi",
      email: "kavya@example.com",
      initials: "KJ",
      topic: "Learning Roadmap",
      status: "Completed",
      date: "Aug 10, 2026",
      time: "01:22 PM",
      duration: "22 min",
      messages: 17,
      question:
        "Can you create a roadmap to become a software engineer?",
      answer:
        "Start with programming fundamentals, data structures, web development, databases, APIs, Git and system design.",
      followUp:
        "How long should I spend on each stage?",
      finalAnswer:
        "Spend more time on fundamentals and projects. A consistent 1–2 hour daily study schedule is more useful than rushing through topics.",
    },

    {
      id: 7,
      user: "Harsh Trivedi",
      email: "harsh@example.com",
      initials: "HT",
      topic: "React Development",
      status: "Completed",
      date: "Aug 09, 2026",
      time: "11:40 AM",
      duration: "14 min",
      messages: 10,
      question:
        "How do I improve my React projects?",
      answer:
        "Focus on reusable components, clean state management, accessibility, responsive UI and performance.",
      followUp:
        "What project should I build next?",
      finalAnswer:
        "Build a complete application with authentication, API integration, protected routes and a responsive dashboard.",
    },

    {
      id: 8,
      user: "Riya Desai",
      email: "riya@example.com",
      initials: "RD",
      topic: "UI/UX Career",
      status: "Active",
      date: "Aug 09, 2026",
      time: "10:12 AM",
      duration: "27 min",
      messages: 21,
      question:
        "What should my UI/UX portfolio contain?",
      answer:
        "Your portfolio should show strong case studies with research, wireframes, design decisions, iterations and final outcomes.",
      followUp:
        "How many case studies should I create?",
      finalAnswer:
        "Three strong case studies are usually better than many small projects. Make each one demonstrate a different type of design problem.",
    },

    {
      id: 9,
      user: "Meet Joshi",
      email: "meet@example.com",
      initials: "MJ",
      topic: "Python Development",
      status: "Completed",
      date: "Aug 08, 2026",
      time: "08:45 PM",
      duration: "10 min",
      messages: 8,
      question:
        "What should I learn after Python basics?",
      answer:
        "Choose a direction such as web development, automation, data science or AI and build projects around that direction.",
      followUp:
        "I want to become a backend developer.",
      finalAnswer:
        "Learn Python web frameworks, REST APIs, databases, authentication, testing and deployment.",
    },
  ]);

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredSessions = useMemo(() => {

    return sessions.filter((session) => {

      const searchMatch =
        session.user
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        session.email
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        session.topic
          .toLowerCase()
          .includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "All" ||
        session.status === statusFilter;

      const topicMatch =
        topicFilter === "All" ||
        session.topic === topicFilter;

      let dateMatch = true;

      if (dateFilter === "Today") {
        dateMatch =
          session.date === "Aug 12, 2026";
      }

      if (dateFilter === "Recent") {
        dateMatch =
          session.date !== "Aug 08, 2026";
      }

      return (
        searchMatch &&
        statusMatch &&
        topicMatch &&
        dateMatch
      );
    });

  }, [
    sessions,
    search,
    statusFilter,
    topicFilter,
    dateFilter,
  ]);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages = Math.ceil(
    filteredSessions.length /
      sessionsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    sessionsPerPage;

  const currentSessions =
    filteredSessions.slice(
      startIndex,
      startIndex + sessionsPerPage
    );

  /* =====================================================
     STATS
  ===================================================== */

  const totalSessions = sessions.length;

  const activeSessions = sessions.filter(
    (session) =>
      session.status === "Active"
  ).length;

  const totalMessages = sessions.reduce(
    (total, session) =>
      total + session.messages,
    0
  );

  const averageDuration = Math.round(
    sessions.reduce(
      (total, session) =>
        total +
        parseInt(session.duration),
      0
    ) / sessions.length
  );

  /* =====================================================
     HANDLERS
  ===================================================== */

  const updateSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const updateStatus = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const updateTopic = (value) => {
    setTopicFilter(value);
    setCurrentPage(1);
  };

  const updateDate = (value) => {
    setDateFilter(value);
    setCurrentPage(1);
  };

  return (
    <div className="admin-ai-coach-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-ai-coach-header">

        <div>

          <span className="admin-ai-coach-eyebrow">
            AI COACH MANAGEMENT
          </span>

          <h1>
            AI Career Coach
          </h1>

          <p>
            Monitor AI coaching sessions,
            user activity and career guidance.
          </p>

        </div>

        <div className="admin-ai-coach-live">

          <span></span>

          AI Coach System
          <strong>Online</strong>

        </div>

      </div>

      {/* =================================================
          STATS
      ================================================= */}

      <div className="admin-coach-stats">

        <div className="admin-coach-stat-card">

          <div className="admin-coach-stat-icon blue">
            <Bot size={19} />
          </div>

          <div>

            <span>Total Sessions</span>

            <strong>
              {totalSessions}
            </strong>

            <small>
              +12.5% this month
            </small>

          </div>

        </div>

        <div className="admin-coach-stat-card">

          <div className="admin-coach-stat-icon purple">
            <MessageSquare size={19} />
          </div>

          <div>

            <span>Total Messages</span>

            <strong>
              {totalMessages}
            </strong>

            <small>
              AI interactions
            </small>

          </div>

        </div>

        <div className="admin-coach-stat-card">

          <div className="admin-coach-stat-icon green">
            <Users size={19} />
          </div>

          <div>

            <span>Active Sessions</span>

            <strong>
              {activeSessions}
            </strong>

            <small>
              Currently using AI
            </small>

          </div>

        </div>

        <div className="admin-coach-stat-card">

          <div className="admin-coach-stat-icon orange">
            <Clock size={19} />
          </div>

          <div>

            <span>Avg. Duration</span>

            <strong>
              {averageDuration} min
            </strong>

            <small>
              Per session
            </small>

          </div>

        </div>

      </div>

      {/* =================================================
          AI USAGE OVERVIEW
      ================================================= */}

      <div className="admin-coach-overview-grid">

        {/* Usage Chart */}

        <div className="admin-coach-chart-card">

          <div className="admin-coach-card-header">

            <div>

              <span>
                AI USAGE
              </span>

              <h2>
                Weekly Coach Activity
              </h2>

            </div>

            <select>
              <option>
                Last 7 Days
              </option>

              <option>
                Last 30 Days
              </option>
            </select>

          </div>

          <div className="admin-coach-chart">

            <div className="admin-chart-y">
              <span>40</span>
              <span>30</span>
              <span>20</span>
              <span>10</span>
              <span>0</span>
            </div>

            <div className="admin-chart-area">

              <div className="admin-chart-grid-line one"></div>
              <div className="admin-chart-grid-line two"></div>
              <div className="admin-chart-grid-line three"></div>
              <div className="admin-chart-grid-line four"></div>

              <div className="admin-chart-bars">

                <div className="admin-chart-column">
                  <div
                    className="admin-chart-bar"
                    style={{ height: "42%" }}
                  ></div>
                  <span>Mon</span>
                </div>

                <div className="admin-chart-column">
                  <div
                    className="admin-chart-bar"
                    style={{ height: "64%" }}
                  ></div>
                  <span>Tue</span>
                </div>

                <div className="admin-chart-column">
                  <div
                    className="admin-chart-bar"
                    style={{ height: "51%" }}
                  ></div>
                  <span>Wed</span>
                </div>

                <div className="admin-chart-column">
                  <div
                    className="admin-chart-bar"
                    style={{ height: "79%" }}
                  ></div>
                  <span>Thu</span>
                </div>

                <div className="admin-chart-column">
                  <div
                    className="admin-chart-bar"
                    style={{ height: "91%" }}
                  ></div>
                  <span>Fri</span>
                </div>

                <div className="admin-chart-column">
                  <div
                    className="admin-chart-bar"
                    style={{ height: "72%" }}
                  ></div>
                  <span>Sat</span>
                </div>

                <div className="admin-chart-column">
                  <div
                    className="admin-chart-bar"
                    style={{ height: "58%" }}
                  ></div>
                  <span>Sun</span>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Topics */}

        <div className="admin-coach-topic-card">

          <div className="admin-coach-card-header">

            <div>

              <span>
                POPULAR TOPICS
              </span>

              <h2>
                Career Discussions
              </h2>

            </div>

            <Sparkles
              size={18}
            />

          </div>

          <div className="admin-topic-list">

            <div>
              <span>
                Frontend Development
              </span>

              <strong>32%</strong>

              <div>
                <i
                  style={{
                    width: "32%",
                  }}
                ></i>
              </div>
            </div>

            <div>
              <span>
                Career Planning
              </span>

              <strong>24%</strong>

              <div>
                <i
                  style={{
                    width: "24%",
                  }}
                ></i>
              </div>
            </div>

            <div>
              <span>
                Resume Guidance
              </span>

              <strong>18%</strong>

              <div>
                <i
                  style={{
                    width: "18%",
                  }}
                ></i>
              </div>
            </div>

            <div>
              <span>
                Interview Preparation
              </span>

              <strong>15%</strong>

              <div>
                <i
                  style={{
                    width: "15%",
                  }}
                ></i>
              </div>
            </div>

            <div>
              <span>
                Other
              </span>

              <strong>11%</strong>

              <div>
                <i
                  style={{
                    width: "11%",
                  }}
                ></i>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          SESSIONS TABLE
      ================================================= */}

      <div className="admin-coach-table-card">

        <div className="admin-coach-table-header">

          <div>

            <span>
              SESSION MONITOR
            </span>

            <h2>
              Recent AI Coach Sessions
            </h2>

          </div>

          <div className="admin-coach-total">

            <Activity size={14} />

            {filteredSessions.length} sessions

          </div>

        </div>

        {/* Filters */}

        <div className="admin-coach-toolbar">

          <div className="admin-coach-search">

            <Search size={16} />

            <input
              value={search}
              onChange={(e) =>
                updateSearch(
                  e.target.value
                )
              }
              placeholder="Search user, email or topic..."
            />

          </div>

          <div className="admin-coach-filters">

            <div className="admin-coach-filter">

              <Filter size={14} />

              <select
                value={statusFilter}
                onChange={(e) =>
                  updateStatus(
                    e.target.value
                  )
                }
              >
                <option value="All">
                  All Status
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Active">
                  Active
                </option>
              </select>

            </div>

            <select
              className="admin-coach-filter-select"
              value={topicFilter}
              onChange={(e) =>
                updateTopic(
                  e.target.value
                )
              }
            >
              <option value="All">
                All Topics
              </option>

              <option value="Frontend Development">
                Frontend Development
              </option>

              <option value="Career Planning">
                Career Planning
              </option>

              <option value="Resume Guidance">
                Resume Guidance
              </option>

              <option value="Interview Preparation">
                Interview Preparation
              </option>

              <option value="Backend Development">
                Backend Development
              </option>

              <option value="Learning Roadmap">
                Learning Roadmap
              </option>

              <option value="React Development">
                React Development
              </option>

              <option value="UI/UX Career">
                UI/UX Career
              </option>

              <option value="Python Development">
                Python Development
              </option>

            </select>

            <select
              className="admin-coach-filter-select"
              value={dateFilter}
              onChange={(e) =>
                updateDate(
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

        {/* Table */}

        <div className="admin-coach-table-wrapper">

          <table className="admin-coach-table">

            <thead>

              <tr>

                <th>User</th>

                <th>Topic</th>

                <th>Status</th>

                <th>Messages</th>

                <th>Duration</th>

                <th>Date</th>

                <th></th>

              </tr>

            </thead>

            <tbody>

              {currentSessions.length > 0 ? (

                currentSessions.map(
                  (session) => (

                    <tr key={session.id}>

                      {/* USER */}

                      <td>

                        <div className="admin-coach-table-user">

                          <div className="admin-coach-table-avatar">
                            {session.initials}
                          </div>

                          <div>

                            <strong>
                              {session.user}
                            </strong>

                            <span>
                              {session.email}
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* TOPIC */}

                      <td>

                        <span className="admin-coach-topic-badge">

                          <Bot size={12} />

                          {session.topic}

                        </span>

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={`admin-coach-status ${session.status.toLowerCase()}`}
                        >

                          <i></i>

                          {session.status}

                        </span>

                      </td>

                      {/* MESSAGES */}

                      <td>

                        <div className="admin-coach-messages-count">

                          <MessageSquare
                            size={13}
                          />

                          {session.messages}

                        </div>

                      </td>

                      {/* DURATION */}

                      <td>

                        <div className="admin-coach-duration">

                          <Clock
                            size={13}
                          />

                          {session.duration}

                        </div>

                      </td>

                      {/* DATE */}

                      <td>

                        <div className="admin-coach-date">

                          <strong>
                            {session.date}
                          </strong>

                          <span>
                            {session.time}
                          </span>

                        </div>

                      </td>

                      {/* VIEW */}

                      <td>

                        <button
                          className="admin-coach-view-button"
                          onClick={() =>
                            setSelectedSession(
                              session
                            )
                          }
                        >

                          <Eye size={15} />

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
                    className="admin-coach-empty"
                  >

                    <Bot size={30} />

                    <strong>
                      No sessions found
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

        {/* Pagination */}

        <div className="admin-coach-pagination">

          <span>

            Showing{" "}

            <strong>
              {filteredSessions.length === 0
                ? 0
                : startIndex + 1}
            </strong>

            {" "}to{" "}

            <strong>
              {Math.min(
                startIndex +
                  sessionsPerPage,
                filteredSessions.length
              )}
            </strong>

            {" "}of{" "}

            <strong>
              {filteredSessions.length}
            </strong>

            {" "}sessions

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

              <ChevronLeft size={15} />

            </button>

            {Array.from(
              {
                length:
                  totalPages,
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
                currentPage === totalPages ||
                totalPages === 0
              }
              onClick={() =>
                setCurrentPage(
                  currentPage + 1
                )
              }
            >

              <ChevronRight size={15} />

            </button>

          </div>

        </div>

      </div>

      {/* =================================================
          MODAL
      ================================================= */}

      {selectedSession && (

        <AdminCoachModal
          session={selectedSession}
          onClose={() =>
            setSelectedSession(null)
          }
        />

      )}

    </div>
  );
};

export default AdminAICoach;