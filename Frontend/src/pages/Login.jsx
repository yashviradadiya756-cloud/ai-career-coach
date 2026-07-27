import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {Mail,Lock,Eye,EyeOff,BriefcaseBusiness,} from "lucide-react";
import { login } from "../api/authApi";

import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
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

        {/* <span className="small-title">
          Please enter your details
        </span> */}

        <h1>
          Welcome
        </h1>

        {/* <p className="subtitle">
          Login to continue your AI powered career journey.
        </p> */}

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}

          <label>Email Address</label>

          <div className="input-box">

            <Mail size={20} className="icon"/>

            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
            />

          </div>

          {/* PASSWORD */}

          <label>Password</label>

          <div className="input-box">

            <Lock size={20} className="icon"/>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={20}/>
              ) : (
                <Eye size={20}/>
              )}
            </button>

          </div>

          <div className="remember-row">

            <label className="remember">

              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />

              Remember for 30 days

            </label>

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

          </div>

          <button className="login-btn">
            Sign In
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

         <button
            type="button"
            className="google-btn">
        <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
        />

        <span>Continue with Google</span>
        </button>

          <p className="register">

            Don't have an account?

            <Link to="/register">
              Sign Up
            </Link>

          </p>

        </form>

      </div>

    </div>
  );
}