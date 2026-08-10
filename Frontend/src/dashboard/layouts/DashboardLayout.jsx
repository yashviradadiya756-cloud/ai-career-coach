import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import DashboardNavbar from "../components/DashboardNavbar";
import DashboardSidebar from "../components/DashboardSidebar";

import "../styles/dashboard.css";

export default function DashboardLayout() {
  const [isExpanded, setIsExpanded] = useState(false);

  const location = useLocation();

  const handleSidebarToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  /* ==========================================
     SCROLL DASHBOARD CONTENT TO TOP
  ========================================== */

  useEffect(() => {
    // Browser/page scroll
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    // Dashboard content scroll
    const content = document.querySelector(
      ".dashboard-content"
    );

    if (content) {
      content.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }

    // Sidebar navigation scroll
    const sidebarNav = document.querySelector(
      ".sidebar-nav"
    );

    if (sidebarNav) {
      sidebarNav.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [location.pathname]);

  return (
    <div
      className={`dashboard-layout ${
        isExpanded
          ? "sidebar-expanded"
          : "sidebar-collapsed"
      }`}
    >
      <DashboardNavbar />

      <div className="dashboard-body">

        <DashboardSidebar
          isExpanded={isExpanded}
          onToggle={handleSidebarToggle}
        />

        <main className="dashboard-content">
          <Outlet />
        </main>

      </div>
    </div>
  );
}