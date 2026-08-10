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
      <div
        style={{
          minHeight: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          color: "#64748b",
        }}
      >
        Loading your dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          margin: "20px",
          padding: "16px 20px",
          borderRadius: "10px",
          background: "#fee2e2",
          color: "#b91c1c",
          fontWeight: "500",
        }}
      >
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
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
      }}
    >

      {/* ================================= */}
      {/* WELCOME */}
      {/* ================================= */}

      <WelcomeCard user={user} />


      {/* ================================= */}
      {/* DASHBOARD STATISTICS */}
      {/* ================================= */}

      <div
        className="dashboard-grid"
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
          gap: "20px",
          width: "100%",
          marginTop: "24px",
          marginBottom: "24px",
          alignItems: "stretch",
        }}
      >

        {/* Career Score */}

        <div
          style={{
            minWidth: 0,
            width: "100%",
            height: "100%",
            minHeight: "150px",
          }}
        >
          <DashboardCard
            title="Career Score"
            value={stats.careerScore || 0}
            colorClass="blue"
          />
        </div>


        {/* Resume ATS */}

        <div
          style={{
            minWidth: 0,
            width: "100%",
            height: "100%",
            minHeight: "150px",
          }}
        >
          <DashboardCard
            title="Resume ATS"
            value={`${stats.resumeATS || 0}%`}
            colorClass="green"
          />
        </div>


        {/* Skills Matched */}

        <div
          style={{
            minWidth: 0,
            width: "100%",
            height: "100%",
            minHeight: "150px",
          }}
        >
          <DashboardCard
            title="Skills Matched"
            value={`${stats.skillsMatched || 0} / ${
              stats.totalSkills || 0
            }`}
            colorClass="amber"
          />
        </div>


        {/* Interview Average */}

        <div
          style={{
            minWidth: 0,
            width: "100%",
            height: "100%",
            minHeight: "150px",
          }}
        >
          <DashboardCard
            title="Interview Average"
            value={`${
              stats.interviewAverage || 0
            }%`}
            colorClass="red"
          />
        </div>

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