import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileLock2, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  Eye, 
  EyeOff,
  Database,
  Lock
} from 'lucide-react';

const dlpLogs = [
  { id: 1, user: 'bob.smith@corp.com', resource: 'Financial_Report_Q1.xlsx', pattern: 'Email/PII', action: 'MASKED', timestamp: '2026-05-06 11:45:12' },
  { id: 2, user: 'alice.jones@corp.com', resource: 'Customer_Export.csv', pattern: 'Phone/PII', action: 'BLOCKED', timestamp: '2026-05-06 10:22:05' },
  { id: 3, user: 'charlie.d@corp.com', resource: 'Project_Alpha_Spec.pdf', pattern: 'Gov ID', action: 'MASKED', timestamp: '2026-05-06 09:30:44' },
  { id: 4, user: 'diana.r@corp.com', resource: 'Employee_Payroll.json', pattern: 'SSN/PII', action: 'MASKED', timestamp: '2026-05-06 08:15:30' },
];

const DlpManagement = () => {
  const [showSensitive, setShowSensitive] = useState({});

  const toggleSensitive = (id) => {
    setShowSensitive(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold neon-text mb-2">Data Protection (DLP)</h1>
          <p className="text-gray-500">Autonomous sensitive data detection and masking</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-card px-4 py-2 flex items-center gap-2 text-sm text-secondary">
            <ShieldCheck className="w-4 h-4" />
            Active Inspection
          </div>
          <button className="bg-primary hover:bg-primary/80 px-6 py-2 rounded-xl text-sm font-semibold transition-all">
            DLP Settings
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Database className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Inspected Objects</p>
            <p className="text-2xl font-bold">12,482</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Masked Patterns</p>
            <p className="text-2xl font-bold">452</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Blocked Transfers</p>
            <p className="text-2xl font-bold">18</p>
          </div>
        </div>
      </div>

      {/* DLP Inspection Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Real-Time Pattern Inspection</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search DLP logs..." 
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-[10px] uppercase tracking-wider">
                <th className="px-6 py-4">User & Resource</th>
                <th className="px-6 py-4">Detected Pattern</th>
                <th className="px-6 py-4">Security Action</th>
                <th className="px-6 py-4">Data Preview</th>
                <th className="px-6 py-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {dlpLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-all group">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium">{log.user}</p>
                      <p className="text-xs text-gray-500 font-mono">{log.resource}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">
                      {log.pattern}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-xs font-bold ${log.action === 'MASKED' ? 'text-secondary' : 'text-accent'}`}>
                      {log.action === 'MASKED' ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <code className="text-xs font-mono text-gray-400">
                        {showSensitive[log.id] ? "john.doe@gmail.com" : "j****.d**@*****.com"}
                      </code>
                      <button 
                        onClick={() => toggleSensitive(log.id)}
                        className="text-gray-500 hover:text-white transition-colors"
                      >
                        {showSensitive[log.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-mono text-gray-500">{log.timestamp}</span>
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

export default DlpManagement;
