import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";

import { loginUser } from "../../api/authApi";
import "../styles/adminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // ADMIN LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      console.log("====================================");
      console.log("ADMIN LOGIN STARTED");
      console.log("====================================");

      // ==========================================
      // CALL NORMAL LOGIN API
      // ==========================================

      const response = await loginUser({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      console.log("ADMIN LOGIN API RESPONSE:", response.data);

      const data = response.data;

      // ==========================================
      // CHECK API SUCCESS
      // ==========================================

      if (!data?.success) {
        throw new Error(
          data?.message || "Login failed"
        );
      }

      // ==========================================
      // GET USER
      // ==========================================

      const loggedUser = data.user;

      console.log("LOGGED USER:", loggedUser);
      console.log("USER EMAIL:", loggedUser?.email);
      console.log("USER ROLE:", loggedUser?.role);

      if (!loggedUser) {
        throw new Error(
          "User information was not returned."
        );
      }

      // ==========================================
      // CHECK ADMIN ROLE
      // ==========================================

      const role = String(loggedUser.role || "")
        .trim()
        .toLowerCase();

      console.log("NORMALIZED ROLE:", role);

      if (role !== "admin") {
        throw new Error(
          "This account does not have administrator access."
        );
      }

      // ==========================================
      // CHECK TOKEN
      // ==========================================

      if (!data.token) {
        throw new Error(
          "Authentication token was not returned."
        );
      }

      // ==========================================
      // CLEAR OLD USER AUTH
      // ==========================================

      localStorage.removeItem("username");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("user");

      // ==========================================
      // SAVE ADMIN AUTH
      // ==========================================

      localStorage.setItem(
        "adminToken",
        data.token
      );

      localStorage.setItem(
        "adminUser",
        JSON.stringify(loggedUser)
      );

      // Your protect middleware uses "token",
      // so keep the JWT here as well.
      localStorage.setItem(
        "token",
        data.token
      );

      console.log("====================================");
      console.log("ADMIN AUTH SAVED");
      console.log(
        "adminToken:",
        !!localStorage.getItem("adminToken")
      );
      console.log(
        "token:",
        !!localStorage.getItem("token")
      );
      console.log(
        "adminUser:",
        localStorage.getItem("adminUser")
      );
      console.log("====================================");

      // ==========================================
      // GO DIRECTLY TO ADMIN DASHBOARD
      // ==========================================

      navigate("/admin", {
        replace: true,
      });

    } catch (error) {
      console.error("====================================");
      console.error("ADMIN LOGIN ERROR");
      console.error("====================================");

      console.error("Error:", error);
      console.error(
        "Server response:",
        error?.response?.data
      );

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Admin login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="admin-login-page">

      <div className="admin-login-background">
        <div className="admin-login-orb admin-orb-one" />
        <div className="admin-login-orb admin-orb-two" />
      </div>

      <div className="admin-login-card">

        {/* ======================================
            LOGO
        ====================================== */}

        <div className="admin-login-logo">

          <div className="admin-login-logo-icon">
            <ShieldCheck size={27} />
          </div>

          <div>
            <h2>CareerPilot</h2>
            <span>Administration</span>
          </div>

        </div>

        {/* ======================================
            HEADING
        ====================================== */}

        <div className="admin-login-heading">

          <h1>Welcome back</h1>

          <p>
            Sign in to access the CareerPilot
            administration panel.
          </p>

        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="admin-login-error">
            {error}
          </div>
        )}

        {/* ======================================
            FORM
        ====================================== */}

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >

          {/* ====================================
              EMAIL
          ==================================== */}

          <div className="admin-input-group">

            <label htmlFor="admin-email">
              Admin Email
            </label>

            <div className="admin-input-wrapper">

              <Mail
                size={18}
                className="admin-input-icon"
              />

              <input
                id="admin-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="yashvi@careerpilot.com"
                autoComplete="email"
                disabled={loading}
                required
              />

            </div>

          </div>

          {/* ====================================
              PASSWORD
          ==================================== */}

          <div className="admin-input-group">

            <label htmlFor="admin-password">
              Password
            </label>

            <div className="admin-input-wrapper">

              <Lock
                size={18}
                className="admin-input-icon"
              />

              <input
                id="admin-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
                required
              />

              <button
                type="button"
                className="admin-password-button"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </div>

          {/* ====================================
              SUBMIT
          ==================================== */}

          <button
            type="submit"
            className="admin-login-submit"
            disabled={loading}
          >

            {loading ? (
              <>
                <span className="admin-button-spinner" />
                Signing in...
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                Sign in to Admin Panel
              </>
            )}

          </button>

        </form>

        {/* ======================================
            FOOTER
        ====================================== */}

        <div className="admin-login-footer">

          <span>
            Authorized administrators only
          </span>

        </div>

      </div>

    </div>
  );
};

export default AdminLogin;