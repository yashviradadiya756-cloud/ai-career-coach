import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BriefcaseBusiness,
} from "lucide-react";

import { register } from "../api/authApi";
import "../styles/Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

    const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      alert(response.data.message || "Registration Successful");

      navigate("/login");
    } catch (error) {
  console.log(error);
  console.log(error.response);

  alert(error.response?.data?.message || error.message);
}
  };
    return (
    <div className="login-page">

      <div className="logo-area">

        <div className="logo-box">
          <BriefcaseBusiness size={28} />
        </div>

        <div>
          <h2>CareerPilot</h2>
          <p>AI Career Coach</p>
        </div>

      </div>

      <div className="login-card">

        <h1>Create Account</h1>

        <form onSubmit={handleSubmit}>
                      <label>Full Name</label>

          <div className="input-box">
            <User size={20} className="icon" />

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <label>Email Address</label>

          <div className="input-box">
            <Mail size={20} className="icon" />

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <label>Password</label>

          <div className="input-box">
            <Lock size={20} className="icon" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>
          <label>Confirm Password</label>

          <div className="input-box">
            <Lock size={20} className="icon" />

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              {showConfirmPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>
            <button className="login-btn">
            Create Account
          </button>

          <p className="register">
            Already have an account?

            <Link to="/login">
              Sign In
            </Link>
          </p>

        </form>

      </div>

    </div>
  );
}
     
        