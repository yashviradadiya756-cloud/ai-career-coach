import { Routes, Route } from "react-router-dom";

// ==========================================
// PUBLIC PAGES
// ==========================================

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./dashboard/pages/Profile";

import LandingPage from "./pages/LandingPage";
import Pricing from "./components/Pricing";
import ContactUs from "./pages/ContactUs";
import Demo from "./components/Demo";


// ==========================================
// USER AUTH
// ==========================================

import ProtectedRoute from "./components/ProtectedRoute";


// ==========================================
// USER DASHBOARD
// ==========================================

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


// ==========================================
// ADMIN AUTH
// ==========================================

import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";
import AdminLogin from "./admin/pages/AdminLogin";


// ==========================================
// ADMIN LAYOUT
// ==========================================

import AdminLayout from "./admin/AdminLayout";


// ==========================================
// ADMIN PAGES
// ==========================================

import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminAICoach from "./admin/pages/AdminAICoach";
import AdminResumes from "./admin/pages/AdminResumes";
import AdminSkillGap from "./admin/pages/AdminSkillGap";
import AdminRoadmaps from "./admin/pages/AdminRoadmaps";
import AdminInterviews from "./admin/pages/AdminInterviews";
import AdminLearning from "./admin/pages/AdminLearning";
import AdminPayments from "./admin/pages/AdminPayments";
import AdminProgress from "./admin/pages/AdminProgress";
import AdminAchievements from "./admin/pages/AdminAchievements";
import AdminCertificateCriteria from "./admin/pages/AdminCertificateCriteria";
import AdminSettings from "./admin/pages/AdminSettings";


// ==========================================
// APP
// ==========================================

function App() {

  return (

    <Routes>


      {/* ======================================
          PUBLIC ROUTES
      ====================================== */}

      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/demo" element={<Demo />} />


      {/* ======================================
          USER DASHBOARD
      ====================================== */}

      <Route path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
        <Route index element={ <Overview /> }/>
        <Route path="overview" element={ <Overview />} />
        <Route path="assessment" element={ <Assessment />}/>
        <Route path="resume" element={ <Resume /> }/>
        <Route path="skill-gap" element={ <SkillGap /> } />
        <Route path="roadmap" element={ <Roadmap /> }/>
        <Route path="interview" element={ <Interview /> } />
        <Route path="ai-coach" element={ <AICoach /> } />
        <Route path="learning" element={ <Learning />  }/>
        <Route path="progress" element={ <Progress />  }/>
        <Route path="achievement" element={ <Achievements /> } />
        <Route path="notification" element={ <Notification /> } />
        <Route path="payment" element={ <Payment /> } />
        <Route path="settings" element={ <Settings />} />
      </Route>


      {/* ======================================
          ADMIN LOGIN
      ====================================== */}

      <Route path="/admin/login" element={ <AdminLogin /> }/>

      {/* ======================================
          ADMIN PANEL
      ====================================== */}

      <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute> }>

        {/* ADMIN DASHBOARD */}

        <Route index element={ <AdminDashboard /> } />
        <Route path="users" element={ <AdminUsers /> } />
        <Route path="ai-coach" element={ <AdminAICoach /> }/>
        <Route path="resumes" element={ <AdminResumes /> } />
        <Route path="skillgap" element={ <AdminSkillGap /> } />
        <Route path="roadmaps" element={ <AdminRoadmaps /> } />
        <Route path="interviews" element={<AdminInterviews />}/>
        <Route path="Learning" element={<AdminLearning />}/>
        <Route path="/admin/payments" element={<AdminPayments />}/>
        <Route path="/admin/progress" element={ <AdminProgress /> }/>
        <Route path="/admin/achievements" element={ <AdminAchievements /> } />
        <Route path="/admin/certificate-criteria" element={<AdminCertificateCriteria />}/>
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>

  );

}


export default App;