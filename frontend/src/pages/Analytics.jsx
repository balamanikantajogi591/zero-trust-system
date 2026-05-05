import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, Map } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { motion } from 'framer-motion';

export default function Analytics() {
  const [trends, setTrends] = useState([]);
  const [geo, setGeo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const [trendsRes, geoRes] = await Promise.all([
          axios.get('/api/analytics/attack-trends', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/analytics/geo-distribution', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setTrends(trendsRes.data);
        setGeo(geoRes.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-secondary" />
            Security Analytics & Reports
          </h1>
          <p className="text-gray-400">Long-term attack trends and geographical distribution.</p>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-6">
          <div className="h-96 bg-white/5 rounded-lg"></div>
          <div className="h-96 bg-white/5 rounded-lg"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-6 text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-secondary" />
              Attack Vectors Over Time (6 Months)
            </h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBrute" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAnomalous" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDlp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="bruteForce" name="Brute Force Attempts" stroke="#ef4444" fillOpacity={1} fill="url(#colorBrute)" />
                  <Area type="monotone" dataKey="anomalousLogin" name="Anomalous Logins" stroke="#f97316" fillOpacity={1} fill="url(#colorAnomalous)" />
                  <Area type="monotone" dataKey="dlpTriggers" name="DLP Violations" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDlp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-6 text-white flex items-center">
              <Map className="w-5 h-5 mr-2 text-primary" />
              Geographical Threat Distribution
            </h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={geo} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="country" stroke="#888" />
                  <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#ef4444" />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="logins" name="Valid Logins" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="threats" name="Blocked Threats" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
