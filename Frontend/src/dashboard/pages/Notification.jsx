import React from "react";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Trash2,
} from "lucide-react";
// import "../styles/notification.css";

const notifications = [
  {
    id: 1,
    title: "Resume Analysis Completed",
    message: "Your resume has been analyzed successfully.",
    time: "5 mins ago",
    type: "success",
  },
  {
    id: 2,
    title: "New Learning Course",
    message: "A React Advanced course has been recommended for you.",
    time: "30 mins ago",
    type: "info",
  },
  {
    id: 3,
    title: "Mock Interview Reminder",
    message: "Your AI mock interview is scheduled for today.",
    time: "1 hour ago",
    type: "warning",
  },
  {
    id: 4,
    title: "Payment Successful",
    message: "Your Pro Membership has been activated.",
    time: "Yesterday",
    type: "success",
  },
];

const getIcon = (type) => {
  switch (type) {
    case "success":
      return <CheckCircle color="green" />;
    case "warning":
      return <AlertTriangle color="orange" />;
    default:
      return <Info color="#2563eb" />;
  }
};

const Notification = () => {
  return (
    <div style={{ padding: "25px" }}>
      <h2 style={{ marginBottom: "20px" }}>
        <Bell size={26} /> Notifications
      </h2>

      {notifications.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "60px" }}>
          <Bell size={60} color="#cbd5e1" />
          <h3>No Notifications</h3>
          <p>You don't have any notifications yet.</p>
        </div>
      ) : (
        notifications.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "18px",
              marginBottom: "15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,.08)",
            }}
          >
            <div style={{ display: "flex", gap: "15px" }}>
              {getIcon(item.type)}
              <div>
                <h4 style={{ margin: 0 }}>{item.title}</h4>
                <p style={{ margin: "5px 0", color: "#64748b" }}>
                  {item.message}
                </p>
                <small>{item.time}</small>
              </div>
            </div>

            <Trash2
              size={20}
              color="red"
              style={{ cursor: "pointer" }}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Notification;