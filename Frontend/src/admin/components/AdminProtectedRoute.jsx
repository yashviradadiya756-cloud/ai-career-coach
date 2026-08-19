import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  // ==========================================
  // GET ADMIN AUTH FROM LOCAL STORAGE
  // ==========================================

  const adminToken = localStorage.getItem("adminToken");
  const adminUserString = localStorage.getItem("adminUser");

  let adminUser = null;

  try {
    if (adminUserString) {
      adminUser = JSON.parse(adminUserString);
    }
  } catch (error) {
    console.error(
      "ADMIN USER PARSE ERROR:",
      error
    );

    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
  }

  // ==========================================
  // DEBUG
  // ==========================================

  console.log("================================");
  console.log("ADMIN PROTECTED ROUTE");
  console.log(
    "Admin Token:",
    !!adminToken
  );
  console.log(
    "Admin User:",
    adminUser
  );
  console.log(
    "Admin Role:",
    adminUser?.role
  );
  console.log("================================");

  // ==========================================
  // CHECK TOKEN
  // ==========================================

  if (!adminToken) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  // ==========================================
  // CHECK ADMIN USER
  // ==========================================

  if (!adminUser) {
    localStorage.removeItem("adminToken");

    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  // ==========================================
  // CHECK ADMIN ROLE
  // ==========================================

  const role = String(
    adminUser.role || ""
  )
    .trim()
    .toLowerCase();

  if (role !== "admin") {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ==========================================
  // ADMIN AUTHENTICATED
  // ==========================================

  return children;
};

export default AdminProtectedRoute;