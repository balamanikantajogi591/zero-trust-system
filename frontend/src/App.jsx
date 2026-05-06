import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
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
import LoginPage from './pages/Login';
import LandingPage from './pages/LandingPage';
import { useState, useEffect } from 'react';
import notificationService from './services/NotificationService';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X } from 'lucide-react';

// Placeholder components for other pages
const Placeholder = ({ title }) => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-primary mb-4">{title}</h1>
    <div className="glass-card p-12 text-center text-gray-500">
      This page is under construction for the Zero Trust System.
    </div>
  </div>
);

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [toast, setToast] = useState(null);

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

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com">
      <Router>
        <AnimatePresence>
          {toast && (
            <motion.div 
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 50, x: '-50%' }}
              className="fixed bottom-8 left-1/2 z-[100] w-full max-w-md"
            >
              <div className={`glass-card p-4 border-l-4 ${
                toast.severity === 'CRITICAL' ? 'border-accent' : 'border-primary'
              } shadow-2xl flex items-center gap-4`}>
                <div className={`p-2 rounded-lg ${
                  toast.severity === 'CRITICAL' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                }`}>
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
                <Sidebar user={user} />
                <div className="flex flex-col flex-1">
                  <Topbar user={user} onLogout={handleLogout} />
                  <main className="ml-64 min-h-[calc(100vh-64px)] transition-all">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      {user.role === 'ADMIN' && <Route path="/users" element={<UserManagement />} />}
                      <Route path="/threats" element={<ThreatDetection />} />
                      <Route path="/ai-insights" element={<AiInsights />} />
                      <Route path="/dlp" element={<DlpManagement />} />
                      <Route path="/logs" element={<AuditLogs />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/notifications" element={<Notifications />} />
                      <Route path="/settings" element={<Settings />} />
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
    </GoogleOAuthProvider>
  );
}

export default App;
