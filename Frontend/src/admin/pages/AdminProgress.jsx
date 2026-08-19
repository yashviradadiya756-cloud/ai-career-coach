import React, { useEffect, useMemo, useState } from "react";

import {
  TrendingUp,
  Users,
  FileText,
  BookOpen,
  Map,
  Mic,
  RefreshCw,
  CalendarDays,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { getAdminProgress } from "../../api/adminApi";

import "../styles/adminProgress.css";

const AdminProgress = () => {
  // ==========================================
  // STATE
  // ==========================================

  const [progress, setProgress] = useState([]);

  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("progress");

  const currentYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] =
    useState(currentYear);

  const [selectedMonth, setSelectedMonth] =
    useState("all");

  const [error, setError] = useState("");

  // ==========================================
  // LOAD DATA
  // ==========================================

  const loadProgress = async () => {
    try {
      setError("");

      console.log("=================================");
      console.log("ADMIN PROGRESS");
      console.log("=================================");

      const response = await getAdminProgress();

      console.log(
        "ADMIN PROGRESS RESPONSE:",
        response
      );

      console.log(
        "ADMIN PROGRESS DATA:",
        response?.progress
      );

      const formattedData =
        Array.isArray(response?.progress)
          ? response.progress
          : [];

      console.log(
        "FORMATTED ADMIN PROGRESS:",
        formattedData
      );

      setProgress(formattedData);
    } catch (error) {
      console.error(
        "ADMIN PROGRESS ERROR:",
        error.response?.data || error
      );

      setProgress([]);

      setError(
        error.response?.data?.message ||
          "Unable to load progress data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  // ==========================================
  // YEARS
  // ==========================================

  const years = useMemo(() => {
    const yearSet = new Set();

    progress.forEach((item) => {
      if (item.updatedAt) {
        yearSet.add(
          new Date(item.updatedAt).getFullYear()
        );
      }

      if (item.createdAt) {
        yearSet.add(
          new Date(item.createdAt).getFullYear()
        );
      }
    });

    yearSet.add(currentYear);

    return Array.from(yearSet).sort(
      (a, b) => b - a
    );
  }, [progress, currentYear]);

  // ==========================================
  // FILTER DATA
  // ==========================================

  const filteredProgress = useMemo(() => {
    return progress.filter((item) => {
      const date = new Date(
        item.updatedAt || item.createdAt
      );

      const yearMatch =
        date.getFullYear() ===
        Number(selectedYear);

      const monthMatch =
        selectedMonth === "all" ||
        date.getMonth() ===
          Number(selectedMonth);

      return yearMatch && monthMatch;
    });
  }, [
    progress,
    selectedYear,
    selectedMonth,
  ]);

  // ==========================================
  // MONTHLY CHART
  // ==========================================

  const monthlyData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return months.map((month, index) => {
      const monthRecords = progress.filter(
        (item) => {
          const date = new Date(
            item.updatedAt || item.createdAt
          );

          return (
            date.getFullYear() ===
              Number(selectedYear) &&
            date.getMonth() === index
          );
        }
      );

      const average = (field) => {
        if (!monthRecords.length) return 0;

        const total = monthRecords.reduce(
          (sum, item) =>
            sum + Number(item[field] || 0),
          0
        );

        return Math.round(
          total / monthRecords.length
        );
      };

      return {
        month,

        overall: average(
          "overallProgress"
        ),

        resume: average("resumeScore"),

        learning: average(
          "learningCompleted"
        ),

        roadmap: average(
          "roadmapCompleted"
        ),

        interview: average(
          "interviewScore"
        ),

        users: monthRecords.length,
      };
    });
  }, [progress, selectedYear]);

  // ==========================================
  // SUMMARY
  // ==========================================

  const summary = useMemo(() => {
    const records = filteredProgress;

    if (!records.length) {
      return {
        overall: 0,
        resume: 0,
        learning: 0,
        roadmap: 0,
        interview: 0,
        users: 0,
      };
    }

    const average = (field) => {
      const total = records.reduce(
        (sum, item) =>
          sum + Number(item[field] || 0),
        0
      );

      return Math.round(
        total / records.length
      );
    };

    return {
      overall: average("overallProgress"),

      resume: average("resumeScore"),

      learning: average(
        "learningCompleted"
      ),

      roadmap: average(
        "roadmapCompleted"
      ),

      interview: average(
        "interviewScore"
      ),

      users: records.length,
    };
  }, [filteredProgress]);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-progress-page">
        <div className="progress-loading">
          <RefreshCw
            size={28}
            className="spin"
          />

          <p>
            Loading user progress...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="admin-progress-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="progress-page-header">

        <div>
          <div className="progress-title-row">

            <div className="progress-title-icon">
              <TrendingUp size={24} />
            </div>

            <div>
              <h1>Progress</h1>

              <p>
                Monitor career development
                progress and user activity.
              </p>
            </div>

          </div>
        </div>

        <button
          className="refresh-progress-btn"
          onClick={loadProgress}
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>

      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="progress-error">
          {error}
        </div>
      )}

      {/* ======================================
          PROGRESS TABS
      ====================================== */}

      <div className="progress-tabs-card">

        <div className="progress-tabs">

          {/* PROGRESS TAB */}

          <button
            type="button"
            className={`progress-tab ${
              activeTab === "progress"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("progress")
            }
          >
            <TrendingUp size={18} />

            <div>
              <strong>Progress</strong>

              <span>
                Overall progress analytics
              </span>
            </div>
          </button>

          {/* USER PROGRESS TAB */}

          <button
            type="button"
            className={`progress-tab ${
              activeTab === "user-progress"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("user-progress")
            }
          >
            <Users size={18} />

            <div>
              <strong>User Progress</strong>

              <span>
                Individual user progress
              </span>
            </div>
          </button>

        </div>

      </div>

      {/* ======================================
          PROGRESS TAB
      ====================================== */}

      {activeTab === "progress" && (
        <div className="progress-tab-content">

          {/* ====================================
              FILTERS
          ==================================== */}

          <div className="progress-filter-card">

            <div className="filter-heading">

              <CalendarDays size={19} />

              <div>
                <strong>
                  Progress Period
                </strong>

                <span>
                  Select year and month
                </span>
              </div>

            </div>

            <div className="filter-controls">

              <select
                value={selectedYear}
                onChange={(e) =>
                  setSelectedYear(
                    e.target.value
                  )
                }
              >
                {years.map((year) => (
                  <option
                    key={year}
                    value={year}
                  >
                    {year}
                  </option>
                ))}
              </select>

              <select
                value={selectedMonth}
                onChange={(e) =>
                  setSelectedMonth(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Months
                </option>

                <option value="0">
                  January
                </option>

                <option value="1">
                  February
                </option>

                <option value="2">
                  March
                </option>

                <option value="3">
                  April
                </option>

                <option value="4">
                  May
                </option>

                <option value="5">
                  June
                </option>

                <option value="6">
                  July
                </option>

                <option value="7">
                  August
                </option>

                <option value="8">
                  September
                </option>

                <option value="9">
                  October
                </option>

                <option value="10">
                  November
                </option>

                <option value="11">
                  December
                </option>
              </select>

            </div>

          </div>

          {/* ====================================
              SUMMARY CARDS
          ==================================== */}

          <div className="progress-summary-grid">

            {/* OVERALL */}

            <div className="progress-summary-card">

              <div className="summary-icon overall">
                <TrendingUp size={20} />
              </div>

              <div>
                <span>
                  Overall Progress
                </span>

                <strong>
                  {summary.overall}%
                </strong>
              </div>

            </div>

            {/* RESUME */}

            <div className="progress-summary-card">

              <div className="summary-icon resume">
                <FileText size={20} />
              </div>

              <div>
                <span>
                  Resume Score
                </span>

                <strong>
                  {summary.resume}%
                </strong>
              </div>

            </div>

            {/* LEARNING */}

            <div className="progress-summary-card">

              <div className="summary-icon learning">
                <BookOpen size={20} />
              </div>

              <div>
                <span>
                  Learning
                </span>

                <strong>
                  {summary.learning}%
                </strong>
              </div>

            </div>

            {/* ROADMAP */}

            <div className="progress-summary-card">

              <div className="summary-icon roadmap">
                <Map size={20} />
              </div>

              <div>
                <span>
                  Roadmap
                </span>

                <strong>
                  {summary.roadmap}%
                </strong>
              </div>

            </div>

            {/* INTERVIEW */}

            <div className="progress-summary-card">

              <div className="summary-icon interview">
                <Mic size={20} />
              </div>

              <div>
                <span>
                  Interview
                </span>

                <strong>
                  {summary.interview}%
                </strong>
              </div>

            </div>

            {/* USERS */}

            <div className="progress-summary-card">

              <div className="summary-icon users">
                <Users size={20} />
              </div>

              <div>
                <span>
                  Active Records
                </span>

                <strong>
                  {summary.users}
                </strong>
              </div>

            </div>

          </div>

          {/* ====================================
              MONTHLY PROGRESS
          ==================================== */}

          <div className="chart-card">

            <div className="chart-header">

              <div>
                <h2>
                  Monthly Progress
                </h2>

                <p>
                  Average user progress for{" "}
                  {selectedYear}
                </p>
              </div>

            </div>

            <div className="chart-container">

              <ResponsiveContainer
                width="100%"
                height={360}
              >
                <LineChart
                  data={monthlyData}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="month"
                  />

                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(value) =>
                      `${value}%`
                    }
                  />

                  <Tooltip
                    formatter={(value) =>
                      `${value}%`
                    }
                  />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="overall"
                    name="Overall"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="resume"
                    name="Resume"
                    strokeWidth={2}
                  />

                  <Line
                    type="monotone"
                    dataKey="learning"
                    name="Learning"
                    strokeWidth={2}
                  />

                  <Line
                    type="monotone"
                    dataKey="roadmap"
                    name="Roadmap"
                    strokeWidth={2}
                  />

                  <Line
                    type="monotone"
                    dataKey="interview"
                    name="Interview"
                    strokeWidth={2}
                  />

                </LineChart>
              </ResponsiveContainer>

            </div>

          </div>

          {/* ====================================
              MONTHLY ACTIVE USERS
          ==================================== */}

          <div className="chart-card">

            <div className="chart-header">

              <div>
                <h2>
                  Monthly Active Users
                </h2>

                <p>
                  Number of progress records
                  updated each month
                </p>
              </div>

            </div>

            <div className="chart-container">

              <ResponsiveContainer
                width="100%"
                height={320}
              >
                <BarChart
                  data={monthlyData}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="month"
                  />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="users"
                    name="Users"
                    radius={[
                      7,
                      7,
                      0,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>
      )}

      {/* ======================================
          USER PROGRESS TAB
      ====================================== */}

      {activeTab === "user-progress" && (
        <div className="user-progress-tab-content">

          {/* ====================================
              USER PROGRESS HEADER
          ==================================== */}

          <div className="progress-table-card">

            <div className="table-header">

              <div>
                <h2>
                  User Progress Details
                </h2>

                <p>
                  Showing records for{" "}
                  {selectedMonth === "all"
                    ? `all months of ${selectedYear}`
                    : `${new Date(
                        selectedYear,
                        selectedMonth
                      ).toLocaleString(
                        "en-IN",
                        {
                          month: "long",
                        }
                      )} ${selectedYear}`}
                </p>
              </div>

              <span className="record-count">
                {filteredProgress.length} Records
              </span>

            </div>

            {/* ==================================
                USER PROGRESS EMPTY STATE
            ================================== */}

            {filteredProgress.length === 0 ? (

              <div className="no-progress">

                <TrendingUp size={40} />

                <h3>
                  No progress records
                </h3>

                <p>
                  No user progress data is
                  available for this period.
                </p>

              </div>

            ) : (

              <div className="table-wrapper">

                <table className="progress-table">

                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Overall</th>
                      <th>Resume</th>
                      <th>Learning</th>
                      <th>Roadmap</th>
                      <th>Interview</th>
                      <th>Last Updated</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredProgress.map(
                      (item) => {

                        const user =
                          item.user;

                        return (
                          <tr
                            key={item._id}
                          >

                            {/* USER */}

                            <td>

                              <div className="user-cell">

                                <div className="user-avatar">

                                  {user?.name
                                    ?.charAt(0)
                                    ?.toUpperCase() ||
                                    "U"}

                                </div>

                                <div>

                                  <strong>
                                    {user?.name ||
                                      "Unknown User"}
                                  </strong>

                                  <span>
                                    {user?.email ||
                                      "-"}
                                  </span>

                                </div>

                              </div>

                            </td>

                            {/* OVERALL */}

                            <td>

                              <ProgressValue
                                value={
                                  item.overallProgress
                                }
                                primary
                              />

                            </td>

                            {/* RESUME */}

                            <td>

                              <ProgressValue
                                value={
                                  item.resumeScore
                                }
                              />

                            </td>

                            {/* LEARNING */}

                            <td>

                              <ProgressValue
                                value={
                                  item.learningCompleted
                                }
                              />

                            </td>

                            {/* ROADMAP */}

                            <td>

                              <ProgressValue
                                value={
                                  item.roadmapCompleted
                                }
                              />

                            </td>

                            {/* INTERVIEW */}

                            <td>

                              <ProgressValue
                                value={
                                  item.interviewScore
                                }
                              />

                            </td>

                            {/* DATE */}

                            <td>
                              {formatDate(
                                item.updatedAt
                              )}
                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>
      )}

    </div>
  );
};

// ==========================================
// PROGRESS VALUE
// ==========================================

const ProgressValue = ({
  value,
  primary = false,
}) => {
  const number = Number(value || 0);

  return (
    <div
      className={`progress-value ${
        primary
          ? "primary-progress"
          : ""
      }`}
    >

      <div className="progress-value-top">

        <span>
          {number}%
        </span>

      </div>

      <div className="mini-progress">

        <div
          className="mini-progress-fill"
          style={{
            width: `${Math.min(
              100,
              Math.max(0, number)
            )}%`,
          }}
        />

      </div>

    </div>
  );
};

export default AdminProgress;