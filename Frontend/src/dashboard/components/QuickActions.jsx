import React from 'react';
import { Zap } from 'lucide-react';
import '../styles/cards.css';

const QuickActions = () => {
  return (
    <div className="quick-actions-card">
      <div className="actions-header">
        <Zap size={18} color="#eab308" />
        <span>Quick Actions</span>
      </div>
      <div className="actions-btn-group">
        <button className="action-btn-primary">Take Assessment</button>
        <button className="action-btn-primary">Upload Resume</button>
        <button className="action-btn-primary">Skill Gap Analysis</button>
        <button className="action-btn-primary">Create a Roadmap</button>
      </div>
    </div>
  );
};

export default QuickActions;