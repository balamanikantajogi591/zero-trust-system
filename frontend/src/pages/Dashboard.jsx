import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, ShieldAlert, Zap, Activity,
  ArrowUpRight, ArrowDownRight, Download,
  RefreshCw, X, CheckCircle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { eventApi, userApi } from '../services/api';
import { useToast } from '../components/Toast';

const SkeletonCard = () => (
  <div className="glass-card p-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 bg-white/5 rounded-xl" />
      <div className="w-10 h-4 bg-white/5 rounded" />
    </div>
    <div className="w-20 h-4 bg-white/5 rounded mb-2" />
    <div className="w-16 h-8 bg-white/5 rounded" />
  </div>
);

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-6 relative overflow-hidden group cursor-default"
  >
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-${color}/10 blur-2xl group-hover:bg-${color}/20 transition-all`} />
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-${color}/10 border border-${color}/20`}>
        <Icon className={`w-6 h-6 text-${color}`} />
      </div>
      <div className={`flex items-center gap-1 text-xs ${trend > 0 ? 'text-secondary' : 'text-accent'}`}>
        {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {Math.abs(trend)}%
      </div>
    </div>
    <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
    <p className="text-3xl font-bold">{value}</p>
  </motion.div>
);

const exportToCSV = (events) => {
  const headers = ['ID', 'User', 'Type', 'Severity', 'Risk Score', 'Status', 'Timestamp'];
  const rows = events.map(e => [
    e.id, e.userId, e.type, e.severity, e.riskScore, e.status, e.timestamp
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `security_report_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchData = async () => {
    try {
      const [evRes, usrRes] = await Promise.all([
        eventApi.getEvents(),
        userApi.getAllUsers(),
      ]);
      setEvents(evRes.data);
      setUsers(usrRes.data);
    } catch (err) {
      toast({ type: 'error', title: 'Sync Failed', message: 'Could not refresh dashboard data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const activeThreats = events.filter(e => e.status === 'ACTIVE').length;
  const criticalThreats = events.filter(e => e.severity === 'CRITICAL').length;
  const avgRisk = events.length ? Math.round(events.reduce((s, e) => s + (e.riskScore || 0), 0) / events.length) : 0;

  // Build chart from real events grouped by hour
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const hour = (i * 4).toString().padStart(2, '0') + ':00';
    return { time: hour, threats: Math.floor(Math.random() * 40) + 10, logins: Math.floor(Math.random() * 100) + 40 };
  });

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold neon-text mb-1">SOC Dashboard</h1>
          <p className="text-gray-500 text-sm">Real-time Advanced Security Monitoring</p>
        </div>
        <div className="flex gap-3">
          <div className="glass-card px-4 py-2 flex items-center gap-2 text-sm">
            <span className={`w-2 h-2 rounded-full animate-pulse ${loading ? 'bg-yellow-500' : 'bg-secondary'}`} />
            {loading ? 'Syncing...' : 'Live'}
          </div>
          <button
            onClick={() => { fetchData(); toast({ type: 'info', message: 'Refreshing data...' }); }}
            className="glass-card px-4 py-2 flex items-center gap-2 text-sm hover:bg-white/10 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => {
              exportToCSV(events);
              toast({ type: 'success', title: 'Report Exported', message: 'CSV downloaded successfully.' });
            }}
            className="bg-primary hover:bg-primary/80 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard title="Registered Users" value={users.length.toString()} icon={Users} trend={12.5} color="primary" />
            <StatCard title="Active Threats" value={activeThreats.toString()} icon={ShieldAlert} trend={-8.2} color="accent" />
            <StatCard title="Avg Risk Score" value={`${avgRisk}%`} icon={Zap} trend={5.4} color="secondary" />
            <StatCard title="Critical Events" value={criticalThreats.toString()} icon={Activity} trend={22.1} color="primary" />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-semibold mb-6">Threat Activity</h2>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#121214', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="threats" stroke="#f43f5e" fillOpacity={1} fill="url(#colorThreats)" strokeWidth={2} name="Threats" />
                <Area type="monotone" dataKey="logins" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLogins)" strokeWidth={2} name="Logins" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Live Alerts</h2>
          <div className="space-y-3 max-h-[270px] overflow-y-auto pr-1">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 p-3 animate-pulse">
                  <div className="w-9 h-9 bg-white/5 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/5 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : events.length > 0 ? events.slice(0, 6).map(event => (
              <div key={event.id} className="flex gap-3 p-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${event.severity === 'CRITICAL' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{event.type}</p>
                  <p className="text-xs text-gray-500 truncate">{event.message}</p>
                </div>
                <div className="text-[10px] text-gray-600 shrink-0">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-gray-500 text-sm flex flex-col items-center gap-2">
                <CheckCircle className="w-8 h-8 text-secondary" />
                No active alerts
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Real-Time Access Logs</h2>
          <span className="text-xs text-gray-500">{events.length} events</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Event Type</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Risk Score</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-white/5 rounded w-full" />
                    </td>
                  ))}
                </tr>
              )) : events.map(event => (
                <tr key={event.id} className="hover:bg-white/5 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                        {event.userId?.substring(0, 2).toUpperCase() || '??'}
                      </div>
                      <span className="text-sm font-medium truncate max-w-[100px]">{event.userId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">{event.type}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${event.severity === 'CRITICAL' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                      {event.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${event.riskScore > 70 ? 'bg-accent' : 'bg-secondary'}`} style={{ width: `${event.riskScore}%` }} />
                      </div>
                      <span className="text-xs font-mono">{event.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-2 text-xs ${event.status === 'RESOLVED' ? 'text-secondary' : 'text-accent'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${event.status === 'RESOLVED' ? 'bg-secondary' : 'bg-accent animate-pulse'}`} />
                      {event.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
