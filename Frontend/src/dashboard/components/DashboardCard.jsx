import React from 'react';
import '../styles/cards.css';

const DashboardCard = ({ title, value, colorClass }) => {
  return (
    <div className="dashboard-card">
      <div className="card-title">{title}</div>
      <div className={`card-value ${colorClass}`}>{value}</div>
    </div>
  );
};

export default DashboardCard;