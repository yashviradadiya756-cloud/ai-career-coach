import React from "react";
import {
  X,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  FileText,
  Map,
  Bot,
  Mic,
  CreditCard,
  UserCheck,
} from "lucide-react";

const AdminUserModal = ({
  user,
  onClose,
  onToggleStatus,
}) => {
  if (!user) return null;

  return (
    <div
      className="admin-modal-overlay"
      onClick={onClose}
    >
      <div
        className="admin-user-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="admin-modal-header">
          <div>
            <span className="admin-modal-eyebrow">
              USER DETAILS
            </span>

            <h2>User Profile</h2>
          </div>

          <button
            className="admin-modal-close"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile */}
        <div className="admin-modal-profile">
          <div className="admin-modal-avatar">
            {user.initials}
          </div>

          <div className="admin-modal-profile-info">
            <h3>{user.name}</h3>

            <span>
              {user.role || "CareerPilot User"}
            </span>

            <div
              className={`admin-modal-status ${
                user.status.toLowerCase()
              }`}
            >
              <i></i>
              {user.status}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="admin-modal-section">
          <h4>Contact information</h4>

          <div className="admin-user-contact-grid">
            <div className="admin-contact-item">
              <Mail size={16} />

              <div>
                <span>Email</span>
                <strong>{user.email}</strong>
              </div>
            </div>

            <div className="admin-contact-item">
              <Phone size={16} />

              <div>
                <span>Phone</span>
                <strong>
                  {user.phone || "Not provided"}
                </strong>
              </div>
            </div>

            <div className="admin-contact-item">
              <Calendar size={16} />

              <div>
                <span>Joined</span>
                <strong>{user.joined}</strong>
              </div>
            </div>

            <div className="admin-contact-item">
              <ShieldCheck size={16} />

              <div>
                <span>Account</span>
                <strong>
                  {user.plan} Plan
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Usage */}
        <div className="admin-modal-section">
          <h4>CareerPilot usage</h4>

          <div className="admin-user-usage-grid">

            <div className="admin-user-usage-card">
              <Bot size={17} />
              <span>AI Coach</span>
              <strong>{user.coachSessions}</strong>
            </div>

            <div className="admin-user-usage-card">
              <FileText size={17} />
              <span>Resumes</span>
              <strong>{user.resumes}</strong>
            </div>

            <div className="admin-user-usage-card">
              <Map size={17} />
              <span>Roadmaps</span>
              <strong>{user.roadmaps}</strong>
            </div>

            <div className="admin-user-usage-card">
              <Mic size={17} />
              <span>Interviews</span>
              <strong>{user.interviews}</strong>
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="admin-modal-section">
          <h4>Subscription</h4>

          <div className="admin-subscription-box">
            <div className="admin-subscription-icon">
              <CreditCard size={18} />
            </div>

            <div>
              <strong>
                {user.plan} Plan
              </strong>

              <span>
                {user.plan === "Pro"
                  ? "Premium CareerPilot access"
                  : "Basic CareerPilot access"}
              </span>
            </div>

            <span
              className={`admin-plan-badge ${user.plan.toLowerCase()}`}
            >
              {user.plan}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="admin-modal-footer">

          <button
            className={`admin-modal-status-button ${
              user.status === "Blocked"
                ? "unblock"
                : "block"
            }`}
            onClick={() =>
              onToggleStatus(user.id)
            }
          >
            <UserCheck size={16} />

            {user.status === "Blocked"
              ? "Unblock User"
              : "Block User"}
          </button>

          <button
            className="admin-modal-done-button"
            onClick={onClose}
          >
            Done
          </button>

        </div>
      </div>
    </div>
  );
};

export default AdminUserModal;