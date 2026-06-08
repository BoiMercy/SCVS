import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';

// Layout & Public
import AppLayout from './components/AppLayout';
import LandingPage from './pages/LandingPage';
import VerifyPage from './pages/VerifyPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Shared
import NotificationsPage from './pages/shared/NotificationsPage';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import ClearanceApplication from './pages/student/ClearanceApplication';
import ClearanceStatus from './pages/student/ClearanceStatus';
import RemediationPage from './pages/student/RemediationPage';
import CertificateDownload from './pages/student/CertificateDownload';

// Officer
import OfficerDashboard from './pages/officer/OfficerDashboard';
import ReviewHistory from './pages/officer/ReviewHistory';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ReportsPage from './pages/admin/ReportsPage';
import AuditLogViewer from './pages/admin/AuditLogViewer';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  
  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  
  if (allowedRoles) {
    const isOfficerReq = allowedRoles.includes('officer');
    if (isOfficerReq && !user.role.name.includes('officer') && !user.role.name.includes('admin')) {
      return <Navigate to="/" replace />;
    }
    if (!isOfficerReq && !allowedRoles.includes(user.role.name)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}

export default function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<VerifyPage />} />

        <Route element={<AppLayout />}>
          {/* Shared */}
          <Route path="/student/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/apply" element={<ProtectedRoute allowedRoles={['student']}><ClearanceApplication /></ProtectedRoute>} />
          <Route path="/student/status" element={<ProtectedRoute allowedRoles={['student']}><ClearanceStatus /></ProtectedRoute>} />
          <Route path="/student/remediate/:id" element={<ProtectedRoute allowedRoles={['student']}><RemediationPage /></ProtectedRoute>} />
          <Route path="/student/certificate" element={<ProtectedRoute allowedRoles={['student']}><CertificateDownload /></ProtectedRoute>} />

          {/* Officer Routes */}
          <Route path="/officer/dashboard" element={<ProtectedRoute allowedRoles={['officer']}><OfficerDashboard /></ProtectedRoute>} />
          <Route path="/officer/history" element={<ProtectedRoute allowedRoles={['officer']}><ReviewHistory /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['super_admin']}><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['super_admin']}><ReportsPage /></ProtectedRoute>} />
          <Route path="/admin/audit-logs" element={<ProtectedRoute allowedRoles={['super_admin']}><AuditLogViewer /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
