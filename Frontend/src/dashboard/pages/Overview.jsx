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

        const response = await getDashboardOverview();

        console.log("DASHBOARD RESPONSE:", response);

        if (response?.success) {
          setDashboard(response);
        } else {
          setError(response?.message || "Failed to load dashboard");
        }
      } catch (error) {
        console.error(
          "Dashboard API Error:",
          error.response?.data || error.message
        );

        setError(
          error.response?.data?.message || "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  /* =========================================
     LOADING STATE
  ========================================= */
  if (loading) {
    return (
      <div className="overview-loading-container">
        <div className="overview-loading-content">
          <div className="overview-spinner-wrapper">
            <div className="overview-spinner" />
          </div>
          <p className="overview-loading-text">Loading your dashboard...</p>
        </div>

        <style>{`
          .overview-loading-container {
            min-height: 420px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border-radius: 20px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.03);
          }
          .overview-loading-content {
            text-align: center;
          }
          .overview-spinner-wrapper {
            position: relative;
            width: 44px;
            height: 44px;
            margin: 0 auto 16px;
          }
          .overview-spinner {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 3px solid #e2e8f0;
            border-top-color: #2563eb;
            animation: dashboardSpin 0.75s cubic-bezier(0.6, 0.2, 0.4, 0.8) infinite;
          }
          .overview-loading-text {
            color: #475569;
            font-size: 0.9375rem;
            font-weight: 500;
            letter-spacing: -0.01em;
            margin: 0;
          }
          @keyframes dashboardSpin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  /* =========================================
     ERROR STATE
  ========================================= */
  if (error) {
    return (
      <div className="overview-error-card">
        <div className="overview-error-icon">!</div>
        <span>{error}</span>

        <style>{`
          .overview-error-card {
            margin: 16px 0;
            padding: 16px 20px;
            border-radius: 14px;
            background: #fef2f2;
            color: #991b1b;
            border: 1px solid #fecaca;
            font-size: 0.875rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.05);
          }
          .overview-error-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #ef4444;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.75rem;
            flex-shrink: 0;
          }
        `}</style>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const user = dashboard.user || {};
  const stats = dashboard.stats || {};

  return (
    <div className="overview-container">
      {/* WELCOME CARD */}
      <section className="overview-section">
        <WelcomeCard user={user} />
      </section>

      {/* DASHBOARD STATISTICS GRID */}
      <section className="overview-section">
        <div className="dashboard-grid">
          <div className="card-wrapper">
            <DashboardCard
              title="Career Score"
              value={stats.careerScore || 0}
              colorClass="blue"
            />
          </div>

          <div className="card-wrapper">
            <DashboardCard
              title="Resume ATS"
              value={`${stats.resumeATS || 0}%`}
              colorClass="green"
            />
          </div>

          <div className="card-wrapper">
            <DashboardCard
              title="Skills Matched"
              value={`${stats.skillsMatched || 0} / ${
                stats.totalSkills || 0
              }`}
              colorClass="amber"
            />
          </div>

          <div className="card-wrapper">
            <DashboardCard
              title="Interview Average"
              value={`${stats.interviewAverage || 0}%`}
              colorClass="red"
            />
          </div>
        </div>
      </section>

      {/* OVERALL PROGRESS */}
      <section className="overview-section">
        <div className="progress-bar-wrapper">
          <ProgressBar percentage={stats.progress || 0} />
        </div>
      </section>

      {/* BOTTOM SECTION */}
      <section className="overview-section">
        <div className="bottom-section">
          <div className="bottom-card-wrapper">
            <RecentActivity />
          </div>

          <div className="bottom-card-wrapper">
            <QuickActions />
          </div>
        </div>
      </section>

      {/* RESPONSIVE & COMPONENT STYLES */}
      <style>{`
        .overview-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          box-sizing: border-box;
          padding: 8px;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .overview-section {
          width: 100%;
          margin-bottom: 20px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          width: 100%;
          align-items: stretch;
        }

        .card-wrapper,
        .bottom-card-wrapper {
          min-width: 0;
          width: 100%;
          height: 100%;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), 
                      box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 16px;
        }

        .card-wrapper:hover {
          transform: translateY(-3px);
        }

        .progress-bar-wrapper {
          width: 100%;
          border-radius: 16px;
          transition: transform 0.2s ease;
        }

        .bottom-section {
          display: grid;
          grid-template-columns: minmax(0, 1.6fr) minmax(300px, 1fr);
          gap: 16px;
          width: 100%;
          align-items: stretch;
        }

        /* RESPONSIVE BREAKPOINTS */
        @media (max-width: 1100px) {
          .dashboard-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .bottom-section {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        @media (max-width: 640px) {
          .overview-container {
            padding: 4px;
          }

          .overview-section {
            margin-bottom: 14px;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .bottom-section {
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Overview;