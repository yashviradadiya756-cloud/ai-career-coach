import React, { useEffect, useState } from "react";
import {
  Trophy,
  Users,
  Award,
  Star,
  CheckCircle,
  RefreshCw,
  Clock3,
  Medal,
} from "lucide-react";

import { getAdminAchievements } from "../../api/adminApi";
import "../styles/adminAchievement.css";

const AdminAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD ACHIEVEMENTS
  // ==========================================

  const loadAchievements = async () => {
  try {
    console.log("=================================");
    console.log("ADMIN ACHIEVEMENTS");
    console.log("=================================");

    const response =
      await getAdminAchievements();

    console.log(
      "ADMIN ACHIEVEMENTS RESPONSE:",
      response
    );

    console.log(
      "ADMIN ACHIEVEMENTS DATA:",
      response?.achievements
    );

    const formattedData =
      Array.isArray(response?.achievements)
        ? response.achievements
        : [];

    console.log(
      "FORMATTED ADMIN ACHIEVEMENTS:",
      formattedData
    );

    setAchievements(formattedData);

  } catch (error) {

    console.error(
      "ADMIN ACHIEVEMENTS ERROR:",
      error.response?.data || error
    );

    setAchievements([]);

  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadAchievements();
  }, []);

  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAchievements();
  };

  // ==========================================
  // STATS
  // ==========================================

  const totalAchievements =
    achievements.length;

  const unlockedAchievements =
    achievements.filter(
      (item) =>
        item.unlocked === true ||
        item.status === "Unlocked"
    ).length;

  const totalPoints =
    achievements.reduce(
      (sum, item) =>
        sum + Number(item.points || 0),
      0
    );

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-achievements-page">

        <div className="achievements-loading">

          <div className="achievement-spinner"></div>

          <p>
            Loading achievements...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="admin-achievements-page">

      {/* HEADER */}

      <div className="achievement-page-header">

        <div className="achievement-title-row">

          <div className="achievement-main-icon">
            <Trophy size={25} />
          </div>

          <div>
            <h1>Achievements</h1>

            <p>
              Monitor user achievements and
              milestones.
            </p>
          </div>

        </div>

        <button
          className="achievement-refresh-btn"
          onClick={handleRefresh}
          disabled={refreshing}
        >

          <RefreshCw
            size={17}
            className={
              refreshing
                ? "achievement-refresh-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="achievement-error">

          <Clock3 size={18} />

          {error}

        </div>
      )}

      {/* STATISTICS */}

      <div className="achievement-stat-grid">

        <div className="achievement-stat-card">

          <div className="achievement-stat-icon total">
            <Trophy size={21} />
          </div>

          <div>
            <span>Total Achievements</span>
            <strong>
              {totalAchievements}
            </strong>
          </div>

        </div>

        <div className="achievement-stat-card">

          <div className="achievement-stat-icon unlocked">
            <CheckCircle size={21} />
          </div>

          <div>
            <span>Unlocked</span>
            <strong>
              {unlockedAchievements}
            </strong>
          </div>

        </div>

        <div className="achievement-stat-card">

          <div className="achievement-stat-icon users">
            <Users size={21} />
          </div>

          <div>
            <span>User Records</span>
            <strong>
              {achievements.length}
            </strong>
          </div>

        </div>

        <div className="achievement-stat-card">

          <div className="achievement-stat-icon points">
            <Star size={21} />
          </div>

          <div>
            <span>Total Points</span>
            <strong>
              {totalPoints}
            </strong>
          </div>

        </div>

      </div>

      {/* ACHIEVEMENT TABLE */}

      <div className="achievement-table-card">

        <div className="achievement-table-header">

          <div>

            <h2>User Achievements</h2>

            <p>
              View achievements earned by users.
            </p>

          </div>

          <div className="achievement-count">
            {achievements.length} Records
          </div>

        </div>

        {achievements.length === 0 ? (

          <div className="achievement-empty">

            <div className="achievement-empty-icon">
              <Trophy size={30} />
            </div>

            <h3>
              No Achievements Yet
            </h3>

            <p>
              User achievements will appear
              here when milestones are unlocked.
            </p>

          </div>

        ) : (

          <div className="achievement-table-wrapper">

            <table className="admin-achievement-table">

              <thead>

                <tr>
                  <th>User</th>
                  <th>Achievement</th>
                  <th>Description</th>
                  <th>Points</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>

              </thead>

              <tbody>

                {achievements.map(
                  (achievement, index) => {

                    const user =
                      achievement.user || {};

                    const unlocked =
                      achievement.unlocked ===
                        true ||
                      achievement.status ===
                        "Unlocked";

                    return (
                      <tr
                        key={
                          achievement._id ||
                          index
                        }
                      >

                        {/* USER */}

                        <td>

                          <div className="achievement-user">

                            <div className="achievement-avatar">
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

                        {/* ACHIEVEMENT */}

                        <td>

                          <div className="achievement-name">

                            <div className="achievement-icon-box">
                              <Medal size={17} />
                            </div>

                            <strong>
                              {achievement.title ||
                                achievement.name ||
                                "Achievement"}
                            </strong>

                          </div>

                        </td>

                        {/* DESCRIPTION */}

                        <td className="achievement-description">

                          {achievement.description ||
                            "Milestone achievement"}

                        </td>

                        {/* POINTS */}

                        <td>

                          <div className="achievement-points">

                            <Star size={15} />

                            {Number(
                              achievement.points || 0
                            )}

                          </div>

                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={`achievement-status ${
                              unlocked
                                ? "unlocked"
                                : "locked"
                            }`}
                          >

                            {unlocked ? (
                              <CheckCircle
                                size={14}
                              />
                            ) : (
                              <Clock3
                                size={14}
                              />
                            )}

                            {unlocked
                              ? "Unlocked"
                              : "Locked"}

                          </span>

                        </td>

                        {/* DATE */}

                        <td>

                          {achievement.createdAt
                            ? new Date(
                                achievement.createdAt
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "-"}

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
  );
};

export default AdminAchievements;