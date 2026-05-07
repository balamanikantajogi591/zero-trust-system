import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
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
import LoginPage from './pages/Login';
import LandingPage from './pages/LandingPage';
import notificationService from './services/NotificationService';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, Menu } from 'lucide-react';

function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
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

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ToastProvider>
        <Router>
          {/* WebSocket toast overlay */}
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
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Page */}
            <Route path="/login" element={
              !user ? (
                <LoginPage onLoginSuccess={(userData) => setUser(userData)} />
              ) : (
                <Navigate to="/dashboard" />
              )
            } />

            {/* Protected Dashboard Layout */}
            <Route path="/*" element={
              user ? (
                <div className="min-h-screen bg-background flex">
                  <Sidebar
                    user={user}
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(c => !c)}
                  />
                  <div className={`flex flex-col flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'}`}>
                    <Topbar user={user} onLogout={handleLogout} onMenuToggle={() => setSidebarCollapsed(c => !c)} />
                    <main className="min-h-[calc(100vh-64px)] ml-0">
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/users" element={<UserManagement />} />
                        <Route path="/threats" element={<ThreatDetection />} />
                        <Route path="/ai-insights" element={<AiInsights />} />
                        <Route path="/dlp" element={<DlpManagement />} />
                        <Route path="/logs" element={<AuditLogs />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} />} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              ) : (
                <Navigate to="/login" />
              )
            } />
          </Routes>
        </Router>
      </ToastProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
