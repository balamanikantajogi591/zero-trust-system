import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
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
  return (
    <Router>
      <div className="min-h-screen bg-background text-white selection:bg-primary/30">
        <Routes>
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

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
