import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { PlatformProvider } from './context/PlatformContext';
import { ToastProvider } from './context/ToastContext';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { History } from 'lucide-react';

const AdminLayout       = lazy(() => import('./components/layout/AdminLayout'));
const AdminDashboard    = lazy(() => import('./pages/AdminDashboard'));
const UserManagement    = lazy(() => import('./pages/UserManagement'));
const InvestmentManagement = lazy(() => import('./pages/InvestmentManagement'));
const WithdrawalManagement = lazy(() => import('./pages/WithdrawalManagement'));
const DepositManagement = lazy(() => import('./pages/DepositManagement'));
const ActionLogs        = lazy(() => import('./pages/ActionLogs'));
const SecuritySettings  = lazy(() => import('./pages/SecuritySettings'));
const CommunicationsCenter = lazy(() => import('./pages/CommunicationsCenter'));
const PlatformSettings  = lazy(() => import('./pages/PlatformSettings'));
const Login             = lazy(() => import('./pages/Login'));
const AdminNotifications = lazy(() => import('./pages/AdminNotifications'));

const Loader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="w-10 h-10 rounded-full border-2 border-blue-600/20 border-t-blue-600 animate-spin" />
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <PlatformProvider>
      <Suspense fallback={<Loader />}>
        <AdminLayout>{children}</AdminLayout>
      </Suspense>
    </PlatformProvider>
  </ProtectedRoute>
);

function App() {
  return (
    <ToastProvider>
      <Toaster position="top-right" richColors closeButton theme="light" />
      <Router>
        <ScrollToTop />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedLayout><AdminDashboard /></ProtectedLayout>} />
            <Route path="/users" element={<ProtectedLayout><UserManagement /></ProtectedLayout>} />
            <Route path="/investments" element={<ProtectedLayout><InvestmentManagement /></ProtectedLayout>} />
            <Route path="/withdrawals" element={<ProtectedLayout><WithdrawalManagement /></ProtectedLayout>} />
            <Route path="/deposits" element={<ProtectedLayout><DepositManagement /></ProtectedLayout>} />
            <Route path="/security" element={<ProtectedLayout><SecuritySettings /></ProtectedLayout>} />
            <Route path="/communications" element={<ProtectedLayout><CommunicationsCenter /></ProtectedLayout>} />
            <Route path="/settings" element={<ProtectedLayout><PlatformSettings /></ProtectedLayout>} />
            <Route path="/logs" element={<ProtectedLayout><ActionLogs /></ProtectedLayout>} />
            <Route path="/notifications" element={<ProtectedLayout><AdminNotifications /></ProtectedLayout>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ToastProvider>
  );
}

export default App;
