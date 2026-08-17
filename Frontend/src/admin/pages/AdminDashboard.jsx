import React, { useEffect, useState } from "react";
import {
  Users,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

import { getAdminDashboard } from "../../api/adminApi";

import "../styles/adminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
  try {
    const response = await getAdminDashboard();

    console.log(
      "ADMIN DASHBOARD RESPONSE:",
      response
    );

    if (response?.success) {
      setStats(
        response.stats || {
          totalUsers: 0,
          totalAdmins: 0,
        }
      );
    } else {
      console.error(
        "ADMIN DASHBOARD FAILED:",
        response?.message
      );

      setStats({
        totalUsers: 0,
        totalAdmins: 0,
      });
    }
  } catch (error) {
    console.error(
      "Admin dashboard error:",
      error.response?.data || error
    );

    setStats({
      totalUsers: 0,
      totalAdmins: 0,
    });
  }
};
  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="admin-dashboard-spinner" />

        <p>
          Loading admin dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-error">

        <h2>
          Failed to load admin dashboard
        </h2>

        <p>
          {error}
        </p>

        <button
          onClick={loadDashboard}
        >
          <RefreshCw size={16} />
          Retry
        </button>

      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      <div className="admin-dashboard-header">

        <div>
          <span>
            ADMINISTRATION
          </span>

          <h1>
            CareerPilot Admin
          </h1>

          <p>
            Manage and monitor your AI Career
            Coach platform.
          </p>
        </div>

        <button
          className="admin-refresh"
          onClick={loadDashboard}
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>

      <div className="admin-stat-grid">

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <Users size={22} />
          </div>

          <div>
            <span>
              Total Users
            </span>

            <strong>
              {stats.totalUsers}
            </strong>
          </div>

        </div>

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <ShieldCheck size={22} />
          </div>

          <div>
            <span>
              Total Admins
            </span>

            <strong>
              {stats.totalAdmins}
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;