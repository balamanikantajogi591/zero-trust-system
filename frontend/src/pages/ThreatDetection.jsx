import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  AlertTriangle, 
  Eye, 
  CheckCircle, 
  XCircle,
  Activity,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { eventApi } from '../services/api';

const SeverityBadge = ({ severity }) => {
  const colors = {
    CRITICAL: 'bg-accent/10 text-accent border-accent/20',
    HIGH: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    MEDIUM: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    LOW: 'bg-secondary/10 text-secondary border-secondary/20',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${colors[severity] || colors.LOW}`}>
      {severity}
    </span>
  );
};

const ThreatDetection = () => {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedThreat, setSelectedThreat] = useState(null);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const response = await eventApi.getEvents();
        // Filter for anomalous/critical threats for this view
        const filtered = response.data.filter(e => e.severity === 'CRITICAL' || e.severity === 'HIGH');
        setThreats(filtered);
      } catch (error) {
        console.error("Failed to fetch threats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchThreats();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 min-h-[400px]">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p>Analyzing network for anomalies...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold neon-text mb-2">Threat Detection</h1>
          <p className="text-gray-500">Intelligent anomaly detection and incident response</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Filter by user or ID..." 
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50"
            />
          </div>
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm hover:bg-white/10 transition-all">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Threat List */}
        <div className="lg:col-span-3 space-y-4">
          {threats.length > 0 ? (
            threats.map((threat) => (
              <motion.div 
                layoutId={threat.id}
                key={threat.id}
                onClick={() => setSelectedThreat(threat)}
                className={`glass-card p-4 flex items-center gap-6 cursor-pointer transition-all hover:neon-border ${selectedThreat?.id === threat.id ? 'neon-border' : ''}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  threat.severity === 'CRITICAL' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                }`}>
                  <ShieldAlert className="w-6 h-6" />
                </div>
                
                <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Threat ID</p>
                    <p className="text-sm font-mono">{threat.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Category</p>
                    <p className="text-sm font-semibold">{threat.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">User ID</p>
                    <p className="text-sm">{threat.userId}</p>
                  </div>
                  <div className="text-right">
                    <SeverityBadge severity={threat.severity} />
                  </div>
                </div>

                <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 font-bold mb-1">RISK</p>
                    <p className={`text-lg font-bold ${threat.riskScore > 80 ? 'text-accent' : 'text-primary'}`}>
                      {threat.riskScore}
                    </p>
                  </div>
                  <button className="p-2 hover:bg-primary/10 text-gray-400 hover:text-primary rounded-lg transition-all">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="glass-card p-12 text-center text-gray-500">
              <ShieldCheck className="w-12 h-12 text-secondary mx-auto mb-4 opacity-50" />
              <p>No active threats detected. System is secure.</p>
            </div>
          )}
        </div>

        {/* Selected Threat Detail View */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedThreat ? (
              <motion.div 
                key={selectedThreat.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card p-6 h-full sticky top-24"
              >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Incident Details
                </h2>
                
                <div className="space-y-6">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-xs text-gray-500 mb-2 uppercase font-bold">ML Risk Analysis</p>
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-bold text-accent">{selectedThreat.riskScore}%</span>
                      <span className="text-xs text-accent mb-2 font-semibold">Anomalous</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Status</span>
                      <span className="font-semibold text-primary">{selectedThreat.status}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Timestamp</span>
                      <span className="font-mono text-[10px] mt-1">{selectedThreat.timestamp}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Origin IP</span>
                      <span className="font-mono text-xs">192.168.4.122</span>
                    </div>
                  </div>

                  <div className="pt-6 space-y-3">
                    <button className="w-full py-3 bg-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent/80 transition-all">
                      <XCircle className="w-4 h-4" />
                      Block User
                    </button>
                    <button className="w-full py-3 bg-secondary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/80 transition-all">
                      <CheckCircle className="w-4 h-4" />
                      Mark Resolved
                    </button>
                    <button className="w-full py-3 bg-white/5 text-gray-400 rounded-xl font-bold hover:bg-white/10 transition-all">
                      Ignore Alert
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-8 h-full flex flex-col items-center justify-center text-center">
                <AlertTriangle className="w-12 h-12 text-gray-700 mb-4" />
                <p className="text-gray-500 text-sm">Select an incident from the list to view detailed threat analysis and take action.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ThreatDetection;
