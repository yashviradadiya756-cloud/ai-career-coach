import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Camera,
  Moon,
  Bell,
  Globe,
  Save,
} from "lucide-react";
import "./Settings.css";

export default function Settings() {

  const [form, setForm] = useState({
    name: "Admin",
    email: "admin@careerpilot.com",
    phone: "+91 9876543210",
    password: "",
    language: "English",
    notifications: true,
    darkMode: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const saveSettings = () => {
    alert("Settings Saved Successfully!");
  };

  return (
    <div className="settings-page">

      <h2>Admin Settings</h2>

      <div className="profile-card">

        <div className="profile-image">

          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="Admin"/>

          <button>
            <Camera size={18}/>
          </button>

        </div>

        <div className="profile-form">

          <div className="form-group">
            <label><User size={18}/> Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label><Mail size={18}/> Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label><Phone size={18}/> Mobile</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label><Lock size={18}/> Change Password</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label><Globe size={18}/> Language</label>

            <select
              name="language"
              value={form.language}
              onChange={handleChange}
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Gujarati</option>
            </select>

          </div>

          <div className="toggle">

            <label>
              <Bell size={18}/>
              Enable Notifications
            </label>

            <input
              type="checkbox"
              name="notifications"
              checked={form.notifications}
              onChange={handleChange}
            />

          </div>

          <div className="toggle">

            <label>
              <Moon size={18}/>
              Dark Mode
            </label>

            <input
              type="checkbox"
              name="darkMode"
              checked={form.darkMode}
              onChange={handleChange}
            />

          </div>

          <button
            className="save-btn"
            onClick={saveSettings}
          >
            <Save size={18}/>
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}