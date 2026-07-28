import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import Login from "./pages/Login";
import Register from "./pages/Register"

import ProtectedRoute from "./components/ProtectedRoute";

import AdminLogin from "./admin/pages/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import LandingPage from "./pages/LandingPage";
import Pricing from "./components/Pricing";
import ContactUs from "./pages/ContactUs";
import Demo from "./components/Demo";

import DashboardLayout from "./dashboard/layouts/DashboardLayout";
import Overview from "./dashboard/pages/Overview";
import Assessment from "./dashboard/pages/Assessment";
import Resume from "./dashboard/pages/Resume";
import SkillGap from "./dashboard/pages/SkillGap";
import Roadmap from "./dashboard/pages/Roadmap";
import Interview from "./dashboard/pages/Interview";
import AICoach from "./dashboard/pages/AICoach";
import Learning from "./dashboard/pages/Learning";
import Progress from "./dashboard/pages/Progress";
import Achievements from "./dashboard/pages/Achievements";
import Payment from "./dashboard/pages/Payment";
import Notification from "./dashboard/pages/Notification";
import Settings from "./dashboard/pages/Settings";

// Layout and Dashboard
import AdminLayout from './admin/layouts/AdminLayout';
import AdminDashboard from "./admin/pages/Dashboard/Dashboard";
import AdminUsers from "./admin/pages/Dashboard/Users/Users";
import AdminResumeReports from "./admin/pages/Dashboard/ResumeReports/ResumeReports";
import AdminCareerAssessment from "./admin/pages/Dashboard/CareerAssessment/CareerAssessment";
import AdminResumeAnalyzer from "./admin/pages/Dashboard/ResumeAnalyzer/ResumeAnalyzer";
import AdminSkillGap from "./admin/pages/Dashboard/SkillGap/SkillGap";
import AdminCareerRoadmaps from "./admin/pages/Dashboard/CareerRoadmaps/CareerRoadmaps";
import AdminMockInterviews from "./admin/pages/Dashboard/MockInterviews/MockInterviews";
import AdminLearning from "./admin/pages/Dashboard/Learning/Learning";
import AdminPayments from "./admin/pages/Dashboard/Payments/Payments";
import AdminAnalytics from "./admin/pages/Dashboard/Analytics/Analytics";
import AdminNotifications from "./admin/pages/Dashboard/Notification/Notifications";
import AdminSettings from "./admin/pages/Dashboard/Settings/Settings";

// Step 6 Quick Stand-in Component factory
const createPlaceholder = (name) => () => (
  <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
    <h2>{name} Page</h2>
    <p style={{ color: '#64748b', marginTop: '8px' }}>Production layout interface framework loading dynamically...</p>
  </div>
);

    const UsersPage = createPlaceholder('Users');
    const ResumeReportsPage = createPlaceholder('Resume Reports');
    const CareerAssessmentPage = createPlaceholder('Career Assessment');
    const ResumeAnalyzerPage = createPlaceholder('Resume Analyzer');
    const SkillGapPage = createPlaceholder('Skill Gap');
    const CareerRoadmapsPage = createPlaceholder('Career Roadmaps');
    const MockInterviewsPage = createPlaceholder('Mock Interviews');
    const LearningPage = createPlaceholder('Learning');
    const PaymentsPage = createPlaceholder('Payments');
    const NotificationsPage = createPlaceholder('Notification');
    const SettingsPage = createPlaceholder('Settings');
    const ProfilePage = createPlaceholder('Profile');
    const AnalyticsPage = createPlaceholder("Analytics");


function App() {
  return (
    <Routes>

      {/* Login page */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}


      {/* Landing Page */}
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/demo" element={<Demo />} />

      {/* Dashboard Layout */}
      {/* <Route path="/dashboard" element={<DashboardLayout />}>
      <Route index element={<Overview />} />
    </Route> */}

    <Route 
  path="/dashboard/*" 
  element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
    <Route path="overview" element={<Overview />} />
    <Route path="assessment" element={<Assessment />} />
    <Route path="resume" element={<Resume />} />
    <Route path="skill-gap" element={<SkillGap />} />
    <Route path="roadmap" element={<Roadmap />} />
    <Route path="interview" element={<Interview />} />
    <Route path="ai-coach" element={<AICoach />} />
    <Route path="learning" element={<Learning />} />
    <Route path="progress" element={<Progress />} />
    <Route path="achievement" element={<Achievements />} />
    <Route path="notification" element={<Notification />} />
    <Route path="payment" element={<Payment />} />
    <Route path="settings" element={<Settings />} />
</Route>   

      {/* Admin Login */}
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Dashboard */}
      <Route
        path="/admin/dashboard/*"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="resume-reports" element={<AdminResumeReports />} />
        <Route path="career-assessment" element={<AdminCareerAssessment />}/>
        <Route path="resume-analyzer" element={<AdminResumeAnalyzer />}/>
        <Route path="skill-gap" element={<AdminSkillGap />}/>
        <Route path="career-roadmaps" element={<AdminCareerRoadmaps />}/>
        <Route path="mock-interviews" element={<AdminMockInterviews />}/>
        <Route path="learning" element={<AdminLearning />}/>
        <Route path="payments" element={<AdminPayments />}/>
        <Route path="analytics" element={<AdminAnalytics />}/>
        <Route path="notifications" element={<AdminNotifications />}/>
        <Route path="settings" element={<AdminSettings />}/>
        </Route>
    </Routes>
  );
}

export default App;