import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Bot,
  FileText,
  Map,
  Brain,
  Mic,
  BookOpen,
  TrendingUp,
  Trophy,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Award,
} from "lucide-react";

const AdminSidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();

  // ==========================================
  // ADMIN MENU ITEMS
  // ==========================================

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },

    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },

    {
      name: "AI Coach",
      path: "/admin/ai-coach",
      icon: Bot,
    },

    {
      name: "Resumes",
      path: "/admin/resumes",
      icon: FileText,
    },

    {
      name: "Roadmaps",
      path: "/admin/roadmaps",
      icon: Map,
    },

    {
      name: "Skill Gap",
      path: "/admin/skillgap",
      icon: Brain,
    },

    {
      name: "Interviews",
      path: "/admin/interviews",
      icon: Mic,
    },

    {
      name: "Learning",
      path: "/admin/learning",
      icon: BookOpen,
    },

    // ==========================================
    // USER PROGRESS
    // ==========================================

    {
      name: "User Progress",
      path: "/admin/progress",
      icon: TrendingUp,
    },

    // ==========================================
    // ACHIEVEMENTS
    // ==========================================

    {
      name: "Achievements",
      path: "/admin/achievements",
      icon: Trophy,
    },

    {
      name: "Certificate Rules",
      path: "/admin/certificate-criteria",
      icon: Award,
    },

    // ==========================================
    // PAYMENTS
    // ==========================================

    {
      name: "Payments",
      path: "/admin/payments",
      icon: CreditCard,
    },

    // ==========================================
    // NOTIFICATIONS
    // ==========================================

    {
      name: "Notifications",
      path: "/admin/notifications",
      icon: Bell,
    },
  ];

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside
      className={`admin-sidebar ${
        collapsed ? "collapsed" : ""
      }`}
    >
      {/* ==========================================
          LOGO
      ========================================== */}

      <div className="admin-logo-area">
        <div className="admin-logo-icon">
          <ShieldCheck size={22} />
        </div>

        {!collapsed && (
          <div className="admin-logo-text">
            <h2>CareerPilot</h2>
            <span>ADMIN PANEL</span>
          </div>
        )}
      </div>

      {/* ==========================================
          NAVIGATION
      ========================================== */}

      <nav className="admin-nav">
        <div className="admin-nav-section">

          {!collapsed && (
            <p className="admin-nav-label">
              MAIN MENU
            </p>
          )}

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `admin-nav-item ${
                    isActive ? "active" : ""
                  }`
                }
                title={collapsed ? item.name : ""}
              >
                <Icon
                  size={19}
                  strokeWidth={2}
                />

                {!collapsed && (
                  <span>{item.name}</span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* ==========================================
            SYSTEM MENU
        ========================================== */}

        <div className="admin-nav-section admin-bottom-nav">

          {!collapsed && (
            <p className="admin-nav-label">
              SYSTEM
            </p>
          )}

          {/* SETTINGS */}

          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `admin-nav-item ${
                isActive ? "active" : ""
              }`
            }
            title={collapsed ? "Settings" : ""}
          >
            <Settings size={19} strokeWidth={2} />

            {!collapsed && (
              <span>Settings</span>
            )}
          </NavLink>

          {/* LOGOUT */}

          <button
            type="button"
            className="admin-nav-item logout-item"
            onClick={handleLogout}
            title={collapsed ? "Logout" : ""}
          >
            <LogOut size={19} strokeWidth={2} />

            {!collapsed && (
              <span>Logout</span>
            )}
          </button>

        </div>
      </nav>

      {/* ==========================================
          COLLAPSE BUTTON
      ========================================== */}

      <button
        type="button"
        className="admin-sidebar-toggle"
        onClick={() =>
          setCollapsed(!collapsed)
        }
        aria-label="Toggle sidebar"
      >
        {collapsed ? (
          <ChevronRight size={17} />
        ) : (
          <ChevronLeft size={17} />
        )}
      </button>
    </aside>
  );
};

export default AdminSidebar;