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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/threats" element={<Threats />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/data-access" element={<DataAccess />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
