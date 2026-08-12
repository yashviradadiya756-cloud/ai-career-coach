import React, { useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  User,
  Settings,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const AdminNavbar = ({
  sidebarCollapsed,
  setSidebarCollapsed,
}) => {
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <header className="admin-navbar">
      {/* Left */}
      <div className="admin-navbar-left">
        <button
          className="mobile-sidebar-button"
          onClick={() =>
            setSidebarCollapsed(!sidebarCollapsed)
          }
        >
          <Menu size={20} />
        </button>

        <div className="admin-page-heading">
          <span>ADMINISTRATION</span>
          <h1>CareerPilot Admin</h1>
        </div>
      </div>

      {/* Right */}
      <div className="admin-navbar-right">
        {/* Search */}
        <div className="admin-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <kbd>⌘ K</kbd>
        </div>

        {/* Notification */}
        <button
          className="admin-icon-button"
          onClick={() =>
            navigate("/admin/notifications")
          }
        >
          <Bell size={19} />

          <span className="notification-dot"></span>
        </button>

        {/* Profile */}
        <div className="admin-profile-wrapper">
          <button
            className="admin-profile-button"
            onClick={() =>
              setShowProfile(!showProfile)
            }
          >
            <div className="admin-avatar">
              Y
            </div>

            <div className="admin-profile-info">
              <strong>Yashvi</strong>
              <span>Administrator</span>
            </div>

            <ChevronDown size={16} />
          </button>

          {showProfile && (
            <div className="admin-profile-dropdown">
              <button
                onClick={() =>
                  navigate("/admin/settings")
                }
              >
                <User size={16} />
                Profile
              </button>

              <button
                onClick={() =>
                  navigate("/admin/settings")
                }
              >
                <Settings size={16} />
                Settings
              </button>

              <div className="dropdown-divider"></div>

              <button
                className="dropdown-logout"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;