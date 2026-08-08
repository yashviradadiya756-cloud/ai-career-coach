import React, { useEffect, useState } from "react";

import {
  getSettings,
  updateProfile,
  updatePreferences,
  changePassword,
  deleteAccount,
} from "../../api/settingsApi";

export default function Settings() {
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  // ==========================
  // LOAD SETTINGS
  // ==========================

  useEffect(() => {
    loadSettings();
  }, []);


  const loadSettings = async () => {
    try {
      setLoading(true);

      const response = await getSettings();

      const data = response.data.user;

      setUser(data);

      setName(data.name || "");
      setUsername(data.username || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");

      setDarkMode(data.preferences?.darkMode || false);

      setEmailNotifications(
        data.preferences?.emailNotifications ?? true
      );

      setPushNotifications(
        data.preferences?.pushNotifications ?? true
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load settings"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // UPDATE PROFILE
  // ==========================

  const handleProfileSave = async (e) => {
    e.preventDefault();

    try {
      setSavingProfile(true);
      setMessage("");
      setError("");

      const response = await updateProfile({
        name,
        username,
        phone,
      });

      setUser(response.data.user);

      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSavingProfile(false);
    }
  };


  // ==========================
  // UPDATE PREFERENCE
  // ==========================

  const handlePreferenceChange = async (
    setting,
    value
  ) => {
    try {
      setMessage("");
      setError("");

      if (setting === "darkMode") {
        setDarkMode(value);
      }

      if (setting === "emailNotifications") {
        setEmailNotifications(value);
      }

      if (setting === "pushNotifications") {
        setPushNotifications(value);
      }

      await updatePreferences({
        [setting]: value,
      });

      setMessage("Preference updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update preference"
      );
    }
  };

  const updateProfile = async (req, res) => {
  try {
    const {
      name,
      username,
      phone,
    } = req.body;

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Full name cannot be empty",
        });
      }

      user.name = name.trim();
    }

    if (username !== undefined) {
      if (!username.trim()) {
        return res.status(400).json({
          success: false,
          message: "Username cannot be empty",
        });
      }

      user.username = username.trim();
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    await user.save();

    const updatedUser =
      await User.findById(
        req.user._id
      ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      "Update Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

  // ==========================
  // CHANGE PASSWORD
  // ==========================

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      setSavingPassword(true);
      setMessage("");
      setError("");

      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage("Password changed successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to change password"
      );
    } finally {
      setSavingPassword(false);
    }
  };


  // ==========================
  // DELETE ACCOUNT
  // ==========================

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account?"
    );

    if (!confirmed) return;

    try {
      await deleteAccount();

      localStorage.removeItem("token");

      window.location.href = "/login";
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete account"
      );
    }
  };


  // ==========================
  // LOADING
  // ==========================

  if (loading) {
    return (
      <div style={styles.loading}>
        Loading settings...
      </div>
    );
  }


  return (
    <div
      style={{
        ...styles.container,
        background: darkMode ? "#111827" : "#f5f7fb",
        color: darkMode ? "#fff" : "#111827",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          ...styles.header,
          background: darkMode ? "#1f2937" : "#fff",
        }}
      >
        <div>
          <h1 style={styles.title}>
            ⚙️ Settings
          </h1>

          <p style={styles.subtitle}>
            Manage your profile, preferences and account.
          </p>
        </div>
      </div>


      {/* MESSAGE */}

      {message && (
        <div style={styles.success}>
          ✓ {message}
        </div>
      )}

      {error && (
        <div style={styles.error}>
          ⚠ {error}
        </div>
      )}


      {/* PROFILE */}

      <div
        style={{
          ...styles.section,
          background: darkMode ? "#1f2937" : "#fff",
        }}
      >

        <div style={styles.sectionHeader}>
          <div style={styles.iconBox}>
            👤
          </div>

          <div>
            <h2 style={styles.sectionTitle}>
              Profile
            </h2>

            <p style={styles.sectionDescription}>
              Update your personal information.
            </p>
          </div>
        </div>


        <form onSubmit={handleProfileSave}>

          <div style={styles.avatarContainer}>
            <div style={styles.avatar}>
              {username
                ? username.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div>
              <h3 style={{ margin: 0 }}>
                {username || "User"}
              </h3>

              <p style={styles.smallText}>
                {email}
              </p>
            </div>
          </div>


          <div style={styles.formGrid}>

            <div>
              <label style={styles.label}>
                Full Name
              </label>

              <input
                type="text"
                style={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>


            <div>
              <label style={styles.label}>
                Email
              </label>

              <input
                style={{
                  ...styles.input,
                  background: darkMode
                    ? "#374151"
                    : "#f3f4f6",
                }}
                value={email}
                disabled
              />

              <small style={styles.smallText}>
                Email cannot be changed here.
              </small>
            </div>


            <div>
              <label style={styles.label}>
                Phone Number
              </label>

              <input
                style={styles.input}
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="Enter phone number"
              />
            </div>

          </div>


          <button
            type="submit"
            style={styles.primaryButton}
            disabled={savingProfile}
          >
            {savingProfile
              ? "Saving..."
              : "Save Profile"}
          </button>

        </form>

      </div>


      {/* APPEARANCE */}

      <div
        style={{
          ...styles.section,
          background: darkMode ? "#1f2937" : "#fff",
        }}
      >

        <div style={styles.sectionHeader}>
          <div style={styles.iconBox}>
            🎨
          </div>

          <div>
            <h2 style={styles.sectionTitle}>
              Appearance
            </h2>

            <p style={styles.sectionDescription}>
              Customize how CareerPilot looks.
            </p>
          </div>
        </div>


        <div style={styles.settingRow}>

          <div>
            <strong>Dark Mode</strong>

            <p style={styles.smallText}>
              Use dark theme throughout the dashboard.
            </p>
          </div>

          <label style={styles.switch}>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) =>
                handlePreferenceChange(
                  "darkMode",
                  e.target.checked
                )
              }
            />

            <span style={styles.slider}></span>
          </label>

        </div>

      </div>


      {/* NOTIFICATIONS */}

      <div
        style={{
          ...styles.section,
          background: darkMode ? "#1f2937" : "#fff",
        }}
      >

        <div style={styles.sectionHeader}>
          <div style={styles.iconBox}>
            🔔
          </div>

          <div>
            <h2 style={styles.sectionTitle}>
              Notifications
            </h2>

            <p style={styles.sectionDescription}>
              Control how you receive updates.
            </p>
          </div>
        </div>


        <div style={styles.settingRow}>

          <div>
            <strong>Email Notifications</strong>

            <p style={styles.smallText}>
              Receive career updates through email.
            </p>
          </div>

          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) =>
              handlePreferenceChange(
                "emailNotifications",
                e.target.checked
              )
            }
          />

        </div>


        <div style={styles.settingRow}>

          <div>
            <strong>Push Notifications</strong>

            <p style={styles.smallText}>
              Receive notifications in the application.
            </p>
          </div>

          <input
            type="checkbox"
            checked={pushNotifications}
            onChange={(e) =>
              handlePreferenceChange(
                "pushNotifications",
                e.target.checked
              )
            }
          />

        </div>

      </div>


      {/* SECURITY */}

      <div
        style={{
          ...styles.section,
          background: darkMode ? "#1f2937" : "#fff",
        }}
      >

        <div style={styles.sectionHeader}>
          <div style={styles.iconBox}>
            🔐
          </div>

          <div>
            <h2 style={styles.sectionTitle}>
              Security
            </h2>

            <p style={styles.sectionDescription}>
              Keep your account secure.
            </p>
          </div>
        </div>


        <form onSubmit={handlePasswordChange}>

          <div style={styles.formGrid}>

            <div>
              <label style={styles.label}>
                Current Password
              </label>

              <input
                type="password"
                style={styles.input}
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                placeholder="Current password"
              />
            </div>


            <div>
              <label style={styles.label}>
                New Password
              </label>

              <input
                type="password"
                style={styles.input}
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                placeholder="New password"
              />
            </div>


            <div>
              <label style={styles.label}>
                Confirm New Password
              </label>

              <input
                type="password"
                style={styles.input}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm new password"
              />
            </div>

          </div>


          <button
            type="submit"
            style={styles.primaryButton}
            disabled={savingPassword}
          >
            {savingPassword
              ? "Updating..."
              : "Change Password"}
          </button>

        </form>

      </div>


      {/* ACCOUNT */}

      <div
        style={{
          ...styles.section,
          background: darkMode ? "#1f2937" : "#fff",
        }}
      >

        <div style={styles.sectionHeader}>
          <div style={styles.iconBox}>
            ⚠️
          </div>

          <div>
            <h2 style={styles.sectionTitle}>
              Account
            </h2>

            <p style={styles.sectionDescription}>
              Manage your CareerPilot account.
            </p>
          </div>
        </div>


        <div style={styles.accountActions}>

          <button
            style={styles.exportButton}
            onClick={() =>
              alert("Data export feature can be connected next.")
            }
          >
            📥 Export Data
          </button>


          <button
            style={styles.deleteButton}
            onClick={handleDeleteAccount}
          >
            🗑 Delete Account
          </button>

        </div>

      </div>

    </div>
  );
}


// =====================================
// STYLES
// =====================================

const styles = {

  container: {
    padding: "30px",
    minHeight: "100vh",
    transition: "0.3s",
  },

  loading: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
  },

  header: {
    padding: "28px",
    borderRadius: "16px",
    marginBottom: "20px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  },

  title: {
    margin: 0,
    fontSize: "30px",
  },

  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
  },

  section: {
    padding: "25px",
    borderRadius: "16px",
    marginBottom: "20px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "25px",
  },

  iconBox: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eff6ff",
    fontSize: "22px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "21px",
  },

  sectionDescription: {
    margin: "5px 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },

  avatarContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "25px",
  },

  avatar: {
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "25px",
    fontWeight: "bold",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "20px",
  },

  label: {
    display: "block",
    fontWeight: "600",
    marginBottom: "8px",
  },

  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  smallText: {
    color: "#6b7280",
    fontSize: "13px",
    marginTop: "5px",
  },

  primaryButton: {
    padding: "12px 22px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  settingRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 0",
    borderBottom: "1px solid #e5e7eb",
  },

  switch: {
    position: "relative",
    display: "inline-block",
  },

  slider: {
    display: "block",
  },

  accountActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  exportButton: {
    padding: "12px 20px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  deleteButton: {
    padding: "12px 20px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
};