import React, { useState } from "react";

import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";

import "../styles/dashboardLayout.css";

const DashboardLayout = ({
  children,
}) => {
  const [isSidebarExpanded, setIsSidebarExpanded] =
    useState(false);

  return (
    <div
      className={`dashboard-layout ${
        isSidebarExpanded
          ? "sidebar-expanded"
          : "sidebar-collapsed"
      }`}
    >

      {/* =========================================
          NAVBAR
      ========================================= */}

      <DashboardNavbar />

      {/* =========================================
          SIDEBAR
      ========================================= */}

      <DashboardSidebar
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />

      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <main className="dashboard-content">
        {children}
      </main>

    </div>
  );
};

export default DashboardLayout;