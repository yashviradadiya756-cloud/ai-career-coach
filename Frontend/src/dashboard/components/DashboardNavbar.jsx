import React, { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import Logo from "../../assets/CareerPilot Logo.png";
import { Link, useNavigate } from "react-router-dom";

import "../styles/dashboardNavbar.css";

export default function DashboardNavbar() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <header className="dashboard-navbar">

      {/* Logo */}
      <div className="dashboard-logo">
        <img
          src={Logo}
          alt="CareerPilot"
        />
      </div>


      {/* Mobile Menu */}
      <button
        className="dashboard-menu"
        onClick={() => setOpen(!open)}
        aria-label="Toggle Menu"
      >
        {open ? (
          <X size={28} />
        ) : (
          <Menu size={28} />
        )}
      </button>


      {/* Navbar Links */}
      <div
        className={`dashboard-links ${
          open ? "show" : ""
        }`}
      >

        <Link
          to="/"
          onClick={() => setOpen(false)}
        >
          Home
        </Link>


        <Link
          to="/dashboard/overview"
          onClick={() => setOpen(false)}
        >
          Dashboard
        </Link>


        <button
          className="logout-btn"
          onClick={() => {
            const confirmLogout = window.confirm(
              "Are you sure you want to logout?"
            );

            if (confirmLogout) {
              logout();
            }
          }}
        >
          <LogOut size={16} />
          Logout
        </button>

      </div>
    </header>
  );
}