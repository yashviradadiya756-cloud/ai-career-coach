import React, {
  useEffect,
  useState,
} from "react";

import WelcomeCard from "../components/WelcomeCard";
import DashboardCard from "../components/DashboardCard";
import ProgressBar from "../components/ProgressBar";
import RecentActivity from "../components/RecentActivity";
import QuickActions from "../components/QuickActions";

import {
  getDashboardOverview,
} from "../../api/dashboardApi";

const Overview = () => {
  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getDashboardOverview();

        console.log(
          "DASHBOARD RESPONSE:",
          response
        );

        if (response?.success) {
          setDashboard(response);
        } else {
          setError(
            response?.message ||
              "Failed to load dashboard"
          );
        }
      } catch (error) {
        console.error(
          "Dashboard API Error:",
          error.response?.data ||
            error.message
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
      <div>
        Loading your dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div>
        {error}
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const user =
    dashboard.user || {};

  const stats =
    dashboard.stats || {};

  return (
    <div>

      {/* ================================= */}
      {/* WELCOME */}
      {/* ================================= */}

      <WelcomeCard user={user} />


      {/* ================================= */}
      {/* DASHBOARD STATISTICS */}
      {/* ================================= */}

      <div className="dashboard-grid">

        <DashboardCard
          title="Career Score"
          value={stats.careerScore || 0}
          colorClass="blue"
        />

        <DashboardCard
          title="Resume ATS"
          value={`${stats.resumeATS || 0}%`}
          colorClass="green"
        />

        <DashboardCard
          title="Skills Matched"
          value={`${stats.skillsMatched || 0} / ${
            stats.totalSkills || 0
          }`}
          colorClass="amber"
        />

        <DashboardCard
          title="Interview Average"
          value={`${
            stats.interviewAverage || 0
          }%`}
          colorClass="red"
        />

      </div>


      {/* ================================= */}
      {/* OVERALL PROGRESS */}
      {/* ================================= */}

      <ProgressBar
        percentage={
          stats.progress || 0
        }
      />


      {/* ================================= */}
      {/* BOTTOM SECTION */}
      {/* ================================= */}

      <div className="bottom-section">

        <RecentActivity />

        <QuickActions />

      </div>

    </div>
  );
};

export default Overview;