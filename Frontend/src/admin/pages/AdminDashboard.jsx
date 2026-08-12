import React, { useEffect, useState } from "react";
import { getAdminDashboard } from "../../api/adminApi";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await getAdminDashboard();

      setStats(response.data.stats);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to load admin dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <p>{error}</p>

        <button onClick={loadDashboard}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      <div className="admin-page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Manage and monitor your AI Career Coach platform.
          </p>
        </div>
      </div>

      <div className="admin-stats-grid">

        <div className="admin-stat-card">
          <h3>Total Users</h3>
          <strong>{stats?.totalUsers || 0}</strong>
        </div>

        <div className="admin-stat-card">
          <h3>Total Admins</h3>
          <strong>{stats?.totalAdmins || 0}</strong>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;