import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, RefreshCw, Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/data/audits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleExport = () => {
    setExporting(true);
    // Simulate generation of CSV report
    setTimeout(() => {
      setExporting(false);
      // In a real app we would trigger a file download here
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Users className="w-8 h-8 mr-3 text-primary" />
            Compliance Audit Logs
          </h1>
          <p className="text-gray-400">Cryptographically verifiable log of all system actions.</p>
        </div>
        <div className="flex space-x-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : ''}`} />
            <span>Refresh</span>
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            disabled={exporting || loading || logs.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-accent/20 text-accent hover:bg-accent/30 border border-accent/30 rounded transition-colors"
          >
            {exporting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{exporting ? 'Generating CSV...' : 'Export CSV'}</span>
          </motion.button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center">
          <Search className="w-5 h-5 text-gray-500 mr-3" />
          <input 
            type="text" 
            placeholder="Search logs by action or user..." 
            className="bg-transparent border-none focus:outline-none w-full text-white"
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/40 border-b border-white/5 text-gray-400 text-sm">
                <th className="p-4 font-semibold">Timestamp</th>
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Action</th>
                <th className="p-4 font-semibold">Details</th>
                <th className="p-4 font-semibold">SHA-256 Hash</th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {logs.map((log) => (
                <motion.tr 
                  variants={itemVariants}
                  key={log.id} 
                  className="border-b border-white/5 hover:bg-white/10 transition-colors cursor-default"
                >
                  <td className="p-4 text-sm text-gray-300">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 text-sm font-semibold text-primary flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-gray-500" />
                    {log.username}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-accent/20 text-accent border border-accent/30 rounded text-xs">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-400">{log.details}</td>
                  <td className="p-4 font-mono text-xs text-gray-500 truncate max-w-[150px]" title={log.hash}>
                    {log.hash}
                  </td>
                </motion.tr>
              ))}
              {logs.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No audit logs found or insufficient permissions.
                  </td>
                </tr>
              )}
            </motion.tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
