import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import OpportunityExplorer from './pages/OpportunityExplorer';
import ApplicationTracker from './pages/ApplicationTracker';
import ReferralMarketplace from './pages/ReferralMarketplace';
import Bookmarks from './pages/Bookmarks';
import NotificationsPage from './pages/NotificationsPage';

// Alumni Pages
import AlumniReferrals from './pages/AlumniReferrals';
import AlumniProfile from './pages/AlumniProfile';
import AlumniHistory from './pages/AlumniHistory';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminVerification from './pages/AdminVerification';
import AdminAuditLogs from './pages/AdminAuditLogs';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentProfile /></ProtectedRoute>} />
          <Route path="/student/opportunities" element={<ProtectedRoute allowedRoles={['STUDENT']}><OpportunityExplorer /></ProtectedRoute>} />
          <Route path="/student/applications" element={<ProtectedRoute allowedRoles={['STUDENT']}><ApplicationTracker /></ProtectedRoute>} />
          <Route path="/student/referrals" element={<ProtectedRoute allowedRoles={['STUDENT']}><ReferralMarketplace /></ProtectedRoute>} />
          <Route path="/student/bookmarks" element={<ProtectedRoute allowedRoles={['STUDENT']}><Bookmarks /></ProtectedRoute>} />
          <Route path="/student/notifications" element={<ProtectedRoute allowedRoles={['STUDENT', 'ALUMNI', 'ADMIN']}><NotificationsPage /></ProtectedRoute>} />

          {/* Alumni Routes */}
          <Route path="/alumni/referrals" element={<ProtectedRoute allowedRoles={['ALUMNI']}><AlumniReferrals /></ProtectedRoute>} />
          <Route path="/alumni/profile" element={<ProtectedRoute allowedRoles={['ALUMNI']}><AlumniProfile /></ProtectedRoute>} />
          <Route path="/alumni/history" element={<ProtectedRoute allowedRoles={['ALUMNI']}><AlumniHistory /></ProtectedRoute>} />
          <Route path="/alumni/notifications" element={<ProtectedRoute allowedRoles={['ALUMNI']}><NotificationsPage /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/verification" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminVerification /></ProtectedRoute>} />
          <Route path="/admin/audit-logs" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminAuditLogs /></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['ADMIN']}><NotificationsPage /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
