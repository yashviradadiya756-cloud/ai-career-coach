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
  CreditCard,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const AdminSidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();

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
      path: "/admin/skills",
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
    {
      name: "Payments",
      path: "/admin/payments",
      icon: CreditCard,
    },
    {
      name: "Notifications",
      path: "/admin/notifications",
      icon: Bell,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Logo */}
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

      {/* Menu */}
      <nav className="admin-nav">
        <div className="admin-nav-section">
          {!collapsed && (
            <p className="admin-nav-label">MAIN MENU</p>
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
                <Icon size={19} strokeWidth={2} />

                {!collapsed && (
                  <span>{item.name}</span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Menu */}
        <div className="admin-nav-section admin-bottom-nav">
          {!collapsed && (
            <p className="admin-nav-label">SYSTEM</p>
          )}

          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `admin-nav-item ${
                isActive ? "active" : ""
              }`
            }
            title={collapsed ? "Settings" : ""}
          >
            <Settings size={19} />
            {!collapsed && <span>Settings</span>}
          </NavLink>

          <button
            className="admin-nav-item logout-item"
            onClick={handleLogout}
            title={collapsed ? "Logout" : ""}
          >
            <LogOut size={19} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </nav>

      {/* Collapse Button */}
      <button
        className="admin-sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
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