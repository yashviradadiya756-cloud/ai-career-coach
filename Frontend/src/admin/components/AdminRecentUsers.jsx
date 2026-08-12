import React from "react";
import { ArrowUpRight } from "lucide-react";

const AdminRecentUsers = () => {
  const users = [
    {
      name: "Yashvi Radariya",
      email: "yashvi@example.com",
      initials: "YR",
      date: "Today, 10:42 AM",
      status: "Active",
    },
    {
      name: "Rahul Patel",
      email: "rahul@example.com",
      initials: "RP",
      date: "Today, 09:28 AM",
      status: "Active",
    },
    {
      name: "Priya Shah",
      email: "priya@example.com",
      initials: "PS",
      date: "Yesterday",
      status: "Active",
    },
    {
      name: "Aarav Mehta",
      email: "aarav@example.com",
      initials: "AM",
      date: "Yesterday",
      status: "Pending",
    },
    {
      name: "Neha Patel",
      email: "neha@example.com",
      initials: "NP",
      date: "Aug 10, 2026",
      status: "Active",
    },
  ];

  return (
    <div className="admin-panel-card">
      <div className="admin-panel-header">
        <div>
          <span className="admin-panel-eyebrow">
            USERS
          </span>

          <h3>Recent users</h3>

          <p>Latest CareerPilot registrations</p>
        </div>

        <button className="admin-view-all">
          View all
          <ArrowUpRight size={15} />
        </button>
      </div>

      <div className="admin-users-list">
        {users.map((user, index) => (
          <div
            className="admin-user-row"
            key={index}
          >
            <div className="admin-user-avatar">
              {user.initials}
            </div>

            <div className="admin-user-info">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>

            <div className="admin-user-date">
              {user.date}
            </div>

            <span
              className={`admin-status ${
                user.status.toLowerCase()
              }`}
            >
              <i></i>
              {user.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRecentUsers;