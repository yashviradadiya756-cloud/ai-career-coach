import React, { useEffect, useState, useRef } from "react";
import {
  getSettings,
  updateProfile,
  updatePreferences,
  changePassword,
  deleteAccount,
} from "../../api/settingsApi";
import { useTheme } from "../../context/ThemeContext"; // ✅ Global dark mode

export default function Settings() {
  // ✅ Dark mode comes from global context — works on ALL pages
  const { darkMode, setDarkMode } = useTheme();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Profile photo
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const fileInputRef = useRef(null);

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

  // Auto-clear messages after 4 seconds
  const showSuccess = (text) => {
    setMessage(text);
    setError("");
    setTimeout(() => setMessage(""), 4000);
  };

  const showError = (text) => {
    setError(text);
    setMessage("");
    setTimeout(() => setError(""), 5000);
  };

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
      setEmailNotifications(data.preferences?.emailNotifications ?? true);
      setPushNotifications(data.preferences?.pushNotifications ?? true);

      // Load saved profile photo
      if (data.profilePhoto) {
        setPhotoPreview(data.profilePhoto);
      }
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // PHOTO SELECTION
  // ==========================
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showError("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showError("Image must be smaller than 5MB.");
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    e.target.value = ""; // allow re-selecting same file
  };

  // ==========================
  // UPDATE PROFILE
  // ✅ Fixed: sends FormData (supports photo)
  // ✅ Fixed: no backend code mixed in here
  // ==========================
  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setMessage("");
      setError("");

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("username", username.trim());
      formData.append("phone", phone.trim());
      if (photoFile) {
        formData.append("profilePhoto", photoFile);
      }

      const response = await updateProfile(formData);
      const updatedUser = response.data.user;

      setUser(updatedUser);
      setName(updatedUser.name || "");
      setUsername(updatedUser.username || "");
      setPhone(updatedUser.phone || "");
      if (updatedUser.profilePhoto) {
        setPhotoPreview(updatedUser.profilePhoto);
      }
      setPhotoFile(null);
      showSuccess("Profile updated successfully.");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // ==========================
  // UPDATE PREFERENCES
  // ==========================
  const handlePreferenceChange = async (setting, value) => {
    try {
      // ✅ setDarkMode updates global ThemeContext → all pages go dark
      if (setting === "darkMode") setDarkMode(value);
      if (setting === "emailNotifications") setEmailNotifications(value);
      if (setting === "pushNotifications") setPushNotifications(value);

      await updatePreferences({ [setting]: value });
      showSuccess("Preference updated.");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update preference");
    }
  };

  // ==========================
  // CHANGE PASSWORD
  // ✅ Fixed: validates before calling API
  // ==========================
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      showError("All password fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      showError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showError("New passwords do not match.");
      return;
    }

    try {
      setSavingPassword(true);
      await changePassword({ currentPassword, newPassword, confirmPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showSuccess("Password changed successfully.");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  // ==========================
  // DELETE ACCOUNT
  // ✅ Calls API that removes user from MongoDB
  // ==========================
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteAccount();
      localStorage.removeItem("token");
      localStorage.removeItem("darkMode");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete account");
    }
  };

  // ==========================
  // LOADING
  // ==========================
  if (loading) {
    return (
      <div style={styles.loading}>Loading settings...</div>
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
      <div style={{ ...styles.header, background: darkMode ? "#1f2937" : "#fff" }}>
        <h1 style={styles.title}>⚙️ Settings</h1>
        <p style={styles.subtitle}>Manage your profile, preferences and account.</p>
      </div>

      {/* MESSAGES */}
      {message && <div style={styles.success}>✓ {message}</div>}
      {error && <div style={styles.error}>⚠ {error}</div>}

      {/* ======================== */}
      {/* PROFILE SECTION          */}
      {/* ======================== */}
      <div style={{ ...styles.section, background: darkMode ? "#1f2937" : "#fff" }}>
        <div style={styles.sectionHeader}>
          <div style={styles.iconBox}>👤</div>
          <div>
            <h2 style={styles.sectionTitle}>Profile</h2>
            <p style={styles.sectionDescription}>Update your personal information and photo.</p>
          </div>
        </div>

        <form onSubmit={handleProfileSave}>
          {/* Photo Upload */}
          <div style={styles.avatarContainer}>
            <div
              style={styles.avatarWrapper}
              onClick={() => fileInputRef.current.click()}
              title="Click to change photo"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" style={styles.avatarImg} />
              ) : (
                <div style={styles.avatar}>
                  {username ? username.charAt(0).toUpperCase() : "U"}
                </div>
              )}
              <div style={styles.avatarOverlay}>📷</div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoSelect}
            />

            <div>
              <h3 style={{ margin: 0 }}>{username || "User"}</h3>
              <p style={styles.smallText}>{email}</p>
              <small style={{ color: "#3b82f6", fontSize: "13px" }}>
                Click photo to change
              </small>
            </div>
          </div>

          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                style={{ ...styles.input, ...darkInput(darkMode) }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                style={{ ...styles.input, ...darkInput(darkMode) }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label style={styles.label}>Email</label>
              <input
                style={{
                  ...styles.input,
                  background: darkMode ? "#374151" : "#f3f4f6",
                  color: darkMode ? "#9ca3af" : "#6b7280",
                  borderColor: darkMode ? "#4b5563" : "#d1d5db",
                }}
                value={email}
                disabled
              />
              <small style={styles.smallText}>Email cannot be changed.</small>
            </div>

            <div>
              <label style={styles.label}>Phone Number</label>
              <input
                style={{ ...styles.input, ...darkInput(darkMode) }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <button type="submit" style={styles.primaryButton} disabled={savingProfile}>
            {savingProfile ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>

      {/* ======================== */}
      {/* APPEARANCE SECTION       */}
      {/* ======================== */}
      <div style={{ ...styles.section, background: darkMode ? "#1f2937" : "#fff" }}>
        <div style={styles.sectionHeader}>
          <div style={styles.iconBox}>🎨</div>
          <div>
            <h2 style={styles.sectionTitle}>Appearance</h2>
            <p style={styles.sectionDescription}>
              Dark mode applies to ALL pages, not just this one.
            </p>
          </div>
        </div>

        <div style={styles.settingRow}>
          <div>
            <strong>Dark Mode</strong>
            <p style={styles.smallText}>Use dark theme throughout the entire app.</p>
          </div>
          {/* Toggle switch */}
          <label style={{ cursor: "pointer" }} onClick={() =>
            handlePreferenceChange("darkMode", !darkMode)
          }>
            <div style={{
              width: "46px", height: "26px", borderRadius: "13px",
              background: darkMode ? "#2563eb" : "#d1d5db",
              position: "relative", transition: "background 0.3s",
            }}>
              <div style={{
                position: "absolute", top: "3px",
                left: darkMode ? "22px" : "2px",
                width: "20px", height: "20px", borderRadius: "50%",
                background: "#fff", transition: "left 0.3s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
              }} />
            </div>
          </label>
        </div>
      </div>

      {/* ======================== */}
      {/* NOTIFICATIONS SECTION    */}
      {/* ======================== */}
      <div style={{ ...styles.section, background: darkMode ? "#1f2937" : "#fff" }}>
        <div style={styles.sectionHeader}>
          <div style={styles.iconBox}>🔔</div>
          <div>
            <h2 style={styles.sectionTitle}>Notifications</h2>
            <p style={styles.sectionDescription}>Control how you receive updates.</p>
          </div>
        </div>

        <div style={styles.settingRow}>
          <div>
            <strong>Email Notifications</strong>
            <p style={styles.smallText}>Receive career updates through email.</p>
          </div>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => handlePreferenceChange("emailNotifications", e.target.checked)}
          />
        </div>

        <div style={styles.settingRow}>
          <div>
            <strong>Push Notifications</strong>
            <p style={styles.smallText}>Receive notifications in the application.</p>
          </div>
          <input
            type="checkbox"
            checked={pushNotifications}
            onChange={(e) => handlePreferenceChange("pushNotifications", e.target.checked)}
          />
        </div>
      </div>

      {/* ======================== */}
      {/* SECURITY SECTION         */}
      {/* ======================== */}
      <div style={{ ...styles.section, background: darkMode ? "#1f2937" : "#fff" }}>
        <div style={styles.sectionHeader}>
          <div style={styles.iconBox}>🔐</div>
          <div>
            <h2 style={styles.sectionTitle}>Security</h2>
            <p style={styles.sectionDescription}>Keep your account secure.</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange}>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Current Password</label>
              <input
                type="password"
                style={{ ...styles.input, ...darkInput(darkMode) }}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
              />
            </div>

            <div>
              <label style={styles.label}>New Password</label>
              <input
                type="password"
                style={{ ...styles.input, ...darkInput(darkMode) }}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min. 6 characters)"
              />
            </div>

            <div>
              <label style={styles.label}>Confirm New Password</label>
              <input
                type="password"
                style={{ ...styles.input, ...darkInput(darkMode) }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <button type="submit" style={styles.primaryButton} disabled={savingPassword}>
            {savingPassword ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>

      {/* ======================== */}
      {/* ACCOUNT SECTION          */}
      {/* ======================== */}
      <div style={{ ...styles.section, background: darkMode ? "#1f2937" : "#fff" }}>
        <div style={styles.sectionHeader}>
          <div style={styles.iconBox}>⚠️</div>
          <div>
            <h2 style={styles.sectionTitle}>Account</h2>
            <p style={styles.sectionDescription}>Manage your CareerPilot account.</p>
          </div>
        </div>

        <div style={styles.accountActions}>
          <button
            style={styles.exportButton}
            onClick={() => alert("Data export coming soon.")}
          >
            📥 Export Data
          </button>

          <button style={styles.deleteButton} onClick={handleDeleteAccount}>
            🗑 Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper for dark mode inputs
const darkInput = (dark) => ({
  background: dark ? "#374151" : "#fff",
  color: dark ? "#fff" : "#111827",
  borderColor: dark ? "#4b5563" : "#d1d5db",
});

// =====================================
// STYLES
// =====================================
const styles = {
  container: { 
    padding: "30px", 
    minHeight: "100vh", 
    transition: "0.3s" 
  },
  loading: { 
    minHeight: "100vh",
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    fontSize: "20px" 
  },
  header: { 
    padding: "28px", 
    borderRadius: "16px", 
    marginBottom: "20px", 
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)" 
  },
  title: { 
    margin: 0, 
    fontSize: "30px" 
  },
  subtitle: { 
    marginTop: "8px", 
    color: "#6b7280" 
  },
  section: { 
    padding: "25px", 
    borderRadius: "16px", 
    marginBottom: "20px", 
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
  },
  sectionHeader: { 
    display: "flex", 
    alignItems: "center", 
    gap: "15px", 
    marginBottom: "25px" 
  },
  iconBox: { 
    width: "45px", 
    height: "45px", 
    borderRadius: "12px", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    background: "#eff6ff", 
    fontSize: "22px" 
  },
  sectionTitle: { 
    margin: 0, 
    fontSize: "21px" 
  },
  sectionDescription: { 
    margin: "5px 0 0", 
    color: "#6b7280", 
    fontSize: "14px" 
  },
  avatarContainer: { 
    display: "flex", 
    alignItems: "center", 
    gap: "15px", 
    marginBottom: "25px" 
  },
  avatarWrapper: { 
    position: "relative", 
    cursor: "pointer", 
    width: "70px", 
    height: "70px", 
    borderRadius: "50%", 
    overflow: "hidden", 
    flexShrink: 0 
  },
  avatarImg: { 
    width: "100%", 
    height: "100%", 
    objectFit: "cover" 
  },
  avatar: { 
    width: "70px", 
    height: "70px", 
    borderRadius: "50%", 
    background: "#2563eb", 
    color: "#fff", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    fontSize: "25px", 
    fontWeight: "bold" 
  },
  avatarOverlay: { 
    position: "absolute", 
    bottom: 0, left: 0, right: 0, 
    background: "rgba(0,0,0,0.5)", 
    color: "#fff", 
    textAlign: "center", 
    fontSize: "14px", 
    padding: "2px 0" 
  },
  formGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
    gap: "20px", 
    marginBottom: "20px" 
  },
  label: { 
    display: "block", 
    fontWeight: "600", 
    marginBottom: "8px" 
  },
  input: { 
    width: "100%", 
    padding: "12px", 
    border: "1px solid #d1d5db", 
    borderRadius: "8px", 
    fontSize: "15px", 
    boxSizing: "border-box" 
  },
  smallText: { 
    color: "#6b7280", 
    fontSize: "13px", 
    marginTop: "5px" 
  },
  primaryButton: { 
    padding: "12px 22px", 
    background: "#2563eb", 
    color: "#fff", 
    border: "none", 
    borderRadius: "8px", 
    cursor: "pointer", 
    fontWeight: "600" 
  },
  settingRow: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: "18px 0", 
    borderBottom: "1px solid #e5e7eb" 
  },
  accountActions: { 
    display: "flex", 
    gap: "12px", 
    flexWrap: "wrap" 
  },
  exportButton: { 
    padding: "12px 20px", 
    background: "#16a34a", 
    color: "#fff", 
    border: "none", 
    borderRadius: "8px", 
    cursor: "pointer", 
    fontWeight: "600" 
  },
  deleteButton: { 
    padding: "12px 20px", 
    background: "#dc2626", 
    color: "#fff", 
    border: "none", 
    borderRadius: "8px", 
    cursor: "pointer", 
    fontWeight: "600" 
  },
  success: { 
    background: "#dcfce7", 
    color: "#166534", 
    padding: "12px 16px", 
    borderRadius: "8px", 
    marginBottom: "20px" 
  },
  error: { 
    background: "#fee2e2", 
    color: "#991b1b", 
    padding: "12px 16px", 
    borderRadius: "8px", 
    marginBottom: "20px" 
  },
};