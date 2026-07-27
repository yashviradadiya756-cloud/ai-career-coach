import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardCheck,
  FileSearch,
  Brain,
  Map,
  Mic,
  BookOpen,
  CreditCard,
  BarChart3,
  Bell,
  Settings,
  UserCircle,
  LogOut,
} from "lucide-react";

import "./Sidebar.css";
// import AdminPhoto from "../assets/admin.jpg"; // Replace with your image

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    path: "/admin/dashboard/users",
    icon: Users,
  },
  {
    name: "Resume Reports",
    path: "/admin/dashboard/resume-reports",
    icon: FileText,
  },
  {
    name: "Career Assessment",
    path: "/admin/dashboard/career-assessment",
    icon: ClipboardCheck,
  },
  {
    name: "Resume Analyzer",
    path: "/admin/dashboard/resume-analyzer",
    icon: FileSearch,
  },
  {
    name: "Skill Gap",
    path: "/admin/dashboard/skill-gap",
    icon: Brain,
  },
  {
    name: "Career Roadmaps",
    path: "/admin/dashboard/career-roadmaps",
    icon: Map,
  },
  {
    name: "Mock Interviews",
    path: "/admin/dashboard/mock-interviews",
    icon: Mic,
  },
  {
    name: "Learning",
    path: "/admin/dashboard/learning",
    icon: BookOpen,
  },
  {
    name: "Payments",
    path: "/admin/dashboard/payments",
    icon: CreditCard,
  },
  {
    name: "Analytics",
    path: "/admin/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "Notifications",
    path: "/admin/dashboard/notifications",
    icon: Bell,
  },
  {
    name: "Settings",
    path: "/admin/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2> Admin Pannel</h2>

      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin/dashboard"}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {/* <div className="admin-profile">
          <img src={AdminPhoto} alt="Admin" />

          <div>
            <h4>Yashvi Radadiya</h4>
            <p>Super Admin</p>
          </div>
        </div> */}

        <button className="logout-btn" onClick={logout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}