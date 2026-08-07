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

  const {
    user,
    stats,
  } = dashboard;

  return (
    <div>

      {/* Welcome */}
      <WelcomeCard user={user} />


      {/* Dashboard Statistics */}
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


      {/* ONLY ADDITION: Overall Progress Bar*/}
      <ProgressBar
        percentage={stats.progress || 0}
      />


      {/* Bottom Section */}
      <div className="bottom-section">

        <RecentActivity />

        <QuickActions />

      </div>

    </div>
  );
};

export default Overview;