import React from "react";

const AdminStatCard = ({
  title,
  value,
  change,
  changeType = "positive",
  icon,
  description,
}) => {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-top">
        <div className="admin-stat-icon">
          {icon}
        </div>

        <span
          className={`admin-stat-change ${changeType}`}
        >
          {changeType === "positive" ? "↑" : "↓"} {change}
        </span>
      </div>

      <div className="admin-stat-content">
        <p>{title}</p>

        <h3>{value}</h3>

        {description && (
          <span>{description}</span>
        )}
      </div>
    </div>
  );
};

export default AdminStatCard;