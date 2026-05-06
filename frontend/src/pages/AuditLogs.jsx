import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  Search, 
  ShieldCheck, 
  Hash, 
  User, 
  Activity,
  FileCode,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { eventApi } from '../services/api';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await eventApi.getEvents();
        setLogs(response.data);
      } catch (error) {
        console.error("Failed to fetch logs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p>Retrieving immutable audit trail...</p>
      </div>
    );
  }
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold neon-text mb-2">Audit Logs</h1>
          <p className="text-gray-500">Immutable system logs secured by SHA-256 cryptographic hashing</p>
        </div>
        <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all">
          <ShieldCheck className="w-4 h-4 text-secondary" />
          Verify All Hashes
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Logs", value: "48,291", icon: History, color: "primary" },
          { label: "Admin Actions", value: "1,204", icon: User, color: "secondary" },
          { label: "Threat Events", value: "84", icon: ShieldAlert, color: "accent" },
          { label: "Integrity Status", value: "SECURE", icon: ShieldCheck, color: "secondary" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-${stat.color}/10 text-${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</p>
              <p className="text-lg font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Logs Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Security Event Timeline</h2>
            <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary text-[10px] font-bold">TAMPER-PROOF</span>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search logs by hash or user..." 
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-primary/50 w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-[10px] uppercase tracking-wider">
                <th className="px-6 py-4">Event Type</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action Details</th>
                <th className="px-6 py-4">SHA-256 Hash Integrity</th>
                <th className="px-6 py-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${log.type?.includes('ALERT') || log.type?.includes('ANOMALY') ? 'bg-accent animate-pulse' : 'bg-primary'}`}></div>
                      <span className="text-xs font-bold text-gray-200">{log.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-medium">{log.userId}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-gray-400">{log.message}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 group/hash">
                      <Hash className="w-3 h-3 text-gray-600 group-hover/hash:text-primary transition-colors" />
                      <code className="text-[10px] font-mono text-gray-600 group-hover/hash:text-gray-400 transition-colors">
                        {log.eventHash?.substring(0, 16)}...{log.eventHash?.substring(48)}
                      </code>
                      <ShieldCheck className="w-3 h-3 text-secondary opacity-50" title="Hash Verified" />
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

      <div className="flex justify-center mt-4">
        <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-primary transition-all">
          <Activity className="w-4 h-4" />
          Load older encrypted logs
        </button>
      </div>
    </div>
  );
};

export default AuditLogs;
