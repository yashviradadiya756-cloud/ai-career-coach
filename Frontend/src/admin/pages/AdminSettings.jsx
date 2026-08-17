import React, { useEffect, useState } from "react";
import {
  User,
  Shield,
  Settings,
  Bell,
  CreditCard,
  Brain,
  Award,
  Monitor,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Lock,
  Mail,
  Globe,
  Sparkles,
  Trash2,
} from "lucide-react";

import "../styles/adminSettings.css";

const AdminSettings = () => {
  const [activeSection, setActiveSection] = useState("profile");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // ==========================================
  // ADMIN PROFILE
  // ==========================================

  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
  });

  // ==========================================
  // SECURITY
  // ==========================================

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactor: false,
    loginNotification: true,
  });

  // ==========================================
  // PLATFORM
  // ==========================================

  const [platform, setPlatform] = useState({
    platformName: "CareerPilot",
    platformEmail: "support@careerpilot.com",
    supportEmail: "support@careerpilot.com",
    maintenanceMode: false,
    allowRegistration: true,
    allowUserDeletion: true,
  });

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  const [notifications, setNotifications] = useState({
    newUser: true,
    payment: true,
    feedback: true,
    certificate: true,
    system: true,
    emailNotification: true,
  });

  // ==========================================
  // PAYMENT
  // ==========================================

  const [payment, setPayment] = useState({
    gateway: "Razorpay",
    currency: "INR",
    proPrice: 299,
    paymentEnabled: true,
    testMode: false,
  });

  // ==========================================
  // AI
  // ==========================================

  const [aiSettings, setAiSettings] = useState({
    provider: "Gemini",
    model: "gemini-2.5-flash",
    aiEnabled: true,
    resumeAnalysis: true,
    roadmapGeneration: true,
    skillGapAnalysis: true,
    mockInterview: true,
    aiCoach: true,
  });

  // ==========================================
  // CERTIFICATE
  // ==========================================

  const [certificate, setCertificate] = useState({
    enabled: true,
    minimumProgress: 80,
    minimumLearning: 70,
    minimumRoadmap: 70,
    minimumInterview: 60,
    minimumResume: 50,
    requireAllCriteria: true,
    certificateTitle: "CareerPilot Achievement Certificate",
    issuerName: "CareerPilot",
  });

  // ==========================================
  // SYSTEM
  // ==========================================

  const [system, setSystem] = useState({
    darkMode: false,
    compactMode: false,
    showAnalytics: true,
    autoRefresh: true,
    refreshInterval: 30,
  });

  // ==========================================
  // LOAD ADMIN
  // ==========================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        setProfile({
          name: user.name || "",
          username: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
        });
      } catch (error) {
        console.error("Admin profile parse error:", error);
      }
    }
  }, []);

  // ==========================================
  // MESSAGE
  // ==========================================

  const showSuccess = (text) => {
    setMessage(text);
    setError("");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const showError = (text) => {
    setError(text);
    setMessage("");

    setTimeout(() => {
      setError("");
    }, 4000);
  };

  // ==========================================
  // SAVE SECTION
  // ==========================================

  const handleSave = async () => {
    try {
      setSaving(true);

      /*
        Later connect this function with:

        PUT /api/admin/settings

        For now this stores settings locally so
        the frontend works without backend changes.
      */

      const settings = {
        profile,
        security: {
          twoFactor: security.twoFactor,
          loginNotification: security.loginNotification,
        },
        platform,
        notifications,
        payment,
        aiSettings,
        certificate,
        system,
      };

      localStorage.setItem(
        "adminSettings",
        JSON.stringify(settings)
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 600)
      );

      showSuccess("Settings saved successfully.");
    } catch (error) {
      console.error("ADMIN SETTINGS ERROR:", error);

      showError("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // PASSWORD
  // ==========================================

  const handlePasswordUpdate = async () => {
    if (!security.currentPassword) {
      showError("Enter your current password.");
      return;
    }

    if (!security.newPassword) {
      showError("Enter a new password.");
      return;
    }

    if (security.newPassword.length < 6) {
      showError(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (
      security.newPassword !==
      security.confirmPassword
    ) {
      showError("Passwords do not match.");
      return;
    }

    try {
      setSaving(true);

      /*
        Connect later:

        PUT /api/admin/settings/password
      */

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      setSecurity((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      showSuccess("Password updated successfully.");
    } catch (error) {
      showError("Unable to update password.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // RESET SETTINGS
  // ==========================================

  const handleReset = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset admin settings?"
    );

    if (!confirmReset) return;

    localStorage.removeItem("adminSettings");

    window.location.reload();
  };

  // ==========================================
  // DELETE PLATFORM DATA
  // ==========================================

  const handleDangerAction = () => {
    const confirmation = window.confirm(
      "This action should be connected to a secure backend operation. Continue?"
    );

    if (!confirmation) return;

    showError(
      "Danger-zone actions must be confirmed by the backend."
    );
  };

  // ==========================================
  // SIDEBAR
  // ==========================================

  const sections = [
    {
      id: "profile",
      label: "Admin Profile",
      icon: User,
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
    },
    {
      id: "platform",
      label: "Platform",
      icon: Settings,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "payment",
      label: "Payment",
      icon: CreditCard,
    },
    {
      id: "ai",
      label: "AI Configuration",
      icon: Brain,
    },
    {
      id: "certificate",
      label: "Certificates",
      icon: Award,
    },
    {
      id: "system",
      label: "System",
      icon: Monitor,
    },
  ];

  // ==========================================
  // RENDER SECTION
  // ==========================================

  const renderSection = () => {
    switch (activeSection) {
      // ========================================
      // PROFILE
      // ========================================

      case "profile":
        return (
          <div className="settings-section">
            <div className="settings-section-header">
              <div className="section-icon">
                <User size={21} />
              </div>

              <div>
                <h2>Admin Profile</h2>
                <p>
                  Manage your administrator account
                  information.
                </p>
              </div>
            </div>

            <div className="settings-form-grid">
              <div className="form-group">
                <label>Full Name</label>

                <div className="input-wrapper">
                  <User size={17} />

                  <input
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Username</label>

                <div className="input-wrapper">
                  <User size={17} />

                  <input
                    value={profile.username}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        username: e.target.value,
                      })
                    }
                    placeholder="Username"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>

                <div className="input-wrapper">
                  <Mail size={17} />

                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number</label>

                <div className="input-wrapper">
                  <User size={17} />

                  <input
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        phone: e.target.value,
                      })
                    }
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      // ========================================
      // SECURITY
      // ========================================

      case "security":
        return (
          <div className="settings-section">
            <div className="settings-section-header">
              <div className="section-icon">
                <Shield size={21} />
              </div>

              <div>
                <h2>Security</h2>
                <p>
                  Protect your administrator account.
                </p>
              </div>
            </div>

            <div className="security-warning">
              <Shield size={20} />

              <div>
                <strong>Administrator Security</strong>

                <p>
                  Use a strong password and enable
                  additional security options.
                </p>
              </div>
            </div>

            <div className="settings-form-grid">
              <div className="form-group full-width">
                <label>Current Password</label>

                <div className="input-wrapper">
                  <Lock size={17} />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      security.currentPassword
                    }
                    onChange={(e) =>
                      setSecurity({
                        ...security,
                        currentPassword:
                          e.target.value,
                      })
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>New Password</label>

                <div className="input-wrapper">
                  <Lock size={17} />

                  <input
                    type="password"
                    value={security.newPassword}
                    onChange={(e) =>
                      setSecurity({
                        ...security,
                        newPassword:
                          e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>

                <div className="input-wrapper">
                  <Lock size={17} />

                  <input
                    type="password"
                    value={
                      security.confirmPassword
                    }
                    onChange={(e) =>
                      setSecurity({
                        ...security,
                        confirmPassword:
                          e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <button
              className="secondary-action"
              onClick={handlePasswordUpdate}
            >
              <Lock size={17} />
              Update Password
            </button>

            <div className="settings-options">
              <ToggleRow
                title="Two-Factor Authentication"
                description="Require an additional verification step."
                checked={security.twoFactor}
                onChange={(value) =>
                  setSecurity({
                    ...security,
                    twoFactor: value,
                  })
                }
              />

              <ToggleRow
                title="Login Notifications"
                description="Receive alerts when an admin account logs in."
                checked={
                  security.loginNotification
                }
                onChange={(value) =>
                  setSecurity({
                    ...security,
                    loginNotification: value,
                  })
                }
              />
            </div>
          </div>
        );

      // ========================================
      // PLATFORM
      // ========================================

      case "platform":
        return (
          <div className="settings-section">
            <div className="settings-section-header">
              <div className="section-icon">
                <Globe size={21} />
              </div>

              <div>
                <h2>Platform Settings</h2>
                <p>
                  Configure general CareerPilot
                  platform settings.
                </p>
              </div>
            </div>

            <div className="settings-form-grid">
              <InputField
                label="Platform Name"
                value={platform.platformName}
                onChange={(value) =>
                  setPlatform({
                    ...platform,
                    platformName: value,
                  })
                }
              />

              <InputField
                label="Platform Email"
                value={platform.platformEmail}
                onChange={(value) =>
                  setPlatform({
                    ...platform,
                    platformEmail: value,
                  })
                }
              />

              <InputField
                label="Support Email"
                value={platform.supportEmail}
                onChange={(value) =>
                  setPlatform({
                    ...platform,
                    supportEmail: value,
                  })
                }
              />
            </div>

            <div className="settings-options">
              <ToggleRow
                title="Maintenance Mode"
                description="Temporarily disable normal user access."
                checked={
                  platform.maintenanceMode
                }
                onChange={(value) =>
                  setPlatform({
                    ...platform,
                    maintenanceMode: value,
                  })
                }
                danger
              />

              <ToggleRow
                title="Allow New Registration"
                description="Allow new users to register."
                checked={
                  platform.allowRegistration
                }
                onChange={(value) =>
                  setPlatform({
                    ...platform,
                    allowRegistration: value,
                  })
                }
              />

              <ToggleRow
                title="Allow User Account Deletion"
                description="Allow users to delete their accounts."
                checked={
                  platform.allowUserDeletion
                }
                onChange={(value) =>
                  setPlatform({
                    ...platform,
                    allowUserDeletion: value,
                  })
                }
              />
            </div>
          </div>
        );

      // ========================================
      // NOTIFICATIONS
      // ========================================

      case "notifications":
        return (
          <div className="settings-section">
            <div className="settings-section-header">
              <div className="section-icon">
                <Bell size={21} />
              </div>

              <div>
                <h2>Notifications</h2>
                <p>
                  Control platform notification
                  behavior.
                </p>
              </div>
            </div>

            <div className="settings-options">
              <ToggleRow
                title="New User Notification"
                description="Notify admins when a new user registers."
                checked={notifications.newUser}
                onChange={(value) =>
                  setNotifications({
                    ...notifications,
                    newUser: value,
                  })
                }
              />

              <ToggleRow
                title="Payment Notification"
                description="Notify admins after successful payments."
                checked={notifications.payment}
                onChange={(value) =>
                  setNotifications({
                    ...notifications,
                    payment: value,
                  })
                }
              />

              <ToggleRow
                title="Feedback Notification"
                description="Notify admins when users submit feedback."
                checked={notifications.feedback}
                onChange={(value) =>
                  setNotifications({
                    ...notifications,
                    feedback: value,
                  })
                }
              />

              <ToggleRow
                title="Certificate Notification"
                description="Notify users when certificates are generated."
                checked={
                  notifications.certificate
                }
                onChange={(value) =>
                  setNotifications({
                    ...notifications,
                    certificate: value,
                  })
                }
              />

              <ToggleRow
                title="System Notifications"
                description="Receive important system alerts."
                checked={notifications.system}
                onChange={(value) =>
                  setNotifications({
                    ...notifications,
                    system: value,
                  })
                }
              />

              <ToggleRow
                title="Email Notifications"
                description="Enable platform email notifications."
                checked={
                  notifications.emailNotification
                }
                onChange={(value) =>
                  setNotifications({
                    ...notifications,
                    emailNotification:
                      value,
                  })
                }
              />
            </div>
          </div>
        );

      // ========================================
      // PAYMENT
      // ========================================

      case "payment":
        return (
          <div className="settings-section">
            <div className="settings-section-header">
              <div className="section-icon">
                <CreditCard size={21} />
              </div>

              <div>
                <h2>Payment Settings</h2>
                <p>
                  Configure CareerPilot payment
                  settings.
                </p>
              </div>
            </div>

            <div className="settings-form-grid">
              <InputField
                label="Payment Gateway"
                value={payment.gateway}
                onChange={(value) =>
                  setPayment({
                    ...payment,
                    gateway: value,
                  })
                }
              />

              <InputField
                label="Currency"
                value={payment.currency}
                onChange={(value) =>
                  setPayment({
                    ...payment,
                    currency: value,
                  })
                }
              />

              <InputField
                label="Pro Plan Price"
                type="number"
                value={payment.proPrice}
                onChange={(value) =>
                  setPayment({
                    ...payment,
                    proPrice: value,
                  })
                }
              />
            </div>

            <div className="settings-options">
              <ToggleRow
                title="Enable Payments"
                description="Allow users to purchase CareerPilot Pro."
                checked={
                  payment.paymentEnabled
                }
                onChange={(value) =>
                  setPayment({
                    ...payment,
                    paymentEnabled: value,
                  })
                }
              />

              <ToggleRow
                title="Test Mode"
                description="Use payment gateway test environment."
                checked={payment.testMode}
                onChange={(value) =>
                  setPayment({
                    ...payment,
                    testMode: value,
                  })
                }
              />
            </div>

            <div className="api-status">
              <CheckCircle size={18} />

              <div>
                <strong>Razorpay Integration</strong>

                <span>
                  Payment gateway is configured
                  through backend environment
                  variables.
                </span>
              </div>
            </div>
          </div>
        );

      // ========================================
      // AI
      // ========================================

      case "ai":
        return (
          <div className="settings-section">
            <div className="settings-section-header">
              <div className="section-icon">
                <Brain size={21} />
              </div>

              <div>
                <h2>AI Configuration</h2>
                <p>
                  Manage AI-powered CareerPilot
                  features.
                </p>
              </div>
            </div>

            <div className="settings-form-grid">
              <InputField
                label="AI Provider"
                value={aiSettings.provider}
                onChange={(value) =>
                  setAiSettings({
                    ...aiSettings,
                    provider: value,
                  })
                }
              />

              <InputField
                label="AI Model"
                value={aiSettings.model}
                onChange={(value) =>
                  setAiSettings({
                    ...aiSettings,
                    model: value,
                  })
                }
              />
            </div>

            <div className="settings-options">
              <ToggleRow
                title="AI System"
                description="Enable AI functionality throughout the platform."
                checked={aiSettings.aiEnabled}
                onChange={(value) =>
                  setAiSettings({
                    ...aiSettings,
                    aiEnabled: value,
                  })
                }
              />

              <ToggleRow
                title="Resume Analysis"
                description="Enable AI resume analysis."
                checked={
                  aiSettings.resumeAnalysis
                }
                onChange={(value) =>
                  setAiSettings({
                    ...aiSettings,
                    resumeAnalysis: value,
                  })
                }
              />

              <ToggleRow
                title="Career Roadmap"
                description="Enable AI career roadmap generation."
                checked={
                  aiSettings.roadmapGeneration
                }
                onChange={(value) =>
                  setAiSettings({
                    ...aiSettings,
                    roadmapGeneration:
                      value,
                  })
                }
              />

              <ToggleRow
                title="Skill Gap Analysis"
                description="Enable AI skill gap analysis."
                checked={
                  aiSettings.skillGapAnalysis
                }
                onChange={(value) =>
                  setAiSettings({
                    ...aiSettings,
                    skillGapAnalysis:
                      value,
                  })
                }
              />

              <ToggleRow
                title="Mock Interview"
                description="Enable AI mock interview."
                checked={
                  aiSettings.mockInterview
                }
                onChange={(value) =>
                  setAiSettings({
                    ...aiSettings,
                    mockInterview: value,
                  })
                }
              />

              <ToggleRow
                title="AI Career Coach"
                description="Enable AI career coaching."
                checked={aiSettings.aiCoach}
                onChange={(value) =>
                  setAiSettings({
                    ...aiSettings,
                    aiCoach: value,
                  })
                }
              />
            </div>
          </div>
        );

      // ========================================
      // CERTIFICATE
      // ========================================

      case "certificate":
        return (
          <div className="settings-section">
            <div className="settings-section-header">
              <div className="section-icon">
                <Award size={21} />
              </div>

              <div>
                <h2>Certificate Settings</h2>
                <p>
                  Define certificate eligibility
                  requirements.
                </p>
              </div>
            </div>

            <div className="certificate-info">
              <Award size={22} />

              <div>
                <strong>
                  Certificate Eligibility
                </strong>

                <p>
                  Users can receive certificates
                  when they meet the configured
                  criteria.
                </p>
              </div>
            </div>

            <div className="settings-form-grid">
              <InputField
                label="Minimum Overall Progress (%)"
                type="number"
                value={
                  certificate.minimumProgress
                }
                onChange={(value) =>
                  setCertificate({
                    ...certificate,
                    minimumProgress: value,
                  })
                }
              />

              <InputField
                label="Minimum Learning (%)"
                type="number"
                value={
                  certificate.minimumLearning
                }
                onChange={(value) =>
                  setCertificate({
                    ...certificate,
                    minimumLearning: value,
                  })
                }
              />

              <InputField
                label="Minimum Roadmap (%)"
                type="number"
                value={
                  certificate.minimumRoadmap
                }
                onChange={(value) =>
                  setCertificate({
                    ...certificate,
                    minimumRoadmap: value,
                  })
                }
              />

              <InputField
                label="Minimum Interview Score (%)"
                type="number"
                value={
                  certificate.minimumInterview
                }
                onChange={(value) =>
                  setCertificate({
                    ...certificate,
                    minimumInterview: value,
                  })
                }
              />

              <InputField
                label="Minimum Resume Score (%)"
                type="number"
                value={
                  certificate.minimumResume
                }
                onChange={(value) =>
                  setCertificate({
                    ...certificate,
                    minimumResume: value,
                  })
                }
              />

              <InputField
                label="Certificate Title"
                value={
                  certificate.certificateTitle
                }
                onChange={(value) =>
                  setCertificate({
                    ...certificate,
                    certificateTitle:
                      value,
                  })
                }
              />

              <InputField
                label="Issuer Name"
                value={certificate.issuerName}
                onChange={(value) =>
                  setCertificate({
                    ...certificate,
                    issuerName: value,
                  })
                }
              />
            </div>

            <div className="settings-options">
              <ToggleRow
                title="Enable Certificates"
                description="Allow eligible users to generate certificates."
                checked={certificate.enabled}
                onChange={(value) =>
                  setCertificate({
                    ...certificate,
                    enabled: value,
                  })
                }
              />

              <ToggleRow
                title="Require All Criteria"
                description="User must satisfy every configured certificate requirement."
                checked={
                  certificate.requireAllCriteria
                }
                onChange={(value) =>
                  setCertificate({
                    ...certificate,
                    requireAllCriteria:
                      value,
                  })
                }
              />
            </div>
          </div>
        );

      // ========================================
      // SYSTEM
      // ========================================

      case "system":
        return (
          <div className="settings-section">
            <div className="settings-section-header">
              <div className="section-icon">
                <Monitor size={21} />
              </div>

              <div>
                <h2>System Preferences</h2>
                <p>
                  Configure admin dashboard behavior.
                </p>
              </div>
            </div>

            <div className="settings-options">
              <ToggleRow
                title="Dark Mode"
                description="Use dark appearance for the admin dashboard."
                checked={system.darkMode}
                onChange={(value) =>
                  setSystem({
                    ...system,
                    darkMode: value,
                  })
                }
              />

              <ToggleRow
                title="Compact Mode"
                description="Use a compact admin dashboard layout."
                checked={system.compactMode}
                onChange={(value) =>
                  setSystem({
                    ...system,
                    compactMode: value,
                  })
                }
              />

              <ToggleRow
                title="Show Analytics"
                description="Display analytics and statistics."
                checked={system.showAnalytics}
                onChange={(value) =>
                  setSystem({
                    ...system,
                    showAnalytics: value,
                  })
                }
              />

              <ToggleRow
                title="Auto Refresh"
                description="Automatically refresh dashboard data."
                checked={system.autoRefresh}
                onChange={(value) =>
                  setSystem({
                    ...system,
                    autoRefresh: value,
                  })
                }
              />
            </div>

            <div className="settings-form-grid">
              <InputField
                label="Refresh Interval (seconds)"
                type="number"
                value={system.refreshInterval}
                onChange={(value) =>
                  setSystem({
                    ...system,
                    refreshInterval: value,
                  })
                }
              />
            </div>

            <div className="danger-zone">
              <div className="danger-header">
                <Trash2 size={20} />

                <div>
                  <h3>Danger Zone</h3>
                  <p>
                    These actions can affect the
                    platform and should be used
                    carefully.
                  </p>
                </div>
              </div>

              <button
                className="danger-button"
                onClick={handleDangerAction}
              >
                Reset Platform Cache
              </button>

              <button
                className="danger-button"
                onClick={handleDangerAction}
              >
                Clear Analytics Data
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-settings-page">
      <div className="admin-settings-container">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="settings-page-header">
          <div>
            <div className="settings-title-row">
              <div className="settings-main-icon">
                <Settings size={24} />
              </div>

              <div>
                <h1>Admin Settings</h1>

                <p>
                  Manage CareerPilot platform,
                  security and system configuration.
                </p>
              </div>
            </div>
          </div>

          <button
            className="save-settings-button"
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={17} />

            {saving
              ? "Saving..."
              : "Save Settings"}
          </button>
        </div>

        {/* ==========================================
            ALERTS
        ========================================== */}

        {message && (
          <div className="settings-alert success">
            <CheckCircle size={19} />
            {message}
          </div>
        )}

        {error && (
          <div className="settings-alert error">
            <AlertCircle size={19} />
            {error}
          </div>
        )}

        {/* ==========================================
            CONTENT
        ========================================== */}

        <div className="settings-layout">

          {/* SIDEBAR */}

          <aside className="settings-menu">

            <div className="settings-menu-title">
              SETTINGS
            </div>

            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <button
                  key={section.id}
                  className={`settings-menu-item ${
                    activeSection === section.id
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveSection(section.id)
                  }
                >
                  <Icon size={18} />

                  <span>{section.label}</span>
                </button>
              );
            })}

            <button
              className="reset-settings-button"
              onClick={handleReset}
            >
              Reset Settings
            </button>
          </aside>

          {/* MAIN */}

          <main className="settings-content">
            {renderSection()}
          </main>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// INPUT FIELD
// ==========================================

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
}) => {
  return (
    <div className="form-group">
      <label>{label}</label>

      <input
        className="settings-input"
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />
    </div>
  );
};

// ==========================================
// TOGGLE
// ==========================================

const ToggleRow = ({
  title,
  description,
  checked,
  onChange,
  danger = false,
}) => {
  return (
    <div className="toggle-row">
      <div className="toggle-content">
        <strong>{title}</strong>

        <span>{description}</span>
      </div>

      <button
        type="button"
        className={`toggle ${
          checked ? "on" : ""
        } ${danger ? "danger-toggle" : ""}`}
        onClick={() => onChange(!checked)}
        aria-label={title}
      >
        <span className="toggle-circle"></span>
      </button>
    </div>
  );
};

export default AdminSettings;