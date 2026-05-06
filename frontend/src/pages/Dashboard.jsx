import React from 'react';
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
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';

const data = [
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
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold neon-text mb-2">SOC Dashboard</h1>
          <p className="text-gray-500">Real-time Zero Trust Security Monitoring</p>
        </div>
        <div className="flex gap-3">
          <div className="glass-card px-4 py-2 flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
            System Online
          </div>
          <button className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-all">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Users" value="1,284" icon={Users} trend={12.5} color="primary" />
        <StatCard title="Threat Alerts" value="42" icon={ShieldAlert} trend={-8.2} color="accent" />
        <StatCard title="Risk Score" value="18" icon={Zap} trend={5.4} color="secondary" />
        <StatCard title="Data Flow" value="2.4 GB" icon={Activity} trend={22.1} color="primary" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-semibold mb-6">Threat Activity & Traffic</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
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
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5 group">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Suspicious Login Attempt</p>
                  <p className="text-xs text-gray-500">User: j.doe@company.com</p>
                </div>
                <div className="text-[10px] text-gray-600">2m ago</div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-primary text-xs font-semibold hover:underline">
            View All Alerts
          </button>
        </div>
      </div>

      {/* Global Threat Map Section */}
      <div className="glass-card p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Global Threat Intelligence
            </h2>
            <p className="text-xs text-gray-500">Real-time visualization of intercepted attack vectors</p>
          </div>
          <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-2 text-secondary"><span className="w-2 h-2 rounded-full bg-secondary shadow-glow"></span> Verified Access</span>
            <span className="flex items-center gap-2 text-accent"><span className="w-2 h-2 rounded-full bg-accent animate-ping"></span> Blocked Attack</span>
          </div>
        </div>
        
        <div className="relative h-[400px] bg-white/[0.02] rounded-3xl overflow-hidden border border-white/5">
          {/* Simple SVG World Map (Schematic) */}
          <svg viewBox="0 0 1000 500" className="w-full h-full opacity-20">
            {/* Schematic continents */}
            <circle cx="250" cy="200" r="40" fill="#3b82f6" fillOpacity="0.2" />
            <circle cx="500" cy="250" r="60" fill="#3b82f6" fillOpacity="0.2" />
            <circle cx="750" cy="220" r="50" fill="#3b82f6" fillOpacity="0.2" />
            <circle cx="200" cy="350" r="30" fill="#3b82f6" fillOpacity="0.2" />
            <circle cx="800" cy="380" r="45" fill="#3b82f6" fillOpacity="0.2" />
          </svg>

          {/* Pulse Points */}
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-[30%] left-[25%] w-4 h-4 bg-secondary rounded-full shadow-glow"
          />
          <motion.div 
            animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-[50%] left-[50%] w-4 h-4 bg-accent rounded-full shadow-[0_0_15px_rgba(244,63,94,0.8)]"
          />
          <motion.div 
            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute top-[40%] left-[75%] w-3 h-3 bg-primary rounded-full shadow-glow"
          />
          <motion.div 
            animate={{ scale: [1, 2.5, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-[70%] left-[20%] w-4 h-4 bg-accent rounded-full shadow-[0_0_15px_rgba(244,63,94,0.8)]"
          />
          
          <div className="absolute bottom-6 left-6 p-4 glass-card border-primary/20 bg-primary/5">
            <p className="text-[10px] font-bold text-primary uppercase mb-1">Live Intelligence</p>
            <p className="text-sm font-medium">Attempted SQL Injection blocked in <span className="text-white">Berlin, DE</span></p>
          </div>
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
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">IP Address</th>
                <th className="px-6 py-4 font-semibold">Resource</th>
                <th className="px-6 py-4 font-semibold">Risk</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-white/5 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">JD</div>
                      <span className="text-sm font-medium">John Doe</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-mono">192.168.1.{100 + i}</td>
                  <td className="px-6 py-4 text-xs">Internal Database /Finance</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold">LOW</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-xs text-secondary">
                      <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                      Authorized
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
