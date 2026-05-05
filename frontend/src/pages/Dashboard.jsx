import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Activity, Users, AlertTriangle, LogOut, Database } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { time: '10:00', risk: 10 },
  { time: '10:05', risk: 12 },
  { time: '10:10', risk: 8 },
  { time: '10:15', risk: 45 },
  { time: '10:20', risk: 15 },
  { time: '10:25', risk: 85 },
  { time: '10:30', risk: 20 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [sensitiveData, setSensitiveData] = useState([]);

  useEffect(() => {
    // Check auth
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }

    // Mock fetching DLP masked data
    setTimeout(() => {
      setSensitiveData([
        "Customer 1: SSN ***-**-****, Email ***@***.***",
        "Customer 2: Phone ***-***-****, Email ***@***.***"
      ]);
    }, 1000);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="flex justify-between items-center mb-8 glass-panel p-4">
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold">Threat Intelligence Center</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 border-l-4 border-l-primary">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Active Sessions</p>
              <h3 className="text-3xl font-bold mt-2">1,204</h3>
            </div>
            <Users className="w-8 h-8 text-primary/50" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 border-l-4 border-l-accent">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Avg Risk Score</p>
              <h3 className="text-3xl font-bold mt-2">14.2</h3>
            </div>
            <Activity className="w-8 h-8 text-accent/50" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 border-l-4 border-l-secondary">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Threats Blocked</p>
              <h3 className="text-3xl font-bold mt-2 text-secondary">89</h3>
            </div>
            <AlertTriangle className="w-8 h-8 text-secondary/50" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-primary" />
            Live Anomaly Risk Timeline
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#12121a', borderColor: '#333' }}
                  itemStyle={{ color: '#00f0ff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="risk" 
                  stroke="#00f0ff" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#00f0ff' }}
                  activeDot={{ r: 6, fill: '#ff003c' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2 text-accent" />
            DLP Masked Access Log
          </h2>
          <div className="space-y-4">
            {sensitiveData.length > 0 ? (
              sensitiveData.map((data, idx) => (
                <div key={idx} className="bg-black/40 p-3 rounded border border-white/5 text-sm font-mono text-gray-300">
                  {data}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Loading secure data...</p>
            )}
            <div className="mt-4 p-3 bg-secondary/10 border border-secondary/30 rounded text-xs text-secondary flex items-start">
              <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
              <p>Sensitive data masked automatically by DLP policies. Hash validated.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
