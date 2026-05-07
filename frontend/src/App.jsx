import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './components/Toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import ThreatDetection from './pages/ThreatDetection';
import AiInsights from './pages/AiInsights';
import DlpManagement from './pages/DlpManagement';
import AuditLogs from './pages/AuditLogs';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';
import LandingPage from './pages/LandingPage';
import notificationService from './services/NotificationService';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X } from 'lucide-react';

function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (!savedUser) return null;
      const parsed = JSON.parse(savedUser);
      // Only allow ADMIN
      if (parsed.role !== 'ADMIN') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return null;
      }
      return parsed;
    } catch { return null; }
  });

  const [toast, setToast] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    if (user) {
      notificationService.connect();
      notificationService.onMessageReceived((alert) => {
        setToast(alert);
        setTimeout(() => setToast(null), 5000);
      });
    }
    return () => notificationService.disconnect();
  }, [user]);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'missing-client-id';

  // Admin dashboard layout
  const AdminLayout = ({ children }) => (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        user={user}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
      />
      <div className={`flex flex-col flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'}`}>
        <Topbar user={user} onLogout={handleLogout} onMenuToggle={() => setSidebarCollapsed(c => !c)} />
        <main className="min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ToastProvider>
        <Router>
          {/* WebSocket alert overlay */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: 50, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: 50, x: '-50%' }}
                className="fixed bottom-8 left-1/2 z-[100] w-full max-w-md"
              >
                <div className={`glass-card p-4 border-l-4 ${toast.severity === 'CRITICAL' ? 'border-accent' : 'border-primary'} shadow-2xl flex items-center gap-4`}>
                  <div className={`p-2 rounded-lg ${toast.severity === 'CRITICAL' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold">{toast.title}</h4>
                    <p className="text-xs text-gray-500">{toast.message}</p>
                  </div>
                  <button onClick={() => setToast(null)} className="text-gray-500 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Routes>
            {/* Public Landing */}
            <Route path="/" element={<LandingPage />} />

            {/* Admin Login */}
            <Route path="/login" element={
              user ? <Navigate to="/dashboard" replace /> : <AdminLogin onLoginSuccess={setUser} />
            } />

            {/* Protected Admin Routes — all wrapped with ProtectedRoute */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AdminLayout><Dashboard /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute>
                <AdminLayout><UserManagement /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/threats" element={
              <ProtectedRoute>
                <AdminLayout><ThreatDetection /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/ai-insights" element={
              <ProtectedRoute>
                <AdminLayout><AiInsights /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/dlp" element={
              <ProtectedRoute>
                <AdminLayout><DlpManagement /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/logs" element={
              <ProtectedRoute>
                <AdminLayout><AuditLogs /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <AdminLayout><Analytics /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <AdminLayout><Notifications /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <AdminLayout><Settings /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <AdminLayout><Profile user={user} onLogout={handleLogout} /></AdminLayout>
              </ProtectedRoute>
            } />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
