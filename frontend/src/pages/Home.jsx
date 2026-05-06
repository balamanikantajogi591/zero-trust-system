import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Zap, Eye, BarChart3, Database } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    { icon: <Shield className="w-6 h-6" />, title: "Zero Trust Architecture", desc: "Never trust, always verify every request regardless of origin." },
    { icon: <Zap className="w-6 h-6" />, title: "AI Threat Intelligence", desc: "Real-time anomaly detection powered by advanced ML models." },
    { icon: <Database className="w-6 h-6" />, title: "Data Protection", desc: "End-to-end encryption and immutable audit logging for all assets." },
    { icon: <Eye className="w-6 h-6" />, title: "Continuous Monitoring", desc: "24/7 telemetry and automated response to security incidents." }
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex justify-between items-center px-8 py-6 border-b border-white/5 backdrop-blur-md bg-black/20">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
          <span className="text-xl font-bold tracking-tighter">TRUST<span className="text-primary">WEB</span></span>
        </div>
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-primary text-black font-bold rounded hover:bg-primary/90 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"
          >
            Access SOC
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-20 pb-32 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 flex justify-center"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <img src={logo} alt="Trust Web Logo" className="relative w-32 h-32 md:w-48 md:h-48 object-contain" />
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight"
          >
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-white bg-[length:200%_auto] animate-gradient">Secure Web</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-light"
          >
            The next generation of AI-powered enterprise security. 
            Protecting your data with zero-trust intelligence and real-time threat detection.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6"
          >
            <button 
              onClick={() => navigate('/login')}
              className="w-full md:w-auto px-10 py-4 bg-primary text-black font-black text-lg rounded-lg hover:bg-primary/90 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(var(--primary-rgb),0.4)]"
            >
              Initialize System
            </button>
            <button className="w-full md:w-auto px-10 py-4 border border-white/20 text-white font-bold text-lg rounded-lg hover:bg-white/5 transition-all backdrop-blur-sm">
              View Documentation
            </button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass-panel p-8 group hover:border-primary/50 transition-all duration-500"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-500">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-40 border-t border-white/5 py-12 text-center text-gray-500 text-sm">
        <p>© 2026 TRUST WEB ENTERPRISE. All rights reserved. Secured by AI-X Intelligence.</p>
      </footer>
    </div>
  );
}
