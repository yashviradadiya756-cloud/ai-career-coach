import React from "react";
import "./Dashboard.css";
import {
  Users,
  FileText,
  CreditCard,
  Crown,
  UserPlus,
  FileCheck,
  Bell,
} from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "1,254",
    icon: <Users size={28} />,
    color: "#2563eb",
  },
  {
    title: "Resume Reports",
    value: "846",
    icon: <FileText size={28} />,
    color: "#10b981",
  },
  {
    title: "Premium Users",
    value: "324",
    icon: <Crown size={28} />,
    color: "#f59e0b",
  },
  {
    title: "Revenue",
    value: "₹2,35,800",
    icon: <CreditCard size={28} />,
    color: "#ef4444",
  },
];

const recentUsers = [
  {
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    plan: "Premium",
  },
  {
    name: "Priya Patel",
    email: "priya@gmail.com",
    plan: "Free",
  },
  {
    name: "Amit Shah",
    email: "amit@gmail.com",
    plan: "Premium",
  },
  {
    name: "Neha Verma",
    email: "neha@gmail.com",
    plan: "Free",
  },
];

const activities = [
  {
    icon: <UserPlus />,
    text: "New user registered",
    time: "5 min ago",
  },
  {
    icon: <FileCheck />,
    text: "Resume analyzed",
    time: "12 min ago",
  },
  {
    icon: <Bell />,
    text: "Notification sent",
    time: "30 min ago",
  },
];

export default function Dashboard() {
  return (
    <div className="dashboard">

      <h2 className="page-title">
        Dashboard Overview
      </h2>

      <div className="stats-grid">
        {stats.map((item, index) => (
          <div className="stat-card" key={index}>
            <div
              className="stat-icon"
              style={{ background: item.color }}
            >
              {item.icon}
            </div>

            <div>
              <h3>{item.value}</h3>
              <p>{item.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">

        <div className="table-card">
          <h3>Recent Users</h3>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Plan</th>
              </tr>
            </thead>

            <tbody>
              {recentUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={
                        user.plan === "Premium"
                          ? "premium"
                          : "free"
                      }
                    >
                      {user.plan}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="activity-card">
          <h3>Recent Activity</h3>

          {activities.map((item, index) => (
            <div className="activity" key={index}>
              <div className="activity-icon">
                {item.icon}
              </div>

              <div>
                <p>{item.text}</p>
                <small>{item.time}</small>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}