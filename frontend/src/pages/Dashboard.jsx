import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Users, AlertTriangle, ShieldCheck, Globe, ShieldOff, Bell } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const threatData = [
  { time: '08:00', threats: 12 }, { time: '09:00', threats: 15 }, { time: '10:00', threats: 8 },
  { time: '11:00', threats: 25 }, { time: '12:00', threats: 45 }, { time: '13:00', threats: 15 },
  { time: '14:00', threats: 65 }, { time: '15:00', threats: 20 },
];

const loginData = [
  { time: '08:00', valid: 120, anomalous: 5 }, { time: '09:00', valid: 350, anomalous: 12 },
  { time: '10:00', valid: 450, anomalous: 8 }, { time: '11:00', valid: 210, anomalous: 45 },
  { time: '12:00', valid: 180, anomalous: 15 }, { time: '13:00', valid: 310, anomalous: 22 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [auditLogs, setAuditLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserRoles(payload.roles ? payload.roles.split(',') : []);
    } catch (e) {
      console.error("Token decoding failed");
    }

    const fetchDashboardData = async () => {
      try {
        const [auditRes, notifRes] = await Promise.all([
          axios.get('/api/data/audits', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/notifications', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setAuditLogs(auditRes.data);
        setAlerts(notifRes.data.filter(n => n.severity === 'High' || n.severity === 'Critical'));
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Simulate "Live Feed" effect
    const interval = setInterval(() => {
      setAuditLogs(prev => {
        if (prev.length === 0) return prev;
        const newLog = {
          id: Date.now(),
          username: "system_monitor",
          action: "PING_ALIVE",
          details: "Routine health check passed.",
          timestamp: new Date().toISOString()
        };
        return [newLog, ...prev.slice(0, 9)];
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [navigate]);

  const isAdmin = userRoles.includes('ROLE_ADMIN');
  const isAnalyst = userRoles.includes('ROLE_ANALYST') || isAdmin;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">{isAdmin ? 'Global Security Center' : 'Personal Security Hub'}</h1>
          <p className="text-gray-400 text-sm">
            {isAdmin ? 'Real-time enterprise threat monitoring and anomaly detection.' : 'Monitoring your account activity and security status.'}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono bg-black/40 border border-white/10 px-3 py-1.5 rounded text-green-400">
          <span className="relative flex h-2 w-2 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          SECURE CONNECTION
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isAdmin && (
          <motion.div whileHover={{ y: -2 }} className="glass-panel p-5 border-t-2 border-t-primary cursor-default">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Active Users</p>
            <div className="flex justify-between items-end">
              <h3 className="text-3xl font-bold">1,204</h3>
              <Users className="w-6 h-6 text-primary/50 mb-1" />
            </div>
          </motion.div>
        )}
        <motion.div whileHover={{ y: -2 }} className="glass-panel p-5 border-t-2 border-t-green-500 cursor-default">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Security Status</p>
          <div className="flex justify-between items-end">
            <h3 className="text-3xl font-bold text-green-500">Safe</h3>
            <ShieldCheck className="w-6 h-6 text-green-500/50 mb-1" />
          </div>
        </motion.div>
        <motion.div whileHover={{ y: -2 }} className="glass-panel p-5 border-t-2 border-t-accent cursor-default">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Personal Risk</p>
          <div className="flex justify-between items-end">
            <h3 className="text-3xl font-bold text-accent">Low</h3>
            <Activity className="w-6 h-6 text-accent/50 mb-1" />
          </div>
        </motion.div>
        <motion.div whileHover={{ y: -2 }} className="glass-panel p-5 border-t-2 border-t-secondary cursor-default">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">DLP Blocks</p>
          <div className="flex justify-between items-end">
            <h3 className="text-3xl font-bold text-secondary">0</h3>
            <ShieldOff className="w-6 h-6 text-secondary/50 mb-1" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {isAnalyst && (
            <div className="glass-panel p-5">
              <h2 className="text-sm font-bold mb-4 uppercase tracking-wider text-gray-400 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-primary" /> Global Login Trends
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={loginData}>
                    <defs>
                      <linearGradient id="colorValid" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAnom" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="time" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a24', borderColor: '#333' }} />
                    <Area type="monotone" dataKey="valid" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValid)" />
                    <Area type="monotone" dataKey="anomalous" stroke="#ef4444" fillOpacity={1} fill="url(#colorAnom)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className={`grid grid-cols-1 ${isAnalyst ? 'md:grid-cols-2' : ''} gap-6`}>
            {isAnalyst && (
              <div className="glass-panel p-5">
                <h2 className="text-sm font-bold mb-4 uppercase tracking-wider text-gray-400 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" /> Enterprise Threats
                </h2>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={threatData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis dataKey="time" stroke="#666" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#1a1a24', borderColor: '#333' }} />
                      <Line type="monotone" dataKey="threats" stroke="#f97316" strokeWidth={2} dot={{r:3, fill:'#f97316'}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div className={`glass-panel p-5 relative overflow-hidden flex flex-col justify-center items-center text-center ${!isAnalyst ? 'h-full' : ''}`}>
              <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-cover"></div>
              <Globe className="w-10 h-10 text-primary mb-3 relative z-10" />
              <h3 className="text-lg font-bold text-white relative z-10">Access Monitoring</h3>
              <p className="text-xs text-gray-400 relative z-10 mt-2">
                Your account is currently protected by Zero Trust verification across all geographic locations.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-5 flex flex-col h-[400px]">
            <h2 className="text-sm font-bold mb-3 uppercase tracking-wider text-gray-400 flex items-center justify-between">
              <div className="flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2 text-accent" /> {isAnalyst ? 'Live Security Feed' : 'Your Recent Activity'}
              </div>
            </h2>
            <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="animate-pulse space-y-3"><div className="h-16 bg-white/5 rounded"></div><div className="h-16 bg-white/5 rounded"></div></div>
              ) : (
                <AnimatePresence initial={false}>
                  {auditLogs.map((log) => (
                    <motion.div 
                      key={log.id} 
                      initial={{ opacity: 0, height: 0, scale: 0.9 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.9 }}
                      className="bg-black/40 p-3 rounded border border-white/5 text-sm"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-primary text-xs">{log.username}</span>
                        <span className="text-[10px] text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="text-gray-300">
                        <span className="text-accent text-[10px] uppercase tracking-wider border border-accent/30 px-1 py-0.5 rounded mr-2">
                          {log.action}
                        </span>
                        <span className="text-gray-400 text-xs">{log.details}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {isAnalyst && (
            <div className="glass-panel p-5 flex flex-col h-[280px]">
              <h2 className="text-sm font-bold mb-3 uppercase tracking-wider text-gray-400 flex items-center justify-between">
                <div className="flex items-center text-red-500">
                  <Bell className="w-4 h-4 mr-2" /> Critical Alerts
                </div>
              </h2>
              <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                {alerts.length > 0 ? (
                  alerts.map((alert, idx) => (
                    <div key={idx} className="bg-red-500/10 border border-red-500/30 p-3 rounded text-sm">
                      <p className="font-bold text-red-400 mb-1">{alert.title}</p>
                      <p className="text-xs text-gray-400">{alert.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <ShieldCheck className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-xs">No active critical alerts.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
