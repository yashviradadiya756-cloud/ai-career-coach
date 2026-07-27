import { Outlet } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardSidebar from "../components/DashboardSidebar";
import "../styles/dashboard.css";

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">

      <DashboardNavbar />

      <div className="dashboard-body">

        <DashboardSidebar />

        <main className="dashboard-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}