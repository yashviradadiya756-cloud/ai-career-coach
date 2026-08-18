import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Users,
  Brain,
  CreditCard,
  Activity,
  RefreshCw,
  Download,
  FileText,
  Target,
  Map,
  Mic,
  Database,
  Server,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  BarChart3,
} from "lucide-react";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getAdminDashboard } from "../../api/adminApi";

import "../styles/adminDashboard.css";

const EMPTY_DATA = {
  stats: {},
  userGrowth: [],
  aiUsage: [],
  popularRoles: [],
  recentUsers: [],
  recentActivity: [],
  platformHealth: {},
};

const AdminDashboard = () => {
  const [data, setData] =
    useState(EMPTY_DATA);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [range, setRange] =
    useState("12m");

  /* =====================================================
     LOAD
  ===================================================== */

  const loadDashboard = useCallback(
    async (selectedRange = range) => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getAdminDashboard(
            selectedRange
          );

        console.log(
          "ADMIN DASHBOARD:",
          response
        );

        if (!response?.success) {
          throw new Error(
            response?.message ||
              "Dashboard request failed"
          );
        }

        setData({
          stats:
            response.stats || {},

          userGrowth:
            Array.isArray(
              response.userGrowth
            )
              ? response.userGrowth
              : [],

          aiUsage:
            Array.isArray(
              response.aiUsage
            )
              ? response.aiUsage
              : [],

          popularRoles:
            Array.isArray(
              response.popularRoles
            )
              ? response.popularRoles
              : [],

          recentUsers:
            Array.isArray(
              response.recentUsers
            )
              ? response.recentUsers
              : [],

          recentActivity:
            Array.isArray(
              response.recentActivity
            )
              ? response.recentActivity
              : [],

          platformHealth:
            response.platformHealth ||
            {},
        });
      } catch (err) {
        console.error(
          "Dashboard error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    },
    [range]
  );

  useEffect(() => {
    loadDashboard("12m");
  }, []);

  /* =====================================================
     RANGE CHANGE
  ===================================================== */

  const handleRangeChange = (e) => {
    const newRange = e.target.value;

    setRange(newRange);

    loadDashboard(newRange);
  };

  /* =====================================================
     NORMALIZE USER GROWTH
  ===================================================== */

  const userGrowthData = useMemo(() => {
    return data.userGrowth
      .map((item) => ({
        month:
          item.month ||
          item.label ||
          item._id ||
          "Unknown",

        users: Number(
          item.users ||
            item.count ||
            item.value ||
            0
        ),
      }))
      .filter(
        (item) =>
          item.month !== "Unknown"
      );
  }, [data.userGrowth]);

  /* =====================================================
     NORMALIZE AI DATA
  ===================================================== */

  const aiUsageData = useMemo(() => {
    return data.aiUsage
      .map((item) => ({
        name:
          item.name ||
          item.label ||
          item._id ||
          "AI Feature",

        value: Number(
          item.value ||
            item.count ||
            item.total ||
            0
        ),
      }))
      .filter(
        (item) =>
          item.value >= 0
      );
  }, [data.aiUsage]);

  /* =====================================================
     AI TOTAL
  ===================================================== */

  const aiTotal = useMemo(() => {
    return aiUsageData.reduce(
      (total, item) =>
        total + item.value,
      0
    );
  }, [aiUsageData]);

  /* =====================================================
     FORMAT CURRENCY
  ===================================================== */

  const formatCurrency = (value) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(Number(value) || 0);
  };

  /* =====================================================
     DATE
  ===================================================== */

  const formatDate = (date) => {
    if (!date) return "-";

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return "-";
    }

    return parsed.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =====================================================
     ACTIVITY TIME
  ===================================================== */

  const formatActivityTime = (
    date
  ) => {
    if (!date) return "";

    const difference =
      Date.now() -
      new Date(date).getTime();

    if (difference < 0) {
      return "Just now";
    }

    const minutes = Math.floor(
      difference / 60000
    );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours} hr ago`;
    }

    return `${Math.floor(
      hours / 24
    )} days ago`;
  };

  /* =====================================================
     ROLE MAX
  ===================================================== */

  const roleMax = useMemo(() => {
    return Math.max(
      ...data.popularRoles.map(
        (role) =>
          Number(
            role.users ||
              role.count ||
              0
          )
      ),
      1
    );
  }, [data.popularRoles]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="dashboard-loading-card">
          <div className="admin-dashboard-spinner" />

          <h3>
            Loading CareerPilot
            Analytics
          </h3>

          <p>
            Preparing your admin
            dashboard...
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
      <div className="admin-dashboard-error">
        <div className="dashboard-error-card">
          <div className="error-icon">
            <AlertCircle size={28} />
          </div>

          <h2>
            Dashboard unavailable
          </h2>

          <p>{error}</p>

          <button
            onClick={() =>
              loadDashboard(range)
            }
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="admin-dashboard">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="dashboard-hero">

        <div className="hero-content">

          <div className="hero-badge">
            <Sparkles size={12} />
            CAREERPILOT ADMIN
          </div>

          <h1>
            Dashboard
            <span> Overview</span>
          </h1>

          <p>
            Monitor users, AI activity,
            revenue and platform
            performance from one place.
          </p>

        </div>

        <div className="dashboard-header-actions">

          <select
            value={range}
            onChange={
              handleRangeChange
            }
            className="dashboard-range"
          >
            <option value="12m">
              Last 12 months
            </option>

            <option value="30d">
              Last 30 days
            </option>

            <option value="7d">
              Last 7 days
            </option>
          </select>

          <button
            className="dashboard-export"
            onClick={() =>
              window.print()
            }
          >
            <Download size={15} />
            Export
          </button>

          <button
            className="dashboard-refresh"
            onClick={() =>
              loadDashboard(range)
            }
            title="Refresh dashboard"
          >
            <RefreshCw size={15} />
          </button>

        </div>

      </section>

      {/* =================================================
          KPI
      ================================================= */}

      <section className="dashboard-kpi-grid">

        <div className="dashboard-kpi-card users-card">
          <div className="kpi-top">
            <div className="kpi-icon">
              <Users size={19} />
            </div>

            <span className="kpi-pill">
              +{data.stats.userGrowthPercentage || 0}%
            </span>
          </div>

          <span className="kpi-label">
            Total Users
          </span>

          <strong className="kpi-value">
            {data.stats.totalUsers || 0}
          </strong>

          <div className="kpi-footer">
            <TrendingUp size={12} />
            Registered accounts
          </div>
        </div>

        <div className="dashboard-kpi-card ai-card">
          <div className="kpi-top">
            <div className="kpi-icon">
              <Brain size={19} />
            </div>

            <span className="kpi-pill">
              AI
            </span>
          </div>

          <span className="kpi-label">
            AI Analyses
          </span>

          <strong className="kpi-value">
            {aiTotal}
          </strong>

          <div className="kpi-footer">
            <Brain size={12} />
            AI-powered features
          </div>
        </div>

        <div className="dashboard-kpi-card revenue-card">
          <div className="kpi-top">
            <div className="kpi-icon">
              <CreditCard size={19} />
            </div>

            <span className="kpi-pill">
              PRO
            </span>
          </div>

          <span className="kpi-label">
            Total Revenue
          </span>

          <strong className="kpi-value">
            {formatCurrency(
              data.stats.revenue
            )}
          </strong>

          <div className="kpi-footer">
            <CreditCard size={12} />
            Successful payments
          </div>
        </div>

        <div className="dashboard-kpi-card active-card">
          <div className="kpi-top">
            <div className="kpi-icon">
              <Activity size={19} />
            </div>

            <span className="kpi-pill">
              LIVE
            </span>
          </div>

          <span className="kpi-label">
            Active Users
          </span>

          <strong className="kpi-value">
            {data.stats.activeUsers || 0}
          </strong>

          <div className="kpi-footer">
            <Activity size={12} />
            Recently active
          </div>
        </div>

      </section>

      {/* =================================================
          CHARTS
      ================================================= */}

      <section className="dashboard-main-grid">

        {/* USER GROWTH */}

        <div className="dashboard-panel chart-panel">

          <div className="panel-header">

            <div>
              <div className="panel-title-row">
                <div className="panel-title-icon purple">
                  <BarChart3 size={15} />
                </div>

                <h2>
                  User Growth
                </h2>
              </div>

              <p>
                New registered users
                over time
              </p>
            </div>

            <div className="chart-total">
              <strong>
                {userGrowthData.reduce(
                  (sum, item) =>
                    sum + item.users,
                  0
                )}
              </strong>

              <span>
                users
              </span>
            </div>

          </div>

          <div className="chart-container">

            {userGrowthData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={
                    userGrowthData
                  }
                  margin={{
                    top: 10,
                    right: 10,
                    left: -15,
                    bottom: 0,
                  }}
                >

                  <defs>
                    <linearGradient
                      id="userGrowthGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#6d5dfc"
                        stopOpacity={0.35}
                      />

                      <stop
                        offset="100%"
                        stopColor="#6d5dfc"
                        stopOpacity={0.03}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="#eef0f6"
                    strokeDasharray="4 4"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fill: "#9ba2b0",
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    tick={{
                      fontSize: 10,
                      fill: "#9ba2b0",
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      border: "1px solid #e7e9f0",
                      borderRadius: "10px",
                      background: "#fff",
                      boxShadow:
                        "0 8px 30px rgba(20,25,40,.10)",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#6d5dfc"
                    strokeWidth={3}
                    fill="url(#userGrowthGradient)"
                    activeDot={{
                      r: 5,
                    }}
                  />

                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">
                <BarChart3 size={28} />

                <strong>
                  No user growth data
                </strong>

                <span>
                  New registrations will
                  appear here.
                </span>
              </div>
            )}

          </div>

        </div>

        {/* AI USAGE */}

        <div className="dashboard-panel chart-panel">

          <div className="panel-header">

            <div>
              <div className="panel-title-row">
                <div className="panel-title-icon green">
                  <Brain size={15} />
                </div>

                <h2>
                  AI Feature Usage
                </h2>
              </div>

              <p>
                CareerPilot AI activity
              </p>
            </div>

            <span className="live-indicator">
              <i />
              Live
            </span>

          </div>

          <div className="ai-chart">

            {aiUsageData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={
                    aiUsageData
                  }
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    horizontal={false}
                    stroke="#eef0f6"
                  />

                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    tick={{
                      fontSize: 9,
                      fill: "#9ba2b0",
                    }}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={95}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 9,
                      fill: "#626b7c",
                    }}
                  />

                  <Tooltip
                    cursor={{
                      fill: "#f5f6fb",
                    }}
                    contentStyle={{
                      border: "1px solid #e7e9f0",
                      borderRadius: "10px",
                      background: "#fff",
                    }}
                  />

                  <Bar
                    dataKey="value"
                    fill="#18a77d"
                    radius={[
                      0,
                      7,
                      7,
                      0,
                    ]}
                    barSize={19}
                  />

                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">
                <Brain size={28} />

                <strong>
                  No AI activity
                </strong>

                <span>
                  AI usage will appear
                  here.
                </span>
              </div>
            )}

          </div>

        </div>

      </section>

      {/* =================================================
          LOWER GRID
      ================================================= */}

      <section className="dashboard-lower-grid">

        {/* POPULAR ROLES */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <div className="panel-title-row">
                <div className="panel-title-icon orange">
                  <Target size={15} />
                </div>

                <h2>
                  Popular Career Roles
                </h2>
              </div>

              <p>
                Most selected career goals
              </p>
            </div>
          </div>

          <div className="role-list">

            {data.popularRoles.length === 0 ? (
              <div className="chart-empty small">
                <Target size={24} />

                <span>
                  No career role data
                </span>
              </div>
            ) : (
              data.popularRoles.map(
                (role, index) => {
                  const users =
                    Number(
                      role.users ||
                        role.count ||
                        0
                    );

                  const percentage =
                    (users /
                      roleMax) *
                    100;

                  return (
                    <div
                      className="role-item"
                      key={
                        role._id ||
                        index
                      }
                    >
                      <div className="role-top">

                        <div className="role-name">
                          <span>
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <strong>
                            {role._id ||
                              role.name ||
                              "Unknown Role"}
                          </strong>
                        </div>

                        <b>
                          {users}
                        </b>

                      </div>

                      <div className="role-bar">
                        <span
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )
            )}

          </div>

        </div>

        {/* ACTIVITY */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <div className="panel-title-row">
                <div className="panel-title-icon blue">
                  <Activity size={15} />
                </div>

                <h2>
                  Recent Activity
                </h2>
              </div>

              <p>
                Latest platform events
              </p>
            </div>

            <span className="activity-count">
              {data.recentActivity.length}
            </span>

          </div>

          <div className="activity-list">

            {data.recentActivity.length ===
            0 ? (
              <div className="chart-empty small">
                <Activity size={24} />

                <span>
                  No recent activity
                </span>
              </div>
            ) : (
              data.recentActivity.map(
                (item, index) => (
                  <div
                    className="activity-item"
                    key={index}
                  >
                    <div
                      className={`activity-dot ${
                        item.type ||
                        "default"
                      }`}
                    />

                    <div className="activity-content">
                      <strong>
                        {item.title}
                      </strong>

                      <span>
                        {item.description}
                      </span>
                    </div>

                    <small>
                      {formatActivityTime(
                        item.createdAt
                      )}
                    </small>
                  </div>
                )
              )
            )}

          </div>

        </div>

      </section>

      {/* =================================================
          USERS + HEALTH
      ================================================= */}

      <section className="dashboard-bottom-grid">

        {/* RECENT USERS */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <div className="panel-title-row">
                <div className="panel-title-icon blue">
                  <Users size={15} />
                </div>

                <h2>
                  Recent Users
                </h2>
              </div>

              <p>
                Latest registered users
              </p>
            </div>

            <Users size={17} />
          </div>

          <div className="recent-users">

            {data.recentUsers.length ===
            0 ? (
              <div className="chart-empty small">
                <Users size={24} />

                <span>
                  No users found
                </span>
              </div>
            ) : (
              data.recentUsers.map(
                (user) => (
                  <div
                    className="recent-user"
                    key={user._id}
                  >
                    <div className="user-avatar">
                      {(
                        user.name ||
                        user.username ||
                        "U"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="user-info">
                      <strong>
                        {user.name ||
                          user.username ||
                          "User"}
                      </strong>

                      <span>
                        {user.email ||
                          "No email"}
                      </span>
                    </div>

                    <div className="user-date">
                      {formatDate(
                        user.createdAt
                      )}
                    </div>
                  </div>
                )
              )
            )}

          </div>

        </div>

        {/* HEALTH */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <div className="panel-title-row">
                <div className="panel-title-icon green">
                  <ShieldCheck size={15} />
                </div>

                <h2>
                  System Health
                </h2>
              </div>

              <p>
                CareerPilot services
              </p>
            </div>

            <span className="system-online">
              Operational
            </span>
          </div>

          <div className="health-list">

            <div className="health-item">
              <div>
                <span className="health-icon">
                  <Activity
                    size={14}
                  />
                </span>

                <strong>
                  Backend API
                </strong>
              </div>

              <span className="health-status">
                <CheckCircle2
                  size={14}
                />

                {data.platformHealth
                  .api ||
                  "Online"}
              </span>
            </div>

            <div className="health-item">
              <div>
                <span className="health-icon">
                  <Database
                    size={14}
                  />
                </span>

                <strong>
                  MongoDB
                </strong>
              </div>

              <span className="health-status">
                <CheckCircle2
                  size={14}
                />

                {data.platformHealth
                  .database ||
                  "Connected"}
              </span>
            </div>

            <div className="health-item">
              <div>
                <span className="health-icon">
                  <Brain
                    size={14}
                  />
                </span>

                <strong>
                  Gemini AI
                </strong>
              </div>

              <span className="health-status">
                <CheckCircle2
                  size={14}
                />

                {data.platformHealth
                  .ai ||
                  "Available"}
              </span>
            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          MODULE SUMMARY
      ================================================= */}

      <section className="dashboard-module-strip">

        <div>
          <FileText size={17} />

          <span>
            Resumes
          </span>

          <strong>
            {data.stats.totalResumes ||
              0}
          </strong>
        </div>

        <div>
          <Map size={17} />

          <span>
            Roadmaps
          </span>

          <strong>
            {data.stats.totalRoadmaps ||
              0}
          </strong>
        </div>

        <div>
          <Target size={17} />

          <span>
            Skill Gaps
          </span>

          <strong>
            {data.stats.totalSkillGaps ||
              0}
          </strong>
        </div>

        <div>
          <Mic size={17} />

          <span>
            Interviews
          </span>

          <strong>
            {data.stats.totalInterviews ||
              0}
          </strong>
        </div>

        <div>
          <CreditCard size={17} />

          <span>
            Payments
          </span>

          <strong>
            {data.stats.totalPayments ||
              0}
          </strong>
        </div>

        <div>
          <Activity size={17} />

          <span>
            Progress
          </span>

          <strong>
            {data.stats.totalProgress ||
              0}
          </strong>
        </div>

      </section>

    </div>
  );
};

export default AdminDashboard;