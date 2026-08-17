import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  BookOpen,
  Target,
  CheckCircle,
  Clock3,
  Award,
  RefreshCw,
  Activity,
} from "lucide-react";

import { getAdminProgress } from "../../api/adminApi";
import "../styles/adminProgress.css";

const AdminProgress = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD PROGRESS
  // ==========================================

  const loadProgress = async () => {
    try {
      setError("");

      const response = await getAdminProgress();

      if (response.success) {
        setProgress(response.progress || []);
      } else {
        setError(
          response.message || "Failed to load user progress."
        );
      }
    } catch (error) {
      console.error(
        "ADMIN PROGRESS ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to load user progress."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProgress();
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalUsers = progress.length;

  const completedUsers = progress.filter(
    (item) => Number(item.progressPercentage || 0) >= 100
  ).length;

  const activeUsers = progress.filter(
    (item) =>
      Number(item.progressPercentage || 0) > 0 &&
      Number(item.progressPercentage || 0) < 100
  ).length;

  const averageProgress =
    totalUsers > 0
      ? Math.round(
          progress.reduce(
            (sum, item) =>
              sum + Number(item.progressPercentage || 0),
            0
          ) / totalUsers
        )
      : 0;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-progress-page">
        <div className="admin-progress-loading">
          <div className="progress-spinner"></div>
          <p>Loading user progress...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="admin-progress-page">

      {/* HEADER */}

      <div className="progress-page-header">

        <div>
          <div className="progress-title-row">
            <div className="progress-main-icon">
              <TrendingUp size={25} />
            </div>

            <div>
              <h1>User Progress</h1>
              <p>
                Monitor learning progress and activity
                across all users.
              </p>
            </div>
          </div>
        </div>

        <button
          className="progress-refresh-btn"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            size={17}
            className={
              refreshing ? "refresh-spinning" : ""
            }
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="progress-error">
          <Clock3 size={18} />
          {error}
        </div>
      )}

      {/* STAT CARDS */}

      <div className="progress-stat-grid">

        <div className="progress-stat-card">

          <div className="progress-stat-icon users">
            <Users size={22} />
          </div>

          <div>
            <span>Total Users</span>
            <strong>{totalUsers}</strong>
          </div>

        </div>

        <div className="progress-stat-card">

          <div className="progress-stat-icon active">
            <Activity size={22} />
          </div>

          <div>
            <span>Active Learners</span>
            <strong>{activeUsers}</strong>
          </div>

        </div>

        <div className="progress-stat-card">

          <div className="progress-stat-icon completed">
            <CheckCircle size={22} />
          </div>

          <div>
            <span>Completed</span>
            <strong>{completedUsers}</strong>
          </div>

        </div>

        <div className="progress-stat-card">

          <div className="progress-stat-icon average">
            <Target size={22} />
          </div>

          <div>
            <span>Average Progress</span>
            <strong>{averageProgress}%</strong>
          </div>

        </div>

      </div>

      {/* USER PROGRESS TABLE */}

      <div className="progress-table-card">

        <div className="progress-table-header">

          <div>
            <h2>User Learning Progress</h2>
            <p>
              Track individual user learning activity.
            </p>
          </div>

          <div className="progress-user-count">
            {totalUsers} Users
          </div>

        </div>

        {progress.length === 0 ? (

          <div className="progress-empty">

            <div className="progress-empty-icon">
              <TrendingUp size={30} />
            </div>

            <h3>No Progress Data</h3>

            <p>
              User progress will appear here when
              users start learning.
            </p>

          </div>

        ) : (

          <div className="progress-table-wrapper">

            <table className="admin-progress-table">

              <thead>
                <tr>
                  <th>User</th>
                  <th>Courses</th>
                  <th>Completed</th>
                  <th>Progress</th>
                  <th>Learning Status</th>
                </tr>
              </thead>

              <tbody>

                {progress.map((item, index) => {

                  const percentage = Math.min(
                    100,
                    Math.max(
                      0,
                      Number(
                        item.progressPercentage || 0
                      )
                    )
                  );

                  const user =
                    item.user || {};

                  const completed =
                    Number(
                      item.completedCourses || 0
                    );

                  const totalCourses =
                    Number(
                      item.totalCourses || 0
                    );

                  let status = "Not Started";

                  if (percentage >= 100) {
                    status = "Completed";
                  } else if (percentage > 0) {
                    status = "In Progress";
                  }

                  return (
                    <tr
                      key={
                        item._id ||
                        user._id ||
                        index
                      }
                    >

                      {/* USER */}

                      <td>

                        <div className="progress-user">

                          <div className="progress-avatar">
                            {(
                              user.name ||
                              user.username ||
                              "U"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {user.name ||
                                user.username ||
                                "Unknown User"}
                            </strong>

                            <span>
                              {user.email ||
                                "No email"}
                            </span>
                          </div>

                        </div>

                      </td>

                      {/* COURSES */}

                      <td>

                        <div className="progress-course-cell">
                          <BookOpen size={16} />

                          {totalCourses}
                        </div>

                      </td>

                      {/* COMPLETED */}

                      <td>

                        <div className="progress-completed-cell">
                          <CheckCircle size={16} />

                          {completed}
                        </div>

                      </td>

                      {/* PROGRESS */}

                      <td>

                        <div className="progress-value-wrapper">

                          <div className="progress-bar">
                            <div
                              className="progress-bar-fill"
                              style={{
                                width: `${percentage}%`,
                              }}
                            ></div>
                          </div>

                          <strong>
                            {percentage}%
                          </strong>

                        </div>

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={`progress-status ${
                            status === "Completed"
                              ? "completed"
                              : status === "In Progress"
                              ? "in-progress"
                              : "not-started"
                          }`}
                        >

                          {status === "Completed" && (
                            <CheckCircle size={14} />
                          )}

                          {status === "In Progress" && (
                            <Activity size={14} />
                          )}

                          {status === "Not Started" && (
                            <Clock3 size={14} />
                          )}

                          {status}

                        </span>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

export default AdminProgress;