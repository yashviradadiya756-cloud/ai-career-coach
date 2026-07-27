import React, { useState } from "react";
import {
  Bell,
  Send,
  Search,
  Trash2,
  Users,
  User,
  Calendar,
} from "lucide-react";
import "./Notifications.css";

const initialNotifications = [
  {
    id: 1,
    title: "Platform Update",
    message: "New AI Resume Analyzer features are now available.",
    audience: "All Users",
    date: "22 Jul 2026",
    status: "Sent",
  },
  {
    id: 2,
    title: "Mock Interview Reminder",
    message: "Complete your scheduled mock interview.",
    audience: "Selected Users",
    date: "21 Jul 2026",
    status: "Scheduled",
  },
  {
    id: 3,
    title: "Subscription Offer",
    message: "Upgrade to Pro and get 30% off this week.",
    audience: "Premium Users",
    date: "20 Jul 2026",
    status: "Sent",
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("All Users");

  const filtered = notifications.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.audience.toLowerCase().includes(search.toLowerCase())
  );

  const sendNotification = () => {
    if (!title || !message) {
      alert("Please enter title and message.");
      return;
    }

    const newNotification = {
      id: notifications.length + 1,
      title,
      message,
      audience,
      date: new Date().toLocaleDateString(),
      status: "Sent",
    };

    setNotifications([newNotification, ...notifications]);

    setTitle("");
    setMessage("");
    setAudience("All Users");
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((item) => item.id !== id));
  };

  return (
    <div className="notifications-page">

      <h2>Notifications & Announcements</h2>

      <div className="notification-form">

        <div className="input-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Notification Title"
          />
        </div>

        <div className="input-group">
          <label>Message</label>
          <textarea
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Notification Message"
          />
        </div>

        <div className="input-group">
          <label>Audience</label>

          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          >
            <option>All Users</option>
            <option>Premium Users</option>
            <option>Selected Users</option>
          </select>
        </div>

        <button className="send-btn" onClick={sendNotification}>
          <Send size={18} />
          Send Notification
        </button>

      </div>

      <div className="toolbar">

        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

      </div>

      <div className="notification-list">

        {filtered.map((item) => (

          <div className="notification-card" key={item.id}>

            <div className="notification-left">

              <Bell className="bell-icon" />

              <div>

                <h3>{item.title}</h3>

                <p>{item.message}</p>

                <div className="meta">

                  <span>
                    <Users size={15} />
                    {item.audience}
                  </span>

                  <span>
                    <Calendar size={15} />
                    {item.date}
                  </span>

                </div>

              </div>

            </div>

            <div className="notification-right">

              <span
                className={
                  item.status === "Sent"
                    ? "status sent"
                    : "status scheduled"
                }
              >
                {item.status}
              </span>

              <button
                className="delete-btn"
                onClick={() => deleteNotification(item.id)}
              >
                <Trash2 size={18} />
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}