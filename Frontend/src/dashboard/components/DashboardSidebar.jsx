import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutGrid,
  ClipboardCheck,
  FileText,
  Brain,
  Map,
  Mic,
  Bot,
  BookOpen,
  BarChart2,
  Trophy,
  LogOut,
  Bell,
  CreditCard,
  Settings,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import "../styles/dashboardSidebar.css";

const navItems = [
  {
    name: "Overview",
    path: "/dashboard/overview",
    icon: LayoutGrid,
  },
  {
    name: "Assessment",
    path: "/dashboard/assessment",
    icon: ClipboardCheck,
  },
  {
    name: "Resume",
    path: "/dashboard/resume",
    icon: FileText,
  },
  {
    name: "Skill Gap",
    path: "/dashboard/skill-gap",
    icon: Brain,
  },
  {
    name: "Roadmap",
    path: "/dashboard/roadmap",
    icon: Map,
  },
  {
    name: "Interview",
    path: "/dashboard/interview",
    icon: Mic,
  },
  {
    name: "AI Coach",
    path: "/dashboard/ai-coach",
    icon: Bot,
  },
  {
    name: "Learning",
    path: "/dashboard/learning",
    icon: BookOpen,
  },
  {
    name: "Progress",
    path: "/dashboard/progress",
    icon: BarChart2,
  },
  {
    name: "Achievement",
    path: "/dashboard/achievement",
    icon: Trophy,
  },
  {
    name: "Payment",
    path: "/dashboard/payment",
    icon: CreditCard,
  },
  {
    name: "Notification",
    path: "/dashboard/notification",
    icon: Bell,
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
  },
];

const DashboardSidebar = ({ isExpanded, onToggle }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside
      className={`dashboard-sidebar ${
        isExpanded ? "expanded" : "collapsed"
      }`}
    >

      {/* =====================================================
          SMALL SIDEBAR HEADER
          ===================================================== */}

      <div className="sidebar-header">

        {isExpanded && (
          <span className="brand-title">
            Dashboard
          </span>
        )}

        <button
          type="button"
          className="toggle-btn"
          onClick={onToggle}
          aria-label={
            isExpanded
              ? "Collapse Sidebar"
              : "Expand Sidebar"
          }
        >
          {isExpanded ? (
            <ChevronLeft size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </button>

      </div>


      {/* =====================================================
          NAVIGATION
          ===================================================== */}

      <nav className="sidebar-nav">

        {navItems.map((item) => {
          const IconComponent = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              title={!isExpanded ? item.name : ""}
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >

              <div className="icon-wrapper">
                <IconComponent
                  size={20}
                  className="sidebar-icon"
                />
              </div>

              <span className="sidebar-label">
                {item.name}
              </span>

            </NavLink>
          );
        })}

      </nav>


      {/* =====================================================
          LOGOUT
          ===================================================== */}

      <div className="sidebar-bottom">

        <button
          type="button"
          className="logout-btn"
          title={!isExpanded ? "Logout" : ""}
          onClick={() => {
            const confirmLogout = window.confirm(
              "Are you sure you want to logout?"
            );

            if (confirmLogout) {
              handleLogout();
            }
          }}
        >

          <div className="icon-wrapper">
            <LogOut
              size={18}
              className="sidebar-icon"
            />
          </div>

          <span className="sidebar-label">
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
};

export default DashboardSidebar;