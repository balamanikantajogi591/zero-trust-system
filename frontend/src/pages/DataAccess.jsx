import { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, Lock, Unlock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DataAccess() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/data/sensitive', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Database className="w-8 h-8 mr-3 text-primary" />
          Data Access Control
        </h1>
        <p className="text-gray-400">Interact with the DLP (Data Loss Prevention) Engine.</p>
      </div>

      <div className="glass-panel p-6 mb-6">
        <div className="flex items-start justify-between mb-6 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Customer Records</h2>
            <p className="text-sm text-gray-400">
              This data is automatically processed by the DLP engine before being delivered to your client.
              If you lack the <code className="bg-white/10 px-1 rounded text-primary">ROLE_ANALYST</code> permission, sensitive fields will be masked.
            </p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-black/40 p-3 rounded-lg border border-white/10 flex items-center flex-shrink-0"
          >
            <Lock className="w-5 h-5 text-accent mr-2" />
            <span className="text-sm font-semibold text-accent">DLP Active</span>
          </motion.div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-white/5 rounded"></div>
            <div className="h-10 bg-white/5 rounded"></div>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4 font-mono text-sm"
          >
            {data.map((row, idx) => {
              const isMasked = row.includes('***');
              return (
                <motion.div 
                  key={idx} 
                  variants={itemVariants}
                  whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
                  className="bg-black/60 p-4 rounded border border-white/5 flex items-center justify-between text-gray-300 transition-colors cursor-default"
                >
                  <span>{row}</span>
                  {isMasked ? (
                    <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                      <Lock className="w-4 h-4 text-secondary ml-4 flex-shrink-0" title="Masked" />
                    </motion.div>
                  ) : (
                    <motion.div whileHover={{ scale: 1.2, rotate: -10 }}>
                      <Unlock className="w-4 h-4 text-green-500 ml-4 flex-shrink-0" title="Raw Data" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
