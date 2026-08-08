import React, { useEffect, useState } from "react";

import WelcomeCard from "../components/WelcomeCard";
import DashboardCard from "../components/DashboardCard";
import ProgressBar from "../components/ProgressBar";
import RecentActivity from "../components/RecentActivity";
import QuickActions from "../components/QuickActions";

import { getDashboardOverview } from "../../api/dashboardApi";

const Overview = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboardOverview();

        console.log("Dashboard Data:", data);

        if (data.success) {
          setDashboard(data);
        } else {
          setError(
            data.message || "Failed to load dashboard"
          );
        }
      } catch (error) {
        console.error(
          "Dashboard API Error:",
          error.response?.data || error.message
        );

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ============================
  // LOADING
  // ============================

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading your dashboard...
      </div>
    );
  }

  // ============================
  // ERROR
  // ============================

  if (error) {
    return (
      <div className="dashboard-error">
        ⚠️ {error}
      </div>
    );
  }

  // ============================
  // NO DATA
  // ============================

  if (!dashboard) {
    return null;
  }

  const {
    user = {},
    stats = {},
  } = dashboard;

  return (
    <div className="overview-page">

      {/* ============================
          WELCOME
      ============================ */}

      <WelcomeCard user={user} />


      {/* ============================
          DASHBOARD STATISTICS
      ============================ */}

      <div className="dashboard-grid">

        <DashboardCard
          title="Career Score"
          value={stats.careerScore ?? 0}
          colorClass="blue"
        />

        <DashboardCard
          title="Resume ATS"
          value={`${stats.resumeATS ?? 0}%`}
          colorClass="green"
        />

        <DashboardCard
          title="Skills Matched"
          value={`${stats.skillsMatched ?? 0} / ${
            stats.totalSkills ?? 0
          }`}
          colorClass="amber"
        />

        <DashboardCard
          title="Interview Average"
          value={`${stats.interviewAverage ?? 0}%`}
          colorClass="red"
        />

      </div>


      {/* ============================
          OVERALL PROGRESS
      ============================ */}

      <ProgressBar
        percentage={stats.progress ?? 0}
      />


      {/* ============================
          BOTTOM SECTION
      ============================ */}

      <div className="bottom-section">

        <RecentActivity />

        <QuickActions />

      </div>

    </div>
  );
};

export default Overview;

