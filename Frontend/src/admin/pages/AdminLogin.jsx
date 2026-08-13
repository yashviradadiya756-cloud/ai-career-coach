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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
    console.log("========== ADMIN LOGIN ==========");

    const response = await loginUser({
      email,
      password,
    });

    console.log(
      "ADMIN LOGIN RESPONSE:",
      response.data
    );

    // Declare data ONLY ONCE
    const data = response.data;

    const adminUser = data.user;

    console.log(
      "ADMIN USER OBJECT:",
      adminUser
    );

    console.log(
      "ADMIN USER ID:",
      adminUser?._id
    );

    console.log(
      "ADMIN USER EMAIL:",
      adminUser?.email
    );

    console.log(
      "ADMIN USER ROLE:",
      adminUser?.role
    );

    // ==========================================
    // CHECK ADMIN ROLE
    // ==========================================

    if (adminUser?.role !== "admin") {
      setError(
        "This account does not have administrator access."
      );

      return;
    }

    // ==========================================
    // SAVE ADMIN AUTH
    // ==========================================

    localStorage.setItem(
      "adminToken",
      data.token
    );

    localStorage.setItem(
      "adminUser",
      JSON.stringify(adminUser)
    );

    console.log(
      "ADMIN TOKEN SAVED:",
      !!localStorage.getItem("adminToken")
    );

    console.log(
      "ADMIN USER SAVED:",
      JSON.parse(
        localStorage.getItem("adminUser")
      )
    );

    // ==========================================
    // GO TO ADMIN DASHBOARD
    // ==========================================

    navigate("/admin", {
      replace: true,
    });

  } catch (error) {
    console.error(
      "ADMIN LOGIN ERROR:",
      error
    );

    setError(
      error?.response?.data?.message ||
      "Admin login failed"
    );

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="admin-login-page">

      <div className="admin-login-background">
        <div className="admin-login-orb admin-orb-one" />
        <div className="admin-login-orb admin-orb-two" />
      </div>

      <div className="admin-login-card">

        {/* Logo */}
        <div className="admin-login-logo">
          <div className="admin-login-logo-icon">
            <ShieldCheck size={27} />
          </div>

          <div>
            <h2>CareerPilot</h2>
            <span>Administration</span>
          </div>
        </div>

        {/* Heading */}
        <div className="admin-login-heading">
          <h1>Welcome back</h1>

          <p>
            Sign in to access the CareerPilot
            administration panel.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="admin-login-error">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >

          {/* Email */}
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
              />

            </div>
          </div>

          {/* Password */}
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
              />

              <button
                type="button"
                className="admin-password-button"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>
          </div>

          {/* Submit */}
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