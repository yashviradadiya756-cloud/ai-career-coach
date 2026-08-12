import React from "react";

import {
  UserPlus,
  FileText,
  Bot,
  Map,
  CreditCard,
} from "lucide-react";

const AdminActivity = () => {
  const activities = [
    {
      icon: UserPlus,
      title: "New user registered",
      description: "Yashvi Radariya joined CareerPilot",
      time: "10 minutes ago",
      type: "user",
    },
    {
      icon: FileText,
      title: "Resume analyzed",
      description: "A resume was analyzed successfully",
      time: "24 minutes ago",
      type: "resume",
    },
    {
      icon: Bot,
      title: "AI Coach session",
      description: "User started a new AI Coach session",
      time: "42 minutes ago",
      type: "coach",
    },
    {
      icon: Map,
      title: "Roadmap generated",
      description: "Full Stack Developer roadmap created",
      time: "1 hour ago",
      type: "roadmap",
    },
    {
      icon: CreditCard,
      title: "New Pro subscription",
      description: "A user upgraded to Pro",
      time: "2 hours ago",
      type: "payment",
    },
  ];

  return (
    <div className="admin-panel-card">
      <div className="admin-panel-header">
        <div>
          <span className="admin-panel-eyebrow">
            PLATFORM
          </span>

          <h3>Recent activity</h3>

          <p>Latest actions across CareerPilot</p>
        </div>
      </div>

      <div className="admin-activity-list">
        {activities.map((activity, index) => {
          const Icon = activity.icon;

          return (
            <div
              className="admin-activity-item"
              key={index}
            >
              <div
                className={`admin-activity-icon ${activity.type}`}
              >
                <Icon size={17} />
              </div>

              <div className="admin-activity-content">
                <strong>{activity.title}</strong>

                <p>{activity.description}</p>

                <span>{activity.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminActivity;