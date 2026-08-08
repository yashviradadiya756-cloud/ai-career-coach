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

        console.log("DASHBOARD RESPONSE:", data);
        console.log("DASHBOARD USER:", data?.user);

        if (data.success) {
          setDashboard(data);
        } else {
          setError("Failed to load dashboard");
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

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading your dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        {error}
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const {
    user,
    stats,
  } = dashboard;

  return (
    <div className="overview-page">

      {/* =========================
          WELCOME
      ========================== */}

      <WelcomeCard user={user} />


      {/* =========================
          DASHBOARD STATISTICS
      ========================== */}

      <div className="dashboard-grid">

        <DashboardCard
          title="Career Score"
          value={stats.careerScore}
          colorClass="blue"
        />

        <DashboardCard
          title="Resume ATS"
          value={`${stats.resumeATS}%`}
          colorClass="green"
        />

        <DashboardCard
          title="Skills Matched"
          value={`${stats.skillsMatched} / ${stats.totalSkills}`}
          colorClass="amber"
        />

        <DashboardCard
          title="Interview Average"
          value={`${stats.interviewAverage}%`}
          colorClass="red"
        />

      </div>


      {/* =========================
          OVERALL PROGRESS
      ========================== */}

      <ProgressBar
        percentage={stats.progress || 0}
      />


      {/* =========================
          BOTTOM SECTION
      ========================== */}

      <div className="bottom-section">

        <RecentActivity />

        <QuickActions />

      </div>

    </div>
  );
};

export default Overview;