import React from 'react';
import WelcomeCard from '../components/WelcomeCard';
import DashboardCard from '../components/DashboardCard';
import ProgressBar from '../components/ProgressBar';
import RecentActivity from '../components/RecentActivity';
import QuickActions from '../components/QuickActions';

const Overview = () => {
  return (
    <div>
      <WelcomeCard userName="Yashvi" />
      
      <div className="dashboard-grid">
        <DashboardCard title="Career Score" value="840" colorClass="blue" />
        <DashboardCard title="Resume ATS" value="78%" colorClass="green" />
        <DashboardCard title="Skills Matched" value="14 / 18" colorClass="amber" />
        <DashboardCard title="Interview Average" value="92%" colorClass="red" />
      </div>

      <ProgressBar percentage={75} />

      <div className="bottom-section">
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  );
};

export default Overview;