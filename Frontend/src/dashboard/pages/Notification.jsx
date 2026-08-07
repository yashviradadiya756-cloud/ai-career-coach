import React, { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Trash2,
  RefreshCw,
  Check,
} from "lucide-react";

import {
  getNotifications,
  markAsRead,
  deleteNotification,
} from "../../api/notificationApi";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD NOTIFICATIONS
  // ==========================================

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getNotifications();

      console.log(
        "Notifications API Response:",
        response.data
      );

      if (response.data.success) {
        setNotifications(
          response.data.notifications || []
        );
      } else {
        setNotifications([]);
        setError(
          response.data.message ||
            "Failed to load notifications"
        );
      }
    } catch (err) {
      console.error(
        "Notification API Error:",
        err.response?.data || err.message
      );

      setNotifications([]);

      setError(
        err.response?.data?.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadNotifications();
  }, []);

  // ==========================================
  // RETRY
  // ==========================================

  const handleRetry = async () => {
    setRetrying(true);
    await loadNotifications();
  };

  // ==========================================
  // MARK AS READ
  // ==========================================

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (err) {
      console.error(
        "Mark as read error:",
        err.response?.data || err.message
      );
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);

      setNotifications((previous) =>
        previous.filter(
          (notification) =>
            notification._id !== id
        )
      );
    } catch (err) {
      console.error(
        "Delete notification error:",
        err.response?.data || err.message
      );
    }
  };

  // ==========================================
  // ICON
  // ==========================================

  const getIcon = (type) => {
    if (type === "success") {
      return (
        <div
          style={{
            ...styles.iconBox,
            background: "#dcfce7",
          }}
        >
          <CheckCircle
            size={22}
            color="#16a34a"
          />
        </div>
      );
    }

    if (type === "warning") {
      return (
        <div
          style={{
            ...styles.iconBox,
            background: "#fef3c7",
          }}
        >
          <AlertTriangle
            size={22}
            color="#d97706"
          />
        </div>
      );
    }

    return (
      <div
        style={{
          ...styles.iconBox,
          background: "#dbeafe",
        }}
      >
        <Info
          size={22}
          color="#2563eb"
        />
      </div>
    );
  };

  // ==========================================
  // TIME
  // ==========================================

  const getTime = (date) => {
    if (!date) return "";

    const notificationDate =
      new Date(date);

    const now = new Date();

    const seconds = Math.floor(
      (now - notificationDate) / 1000
    );

    if (seconds < 60) {
      return "Just now";
    }

    const minutes = Math.floor(
      seconds / 60
    );

    if (minutes < 60) {
      return `${minutes} ${
        minutes === 1
          ? "minute"
          : "minutes"
      } ago`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours} ${
        hours === 1 ? "hour" : "hours"
      } ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    if (days < 7) {
      return `${days} ${
        days === 1 ? "day" : "days"
      } ago`;
    }

    return notificationDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // COUNTS
  // ==========================================

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              🔔 Notifications
            </h1>

            <p style={styles.subtitle}>
              Stay updated with your
              CareerPilot activities.
            </p>
          </div>
        </div>

        <div style={styles.loadingCard}>
          <RefreshCw
            size={32}
            style={styles.spinner}
          />

          <h3>
            Loading notifications...
          </h3>

          <p>
            Please wait while we fetch
            your latest updates.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              🔔 Notifications
            </h1>

            <p style={styles.subtitle}>
              Stay updated with your
              CareerPilot activities.
            </p>
          </div>
        </div>

        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>
            <Bell
              size={32}
              color="#dc2626"
            />
          </div>

          <h2>
            Unable to load notifications
          </h2>

          <p style={styles.errorText}>
            {error}
          </p>

          <button
            onClick={handleRetry}
            disabled={retrying}
            style={{
              ...styles.retryButton,
              opacity: retrying ? 0.7 : 1,
            }}
          >
            <RefreshCw
              size={18}
              style={{
                animation: retrying
                  ? "spin 1s linear infinite"
                  : "none",
              }}
            />

            {retrying
              ? "Loading..."
              : "Try Again"}
          </button>
        </div>

        <style>
          {`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div style={styles.page}>
      {/* HEADER */}

      <div style={styles.header}>
        <div>
          <div style={styles.titleRow}>
            <h1 style={styles.title}>
              🔔 Notifications
            </h1>

            {unreadCount > 0 && (
              <span style={styles.badge}>
                {unreadCount} unread
              </span>
            )}
          </div>

          <p style={styles.subtitle}>
            Stay updated with your
            CareerPilot activities.
          </p>
        </div>

        <button
          onClick={handleRetry}
          disabled={retrying}
          style={styles.refreshButton}
        >
          <RefreshCw
            size={17}
            style={{
              animation: retrying
                ? "spin 1s linear infinite"
                : "none",
            }}
          />

          Refresh
        </button>
      </div>

      {/* SUMMARY */}

      <div style={styles.summary}>
        <div style={styles.summaryCard}>
          <div
            style={{
              ...styles.summaryIcon,
              background: "#dbeafe",
            }}
          >
            <Bell
              size={22}
              color="#2563eb"
            />
          </div>

          <div>
            <span style={styles.summaryLabel}>
              Total Notifications
            </span>

            <strong style={styles.summaryValue}>
              {notifications.length}
            </strong>
          </div>
        </div>

        <div style={styles.summaryCard}>
          <div
            style={{
              ...styles.summaryIcon,
              background: "#fef3c7",
            }}
          >
            <Info
              size={22}
              color="#d97706"
            />
          </div>

          <div>
            <span style={styles.summaryLabel}>
              Unread
            </span>

            <strong style={styles.summaryValue}>
              {unreadCount}
            </strong>
          </div>
        </div>

        <div style={styles.summaryCard}>
          <div
            style={{
              ...styles.summaryIcon,
              background: "#dcfce7",
            }}
          >
            <Check
              size={22}
              color="#16a34a"
            />
          </div>

          <div>
            <span style={styles.summaryLabel}>
              Read
            </span>

            <strong style={styles.summaryValue}>
              {notifications.length -
                unreadCount}
            </strong>
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS */}

      <div style={styles.notificationSection}>
        <div style={styles.sectionHeader}>
          <h2>
            Recent Notifications
          </h2>

          <span>
            {notifications.length} total
          </span>
        </div>

        {notifications.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <Bell
                size={40}
                color="#94a3b8"
              />
            </div>

            <h3>
              No notifications yet
            </h3>

            <p>
              When something important
              happens in your CareerPilot
              account, you'll see it here.
            </p>
          </div>
        ) : (
          <div>
            {notifications.map(
              (notification) => (
                <div
                  key={notification._id}
                  style={{
                    ...styles.notificationCard,
                    background:
                      notification.isRead
                        ? "#ffffff"
                        : "#f8fbff",
                    borderLeft:
                      notification.isRead
                        ? "4px solid transparent"
                        : "4px solid #2563eb",
                  }}
                >
                  {/* ICON */}

                  {getIcon(
                    notification.type
                  )}

                  {/* CONTENT */}

                  <div
                    style={
                      styles.notificationContent
                    }
                  >
                    <div
                      style={
                        styles.notificationTop
                      }
                    >
                      <h3>
                        {notification.title}
                      </h3>

                      {!notification.isRead && (
                        <span
                          style={styles.unreadDot}
                        />
                      )}
                    </div>

                    <p>
                      {notification.message}
                    </p>

                    <span
                      style={
                        styles.notificationTime
                      }
                    >
                      {getTime(
                        notification.createdAt
                      )}
                    </span>

                    {/* ACTIONS */}

                    <div
                      style={
                        styles.actions
                      }
                    >
                      {!notification.isRead && (
                        <button
                          onClick={() =>
                            handleMarkAsRead(
                              notification._id
                            )
                          }
                          style={
                            styles.readButton
                          }
                        >
                          <Check size={15} />
                          Mark as read
                        </button>
                      )}

                      <button
                        onClick={() =>
                          handleDelete(
                            notification._id
                          )
                        }
                        style={
                          styles.deleteButton
                        }
                      >
                        <Trash2
                          size={15}
                        />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

// ==========================================
// STYLES
// ==========================================

const styles = {
  page: {
    padding: "25px",
    background: "#f5f7fb",
    minHeight: "100vh",
  },

  header: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "14px",
    marginBottom: "20px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    color: "#0f172a",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#64748b",
  },

  badge: {
    background: "#dbeafe",
    color: "#2563eb",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },

  refreshButton: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    border: "1px solid #dbeafe",
    background: "#eff6ff",
    color: "#2563eb",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  summary: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "20px",
  },

  summaryCard: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,.06)",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  summaryIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  summaryLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "14px",
    marginBottom: "4px",
  },

  summaryValue: {
    display: "block",
    color: "#0f172a",
    fontSize: "23px",
  },

  notificationSection: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "22px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,.06)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },

  notificationCard: {
    display: "flex",
    gap: "15px",
    padding: "18px",
    marginBottom: "12px",
    borderRadius: "12px",
    borderTop: "1px solid #e5e7eb",
    borderRight: "1px solid #e5e7eb",
    borderBottom: "1px solid #e5e7eb",
    transition: "0.2s",
  },

  iconBox: {
    minWidth: "46px",
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  notificationContent: {
    flex: 1,
  },

  notificationTop: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  notificationTopH3: {
    margin: 0,
  },

  unreadDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#2563eb",
  },

  notificationContent: {
    flex: 1,
  },

  notificationTime: {
    color: "#94a3b8",
    fontSize: "13px",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
  },

  readButton: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    border: "none",
    background: "#eff6ff",
    color: "#2563eb",
    padding: "7px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },

  deleteButton: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    border: "none",
    background: "#fef2f2",
    color: "#dc2626",
    padding: "7px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },

  loadingCard: {
    background: "#ffffff",
    padding: "60px 20px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow:
      "0 2px 10px rgba(0,0,0,.06)",
  },

  errorCard: {
    background: "#ffffff",
    padding: "60px 20px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow:
      "0 2px 10px rgba(0,0,0,.06)",
  },

  errorIcon: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "#fef2f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
  },

  errorText: {
    color: "#64748b",
    marginBottom: "20px",
  },

  retryButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "11px 20px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  emptyState: {
    padding: "60px 20px",
    textAlign: "center",
  },

  emptyIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
  },
};

export default Notification;

