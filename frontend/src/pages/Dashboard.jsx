import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  ShieldAlert, 
  Zap, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Globe
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { eventApi } from '../services/api';

const chartData = [
  { time: '00:00', threats: 12, logins: 40 },
  { time: '04:00', threats: 18, logins: 35 },
  { time: '08:00', threats: 45, logins: 120 },
  { time: '12:00', threats: 30, logins: 150 },
  { time: '16:00', threats: 25, logins: 180 },
  { time: '20:00', threats: 55, logins: 90 },
  { time: '23:59', threats: 20, logins: 50 },
];

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-6 relative overflow-hidden group"
  >
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-${color}/10 blur-2xl group-hover:bg-${color}/20 transition-all`}></div>
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

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventApi.getEvents();
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch events", err);
        setLoading(false);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 10000); // 10s refresh for demo
    return () => clearInterval(interval);
  }, []);

  const activeThreats = events.filter(e => e.status === 'ACTIVE').length;
  const criticalThreats = events.filter(e => e.severity === 'CRITICAL').length;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold neon-text mb-2">SOC Dashboard</h1>
          <p className="text-gray-500">Real-time Zero Trust Security Monitoring</p>
        </div>
        <div className="flex gap-3">
          <div className="glass-card px-4 py-2 flex items-center gap-2 text-sm">
            <span className={`w-2 h-2 rounded-full animate-pulse ${loading ? 'bg-gray-500' : 'bg-secondary'}`}></span>
            {loading ? 'Syncing...' : 'System Online'}
          </div>
          <button className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-all">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Users" value="1,284" icon={Users} trend={12.5} color="primary" />
        <StatCard title="Threat Alerts" value={activeThreats.toString()} icon={ShieldAlert} trend={-8.2} color="accent" />
        <StatCard title="Risk Score" value={(criticalThreats * 15 + 5).toString()} icon={Zap} trend={5.4} color="secondary" />
        <StatCard title="Data Flow" value="2.4 GB" icon={Activity} trend={22.1} color="primary" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-semibold mb-6">Threat Activity & Traffic</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121214', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="threats" stroke="#f43f5e" fillOpacity={1} fill="url(#colorThreats)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-6">Live Alerts</h2>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {events.length > 0 ? events.slice(0, 5).map((event) => (
              <div key={event.id} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5 group">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  event.severity === 'CRITICAL' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                }`}>
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.type}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[150px]">{event.message}</p>
                </div>
                <div className="text-[10px] text-gray-600">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500 text-sm">No active alerts</div>
            )}
          </div>
          <button className="w-full mt-6 py-2 text-primary text-xs font-semibold hover:underline">
            View All Alerts
          </button>
        </div>
      </div>

      {/* Activity Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-semibold">Real-Time Access Logs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">User ID</th>
                <th className="px-6 py-4 font-semibold">Event Type</th>
                <th className="px-6 py-4 font-semibold">Severity</th>
                <th className="px-6 py-4 font-semibold">Risk Score</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-white/5 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        {event.userId?.substring(0, 2).toUpperCase() || '??'}
                      </div>
                      <span className="text-sm font-medium">{event.userId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">{event.type}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      event.severity === 'CRITICAL' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                    }`}>
                      {event.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${event.riskScore > 70 ? 'bg-accent' : 'bg-secondary'}`}
                          style={{ width: `${event.riskScore}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-mono">{event.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-2 text-xs ${
                      event.status === 'RESOLVED' ? 'text-secondary' : 'text-accent'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        event.status === 'RESOLVED' ? 'bg-secondary' : 'bg-accent animate-pulse'
                      }`}></span>
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
