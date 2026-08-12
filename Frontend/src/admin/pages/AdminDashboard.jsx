import React, { useEffect, useState } from "react";
import {
  Users,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  UserPlus,
  FileText,
  Brain,
  Map,
  Mic,
  CreditCard,
  Settings,
  RefreshCw,
  CheckCircle2,
  Clock3,
  ChevronRight,
} from "lucide-react";

import { getAdminDashboard } from "../../api/adminApi";

import "../styles/adminDashboard.css";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminDashboard();

      setDashboard(response.data);
    } catch (err) {
      console.error("Admin dashboard error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load admin dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="ad-page">
        <div className="ad-loading">
          <div className="ad-spinner"></div>
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ad-page">
        <div className="ad-error">
          <div className="ad-error-icon">
            <Activity size={24} />
          </div>

          <h2>Dashboard unavailable</h2>

          <p>{error}</p>

          <button onClick={loadDashboard}>
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboard?.stats || {};

  const totalUsers = stats.totalUsers || 0;
  const totalAdmins = stats.totalAdmins || 0;

  return (
    <div className="ad-page">

      {/* ==================================================
          TOP
      ================================================== */}

      <div className="ad-top">

        <div>
          <span className="ad-eyebrow">
            ADMINISTRATION
          </span>

          <h1>Good morning, Yashvi</h1>

          <p>
            Here's a quick overview of your CareerPilot
            platform.
          </p>
        </div>

        <button
          className="ad-refresh"
          onClick={loadDashboard}
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>


      {/* ==================================================
          STATUS BAR
      ================================================== */}

      <div className="ad-status">

        <div className="ad-status-left">
          <span className="ad-live-dot"></span>

          <div>
            <strong>All systems operational</strong>
            <span>CareerPilot is running normally</span>
          </div>
        </div>

        <div className="ad-status-right">
          <span>Last checked</span>
          <strong>Just now</strong>
        </div>

      </div>


      {/* ==================================================
          OVERVIEW
      ================================================== */}

      <div className="ad-section-title">

        <div>
          <span>OVERVIEW</span>
          <h2>Platform statistics</h2>
        </div>

        <span className="ad-date">
          <Clock3 size={14} />
          Today
        </span>

      </div>


      {/* ==================================================
          STATISTICS
      ================================================== */}

      <div className="ad-stats">

        <div className="ad-stat primary">

          <div className="ad-stat-icon">
            <Users size={21} />
          </div>

          <div className="ad-stat-info">
            <span>Total users</span>

            <strong>{totalUsers}</strong>

            <small>
              Registered candidates
            </small>
          </div>

          <div className="ad-stat-arrow">
            <ArrowUpRight size={17} />
          </div>

        </div>


        <div className="ad-stat purple">

          <div className="ad-stat-icon">
            <ShieldCheck size={21} />
          </div>

          <div className="ad-stat-info">
            <span>Administrators</span>

            <strong>{totalAdmins}</strong>

            <small>
              Platform administrators
            </small>
          </div>

          <div className="ad-stat-arrow">
            <ArrowUpRight size={17} />
          </div>

        </div>


        <div className="ad-stat green">

          <div className="ad-stat-icon">
            <Activity size={21} />
          </div>

          <div className="ad-stat-info">
            <span>System status</span>

            <strong className="online">
              Online
            </strong>

            <small>
              All services operational
            </small>
          </div>

          <div className="ad-stat-check">
            <CheckCircle2 size={18} />
          </div>

        </div>

      </div>


      {/* ==================================================
          MAIN GRID
      ================================================== */}

      <div className="ad-main-grid">

        {/* LEFT */}

        <div className="ad-main-left">

          {/* QUICK ACCESS */}

          <section className="ad-box">

            <div className="ad-box-head">

              <div>
                <span>MANAGEMENT</span>
                <h3>Quick access</h3>
              </div>

              <Settings size={18} />

            </div>


            <div className="ad-management-grid">

              <div className="ad-management-item">

                <div className="management-icon blue">
                  <Users size={20} />
                </div>

                <div>
                  <strong>Users</strong>
                  <span>
                    Manage registered users
                  </span>
                </div>

                <ChevronRight size={17} />

              </div>


              <div className="ad-management-item">

                <div className="management-icon purple">
                  <FileText size={20} />
                </div>

                <div>
                  <strong>Resumes</strong>
                  <span>
                    Review uploaded resumes
                  </span>
                </div>

                <ChevronRight size={17} />

              </div>


              <div className="ad-management-item">

                <div className="management-icon orange">
                  <Brain size={20} />
                </div>

                <div>
                  <strong>AI Coach</strong>
                  <span>
                    Monitor AI features
                  </span>
                </div>

                <ChevronRight size={17} />

              </div>


              <div className="ad-management-item">

                <div className="management-icon green">
                  <Map size={20} />
                </div>

                <div>
                  <strong>Roadmaps</strong>
                  <span>
                    Monitor career roadmaps
                  </span>
                </div>

                <ChevronRight size={17} />

              </div>


              <div className="ad-management-item">

                <div className="management-icon pink">
                  <Mic size={20} />
                </div>

                <div>
                  <strong>Interviews</strong>
                  <span>
                    View interview activity
                  </span>
                </div>

                <ChevronRight size={17} />

              </div>


              <div className="ad-management-item">

                <div className="management-icon yellow">
                  <CreditCard size={20} />
                </div>

                <div>
                  <strong>Payments</strong>
                  <span>
                    Manage transactions
                  </span>
                </div>

                <ChevronRight size={17} />

              </div>

            </div>

          </section>


          {/* RECENT ACTIVITY */}

          <section className="ad-box">

            <div className="ad-box-head">

              <div>
                <span>ACTIVITY</span>
                <h3>Recent activity</h3>
              </div>

              <button className="ad-view">
                View all
                <ArrowUpRight size={14} />
              </button>

            </div>


            <div className="ad-activity-list">

              <div className="ad-activity">

                <div className="activity-avatar blue">
                  <UserPlus size={17} />
                </div>

                <div className="activity-content">
                  <strong>
                    User registration
                  </strong>

                  <span>
                    A new candidate joined CareerPilot
                  </span>
                </div>

                <time>Now</time>

              </div>


              <div className="ad-activity">

                <div className="activity-avatar purple">
                  <FileText size={17} />
                </div>

                <div className="activity-content">
                  <strong>
                    Resume analysis
                  </strong>

                  <span>
                    Resume analysis service is available
                  </span>
                </div>

                <time>Today</time>

              </div>


              <div className="ad-activity">

                <div className="activity-avatar green">
                  <CheckCircle2 size={17} />
                </div>

                <div className="activity-content">
                  <strong>
                    System check completed
                  </strong>

                  <span>
                    All core services are operational
                  </span>
                </div>

                <time>Today</time>

              </div>

            </div>

          </section>

        </div>


        {/* RIGHT */}

        <div className="ad-main-right">

          {/* ADMIN PROFILE */}

          <section className="ad-profile-card">

            <div className="ad-profile-top">

              <div className="ad-profile-avatar">
                Y
              </div>

              <div>
                <span>ADMIN ACCOUNT</span>
                <h3>Yashvi</h3>
                <p>Administrator</p>
              </div>

            </div>


            <div className="ad-profile-line"></div>


            <div className="ad-profile-row">
              <span>Access level</span>
              <strong>Administrator</strong>
            </div>

            <div className="ad-profile-row">
              <span>Account status</span>

              <strong className="profile-online">
                <i></i>
                Active
              </strong>
            </div>

            <div className="ad-profile-row">
              <span>Platform</span>
              <strong>CareerPilot</strong>
            </div>

          </section>


          {/* PLATFORM SUMMARY */}

          <section className="ad-box ad-summary">

            <div className="ad-box-head">

              <div>
                <span>SUMMARY</span>
                <h3>Platform health</h3>
              </div>

            </div>


            <div className="health-item">

              <div className="health-title">
                <span>Authentication</span>
                <strong>Healthy</strong>
              </div>

              <div className="health-progress">
                <span style={{ width: "100%" }}></span>
              </div>

            </div>


            <div className="health-item">

              <div className="health-title">
                <span>API services</span>
                <strong>Healthy</strong>
              </div>

              <div className="health-progress">
                <span style={{ width: "100%" }}></span>
              </div>

            </div>


            <div className="health-item">

              <div className="health-title">
                <span>Database</span>
                <strong>Connected</strong>
              </div>

              <div className="health-progress">
                <span style={{ width: "100%" }}></span>
              </div>

            </div>


            <div className="ad-health-message">

              <CheckCircle2 size={17} />

              <span>
                CareerPilot is ready for users.
              </span>

            </div>

          </section>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;