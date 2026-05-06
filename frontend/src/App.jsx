import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Utils
import { isAuthenticated, getUserRole } from './utils/auth';

// Pages
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

// Components
import Layout from './components/Layout';
import ProtectedRoute from './routes/ProtectedRoute';

// Configure Axios
axios.defaults.baseURL = window.location.origin;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-white selection:bg-primary/30">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Admin/Analyst Restricted Routes */}
            <Route path="/users" element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <Users />
              </ProtectedRoute>
            } />
            
            <Route path="/audit-logs" element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_ANALYST']}>
                <AuditLogs />
              </ProtectedRoute>
            } />

            {/* General Protected Routes */}
            <Route path="/threats" element={<Threats />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/data-access" element={<DataAccess />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
