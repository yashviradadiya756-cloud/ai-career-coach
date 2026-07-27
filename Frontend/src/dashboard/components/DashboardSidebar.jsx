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
} from "lucide-react";
import "../styles/dashboardSidebar.css";

const navItems = [
  { name: "Overview", path: "/dashboard/overview", icon: LayoutGrid },
  { name: "Assessment", path: "/dashboard/assessment", icon: ClipboardCheck },
  { name: "Resume", path: "/dashboard/resume", icon: FileText },
  { name: "Skill Gap", path: "/dashboard/skill-gap", icon: Brain },
  { name: "Roadmap", path: "/dashboard/roadmap", icon: Map },
  { name: "Interview", path: "/dashboard/interview", icon: Mic },
  { name: "AI Coach", path: "/dashboard/ai-coach", icon: Bot },
  { name: "Learning", path: "/dashboard/learning", icon: BookOpen },
  { name: "Progress", path: "/dashboard/progress", icon: BarChart2 },
  { name: "Achievement", path: "/dashboard/achievement", icon: Trophy },
  { name: "Payment", path: "/dashboard/payment", icon: CreditCard },
  { name: "Notification", path: "/dashboard/notification", icon: Bell },
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
];

const DashboardSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="dashboard-sidebar">
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const IconComponent = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <IconComponent size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">

        <button className ="logout-btn"
         onClick={() => {
           const confirmLogout = window.confirm(
             "Are you sure you want to logout?"
           );
       
           if(confirmLogout){
             logout();
           }
         }}
       >
         <LogOut size={16}/>
         Logout
       </button>

        </div>
    </aside>
  );
};

export default DashboardSidebar;