import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = window.location.origin;
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import AuditLogs from './pages/AuditLogs';
import DataAccess from './pages/DataAccess';
import Users from './pages/Users';
import Threats from './pages/Threats';
import Insights from './pages/Insights';
import Notifications from './pages/Notifications';
import Analytics from './pages/Analytics';
import Layout from './components/Layout';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  
  if (requiredRole) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles = payload.roles ? payload.roles.split(',') : [];
      const isAdmin = roles.includes('ROLE_ADMIN');
      const isAnalyst = roles.includes('ROLE_ANALYST') || isAdmin;
      
      if (requiredRole === 'ROLE_ADMIN' && !isAdmin) return <Navigate to="/dashboard" replace />;
      if (requiredRole === 'ROLE_ANALYST' && !isAnalyst) return <Navigate to="/dashboard" replace />;
    } catch (e) {
      return <Navigate to="/login" replace />;
    }
  }
  
  return children;
};

function App() {
  // Session Timeout Logic (15 minutes of inactivity)
  useEffect(() => {
    let timeout;
    const resetTimeout = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        const token = localStorage.getItem('token');
        if (token) {
          localStorage.removeItem('token');
          window.location.href = '/login?timeout=true';
        }
      }, 15 * 60 * 1000); // 15 mins
    };

    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keydown', resetTimeout);
    resetTimeout();

    return () => {
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keydown', resetTimeout);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-background text-white selection:bg-primary/30">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Login />} />
          
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute requiredRole="ROLE_ADMIN"><Users /></ProtectedRoute>} />
            <Route path="/threats" element={<ProtectedRoute requiredRole="ROLE_ANALYST"><Threats /></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute requiredRole="ROLE_ANALYST"><Insights /></ProtectedRoute>} />
            <Route path="/data-access" element={<ProtectedRoute requiredRole="ROLE_ANALYST"><DataAccess /></ProtectedRoute>} />
            <Route path="/audit-logs" element={<ProtectedRoute requiredRole="ROLE_ANALYST"><AuditLogs /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute requiredRole="ROLE_ANALYST"><Analytics /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
