import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "./components/AdminSidebar";
import AdminNavbar from "./components/AdminNavbar";

import "./styles/adminLayout.css";

const AdminLayout = () => {
  return (
    <div className="admin-layout">

      <AdminSidebar />

      <main className="admin-main">

        <AdminNavbar />

        <Outlet />

      </main>

    </div>
  );
};

export default AdminLayout;