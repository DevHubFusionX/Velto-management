import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import InvestmentManagement from './pages/InvestmentManagement';
import WithdrawalManagement from './pages/WithdrawalManagement';
import DepositManagement from './pages/DepositManagement';
import ActionLogs from './pages/ActionLogs';
import SecuritySettings from './pages/SecuritySettings';
import CommunicationsCenter from './pages/CommunicationsCenter';
import PlatformSettings from './pages/PlatformSettings';
import Login from './pages/Login';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { History } from 'lucide-react';

import { PlatformProvider } from './context/PlatformContext';
import { ToastProvider } from './context/ToastContext';
import { Toaster } from 'sonner';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout wrapper for protected routes
const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <PlatformProvider>
      <AdminLayout>
        {children}
      </AdminLayout>
    </PlatformProvider>
  </ProtectedRoute>
);

function App() {
  return (
    <ToastProvider>
      <Toaster position="top-right" richColors closeButton theme="light" />
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedLayout>
              <AdminDashboard />
            </ProtectedLayout>
          } />

          <Route path="/users" element={
            <ProtectedLayout>
              <UserManagement />
            </ProtectedLayout>
          } />

          <Route path="/investments" element={
            <ProtectedLayout>
              <InvestmentManagement />
            </ProtectedLayout>
          } />

          <Route path="/withdrawals" element={
            <ProtectedLayout>
              <WithdrawalManagement />
            </ProtectedLayout>
          } />

          <Route path="/deposits" element={
            <ProtectedLayout>
              <DepositManagement />
            </ProtectedLayout>
          } />

          <Route path="/security" element={
            <ProtectedLayout>
              <SecuritySettings />
            </ProtectedLayout>
          } />

          <Route path="/communications" element={
            <ProtectedLayout>
              <CommunicationsCenter />
            </ProtectedLayout>
          } />

          <Route path="/settings" element={
            <ProtectedLayout>
              <PlatformSettings />
            </ProtectedLayout>
          } />

          <Route path="/logs" element={
            <ProtectedLayout>
              <ActionLogs />
            </ProtectedLayout>
          } />

          {/* Fallback for Settings or other paths */}
          <Route path="*" element={<div className="flex flex-col items-center justify-center py-40 animate-pulse">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-6">
              <History size={32} />
            </div>
            <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">Module Sequence Initializing...</p>
          </div>} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
