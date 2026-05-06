import React from 'react';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, 
  Cpu, 
  BarChart, 
  RefreshCcw, 
  ShieldCheck,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

const pieData = [
  { name: 'Normal', value: 850, color: '#10b981' },
  { name: 'Anomalous', value: 120, color: '#f43f5e' },
  { name: 'Suspicious', value: 30, color: '#f59e0b' },
];

const barData = [
  { name: 'Mon', risk: 45, traffic: 120 },
  { name: 'Tue', risk: 32, traffic: 150 },
  { name: 'Wed', risk: 78, traffic: 180 },
  { name: 'Thu', risk: 55, traffic: 140 },
  { name: 'Fri', risk: 90, traffic: 210 },
  { name: 'Sat', risk: 25, traffic: 90 },
  { name: 'Sun', risk: 15, traffic: 70 },
];

const AiInsights = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold neon-text mb-2">AI Insights</h1>
          <p className="text-gray-500">Machine learning model performance and behavioral analytics</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/80 px-6 py-2 rounded-xl text-sm font-semibold transition-all shadow-glow">
          <RefreshCcw className="w-4 h-4" />
          Retrain Model
        </button>
      </div>

      {/* Model Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-secondary">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold">Model Accuracy</h3>
          </div>
          <p className="text-3xl font-bold text-white">98.4%</p>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-secondary" /> +0.2% from last version
          </p>
        </div>
        
        <div className="glass-card p-6 border-l-4 border-primary">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-semibold">Active Model</h3>
          </div>
          <p className="text-xl font-bold text-white">Isolation Forest v2.4</p>
          <p className="text-xs text-gray-500 mt-2">Contamination Rate: 0.1</p>
        </div>

        <div className="glass-card p-6 border-l-4 border-accent">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-semibold">False Positives</h3>
          </div>
          <p className="text-3xl font-bold text-white">1.2%</p>
          <p className="text-xs text-gray-500 mt-2">Target: &lt; 2.0%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Chart */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <BarChart className="w-5 h-5 text-primary" />
            Traffic Classification
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121214', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Trend Chart */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Weekly Anomaly Trend
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#121214', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="risk" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="traffic" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model Logs */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-6">Model Event Logs</h2>
        <div className="space-y-4">
          {[
            { time: '2026-05-06 11:20:05', event: 'Incremental Retraining Complete', status: 'SUCCESS' },
            { time: '2026-05-06 09:15:30', event: 'High Anomaly Cluster Detected', status: 'ALERT' },
            { time: '2026-05-06 04:00:00', event: 'Model Checkpoint Saved', status: 'INFO' },
          ].map((log, i) => (
            <div key={i} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-gray-500">{log.time}</span>
                <span className="text-sm font-medium">{log.event}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                log.status === 'SUCCESS' ? 'text-secondary bg-secondary/10' :
                log.status === 'ALERT' ? 'text-accent bg-accent/10' : 'text-primary bg-primary/10'
              }`}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiInsights;
