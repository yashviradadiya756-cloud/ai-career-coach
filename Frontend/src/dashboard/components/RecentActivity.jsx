import React from 'react';
import { ClipboardList, CheckSquare } from 'lucide-react';
import '../styles/cards.css';

const RecentActivity = () => {
  const activities = [
    'Resume uploaded successfully',
    'Assessment completed',
    'Roadmap updated'
  ];

  return (
    <div className="recent-activity-card">
      <div className="activity-header">
        <ClipboardList size={18} />
        <span>Recent Activity</span>
      </div>
      <ul className="activity-list">
        {activities.map((item, index) => (
          <li key={index} className="activity-item">
            <CheckSquare className="icon-check" size={16} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;