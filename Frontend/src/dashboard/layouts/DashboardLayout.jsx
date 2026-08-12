import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import DashboardSidebar from "../components/DashboardSidebar";
import DashboardNavbar from "../components/DashboardNavbar";

import "../styles/dashboardLayout.css";

const DashboardLayout = () => {
  // Sidebar stays in the same state while navigating
  const [isExpanded, setIsExpanded] = useState(true);

  const location = useLocation();

  // Scroll dashboard content to top whenever page changes
  useEffect(() => {
    const content = document.querySelector(".dashboard-page-content");

    if (content) {
      content.scrollTop = 0;
    }
  }, [location.pathname]);

  const handleSidebarToggle = () => {
    setIsExpanded((previousState) => !previousState);
  };

  return (
    <div className="dashboard-layout">

      {/* =====================================================
          TOP NAVBAR
      ===================================================== */}

      <DashboardNavbar />


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <DashboardSidebar
        isExpanded={isExpanded}
        onToggle={handleSidebarToggle}
      />


      {/* =====================================================
          MAIN DASHBOARD AREA
      ===================================================== */}

      <main
        className={
          isExpanded
            ? "dashboard-main-area sidebar-expanded"
            : "dashboard-main-area sidebar-collapsed"
        }
      >

        <div className="dashboard-page-content">
          <Outlet />
        </div>

      </main>

    </div>
  );
};

export default DashboardLayout;