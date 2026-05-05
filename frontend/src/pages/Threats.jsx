import { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, ShieldAlert, Crosshair, Filter, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Threats() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/threats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setThreats(res.data);
      } catch (err) {
        console.error("Failed to fetch threats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchThreats();
  }, []);

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'Low': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <AlertTriangle className="w-8 h-8 mr-3 text-red-500" />
            Threat Detection Engine
          </h1>
          <p className="text-gray-400">Review and triage AI-identified security anomalies.</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-colors text-sm">
          <Filter className="w-4 h-4" />
          <span>Filter Threats</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-white/5 rounded-lg"></div>
              ))}
            </div>
          ) : (
            threats.map((threat, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={threat.id} 
                className="glass-panel p-5 flex flex-col sm:flex-row sm:items-center justify-between group hover:bg-white/5 transition-colors cursor-pointer border-l-4"
                style={{ borderLeftColor: threat.severity === 'Critical' ? '#ef4444' : threat.severity === 'High' ? '#f97316' : threat.severity === 'Medium' ? '#eab308' : '#3b82f6' }}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${getSeverityColor(threat.severity)} uppercase tracking-wider`}>
                      {threat.severity}
                    </span>
                    <span className="text-gray-400 text-sm">{new Date(threat.date).toLocaleString()}</span>
                    <span className="text-xs text-gray-500 font-mono">{threat.id}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{threat.details}</h3>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="mr-4">User Target: <span className="text-primary font-medium">{threat.user}</span></span>
                    <span className="flex items-center">
                      <Crosshair className="w-3 h-3 mr-1 text-accent" />
                      Risk Score: <span className="text-accent font-bold ml-1">{threat.riskScore}/100</span>
                    </span>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 pl-4 border-t sm:border-t-0 sm:border-l border-white/10 flex items-center justify-center">
                  <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-5">
            <h3 className="font-bold text-white mb-4 flex items-center">
              <ShieldAlert className="w-5 h-5 mr-2 text-primary" />
              Triage Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Unresolved</span>
                <span className="text-red-400 font-bold bg-red-500/10 px-2 rounded">12</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Investigating</span>
                <span className="text-yellow-400 font-bold bg-yellow-500/10 px-2 rounded">5</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Resolved Today</span>
                <span className="text-green-400 font-bold bg-green-500/10 px-2 rounded">48</span>
              </div>
            </div>
            <button className="w-full mt-6 py-2 bg-primary/20 text-primary border border-primary/30 rounded font-semibold hover:bg-primary hover:text-black transition-colors text-sm">
              Generate Threat Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
