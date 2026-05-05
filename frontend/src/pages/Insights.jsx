import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrainCircuit, Activity, CheckCircle, AlertOctagon, Cpu } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

export default function Insights() {
  const [stats, setStats] = useState(null);
  const [distribution, setDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const token = localStorage.getItem('token');
        const [statsRes, distRes] = await Promise.all([
          axios.get('/api/ml/stats', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/ml/distribution', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setStats(statsRes.data);
        setDistribution(distRes.data);
      } catch (err) {
        console.error("Failed to fetch ML insights", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const handleRetrain = async () => {
    setRetraining(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/ml/train-model', {}, { headers: { Authorization: `Bearer ${token}` } });
      setTimeout(() => setRetraining(false), 3000); // Simulate some time
    } catch (err) {
      console.error(err);
      setRetraining(false);
    }
  };

  const COLORS = ['#3b82f6', '#eab308', '#f97316', '#ef4444'];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <BrainCircuit className="w-8 h-8 mr-3 text-accent" />
            AI ML Insights
          </h1>
          <p className="text-gray-400">View model performance, accuracy metrics, and risk distributions.</p>
        </div>
        <button 
          onClick={handleRetrain}
          disabled={retraining}
          className="flex items-center space-x-2 px-4 py-2 bg-accent/20 text-accent hover:bg-accent/30 border border-accent/30 rounded font-semibold transition-colors"
        >
          {retraining ? <Cpu className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
          <span>{retraining ? 'Retraining...' : 'Trigger Model Retrain'}</span>
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-4 gap-4"><div className="h-24 bg-white/5 rounded"></div><div className="h-24 bg-white/5 rounded"></div><div className="h-24 bg-white/5 rounded"></div><div className="h-24 bg-white/5 rounded"></div></div>
          <div className="h-96 bg-white/5 rounded"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 flex flex-col justify-center items-center text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
              <h3 className="text-3xl font-bold text-white">{stats?.accuracy}%</h3>
              <p className="text-sm text-gray-400">Model Accuracy</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 flex flex-col justify-center items-center text-center">
              <AlertOctagon className="w-8 h-8 text-yellow-500 mb-2" />
              <h3 className="text-3xl font-bold text-white">{stats?.falsePositives}%</h3>
              <p className="text-sm text-gray-400">False Positive Rate</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 flex flex-col justify-center items-center text-center">
              <Activity className="w-8 h-8 text-primary mb-2" />
              <h3 className="text-3xl font-bold text-white">{(stats?.totalAnalyzed / 1000).toFixed(1)}k</h3>
              <p className="text-sm text-gray-400">Total Events Analyzed</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-6 flex flex-col justify-center items-center text-center border-b-4 border-accent">
              <BrainCircuit className="w-8 h-8 text-accent mb-2" />
              <h3 className="text-3xl font-bold text-accent">{stats?.anomaliesDetected}</h3>
              <p className="text-sm text-gray-400">Anomalies Detected</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6">
              <h2 className="text-lg font-bold mb-6 text-white text-center">Risk Score Distribution</h2>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="glass-panel p-6 flex flex-col justify-center bg-gradient-to-br from-black/60 to-accent/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Cpu className="w-64 h-64 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4 relative z-10">Adaptive AI Engine v2.0</h2>
              <p className="text-gray-400 mb-6 relative z-10 leading-relaxed">
                The core anomaly detection engine utilizes an ensemble of Isolation Forests and deep autoencoders to establish a baseline of "normal" behavior for every user and entity. 
              </p>
              <div className="space-y-4 relative z-10">
                <div className="bg-black/50 p-4 rounded-lg border border-white/10">
                  <span className="text-accent font-bold">Last Trained:</span> <span className="text-gray-300">24 hours ago</span>
                </div>
                <div className="bg-black/50 p-4 rounded-lg border border-white/10">
                  <span className="text-accent font-bold">Current Dataset Size:</span> <span className="text-gray-300">45GB (Rolling 30-day window)</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
