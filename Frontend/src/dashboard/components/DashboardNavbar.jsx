import React, { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import Logo from "../../assets/CareerPilot Logo.png";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboardNavbar.css";

export default function DashboardNavbar() {

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {

  // Remove authentication data
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Redirect to login page
  navigate("/login");

};

  return (
    <header className="dashboard-navbar">

      {/* Logo */}
      <div className="dashboard-logo">
        <img src={Logo} alt="CareerPilot"/>
      </div>


      {/* Menu Icon */}
      <button 
        className="dashboard-menu"
        onClick={() => setOpen(!open)}
      >
        {
          open 
          ? <X size={28}/>
          : <Menu size={28}/>
        }
      </button>


      {/* Navbar Links */}
      <div className={`dashboard-links ${open ? "show" : ""}`}>

        {/* Landing Page */}
        <Link to="/">
          Home
        </Link>


        {/* Dashboard */}
        <Link to="/dashboard/overview">
          Dashboard
        </Link>


        {/* Logout */}
        <button className ="logout-btn"
        onClick={() => {
          const confirmLogout = window.confirm(
            "Are you sure you want to logout?"
          );

          if(confirmLogout){
            logout();
          }
        }}>
        <LogOut size={16}/>
          Logout
        </button>

      </div>

    </header>
  );
}