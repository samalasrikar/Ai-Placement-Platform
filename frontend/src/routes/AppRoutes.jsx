import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// Public Pages
import LandingPage from '../pages/Home/LandingPage';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';

// Student Pages
import StudentDashboard from '../pages/StudentDashboard/StudentDashboard';
import StudentProfile from '../pages/StudentProfile/StudentProfile';
import ResumeAnalyzer from '../pages/ResumeAnalyzer/ResumeAnalyzer';
import AIChatbot from '../pages/AIChatbot/AIChatbot';
import JobListings from '../pages/JobListings/JobListings';
import JobDetails from '../pages/JobDetails/JobDetails';
import AppliedJobs from '../pages/AppliedJobs/AppliedJobs';

// Recruiter Pages
import RecruiterDashboard from '../pages/RecruiterDashboard/RecruiterDashboard';
import PostJob from '../pages/PostJob/PostJob';
import Applicants from '../pages/Applicants/Applicants';
import InterviewManagement from '../pages/InterviewManagement/InterviewManagement';

// Admin Pages
import AdminDashboard from '../pages/AdminDashboard/AdminDashboard';
import ManageStudents from '../pages/ManageStudents/ManageStudents';
import ManageRecruiters from '../pages/ManageRecruiters/ManageRecruiters';
import ManageJobs from '../pages/ManageJobs/ManageJobs';
import Analytics from '../pages/Analytics/Analytics';
import Reports from '../pages/Reports/Reports';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student Protected Layout */}
      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/chatbot" element={<AIChatbot />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/applied-jobs" element={<AppliedJobs />} />
        </Route>
      </Route>

      {/* Recruiter Protected Layout */}
      <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/applicants" element={<Applicants />} />
          <Route path="/interviews" element={<InterviewManagement />} />
        </Route>
      </Route>

      {/* Admin Protected Layout */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/manage-students" element={<ManageStudents />} />
          <Route path="/manage-recruiters" element={<ManageRecruiters />} />
          <Route path="/manage-jobs" element={<ManageJobs />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Route>

      {/* Fallback redirection to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
