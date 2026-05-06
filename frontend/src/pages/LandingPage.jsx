import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Cpu, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center text-center p-6">
      {/* Dynamic Background Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/10 blur-[150px] rounded-full"
      />

      {/* Floating Welcome Message */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-6"
      >
        <motion.span 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold tracking-widest uppercase mb-4 shadow-glow"
        >
          Welcome to Secure Web
        </motion.span>
      </motion.div>

      {/* Hero Content */}
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent"
      >
        AI-POWERED <br />
        <span className="text-primary">ZERO TRUST</span> SECURITY
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-2xl text-gray-400 text-lg md:text-xl mb-12 leading-relaxed"
      >
        Defend your enterprise with real-time anomaly detection, immutable audit logs, 
        and autonomous data leak prevention. The future of cybersecurity is here.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-6 z-10"
      >
        <Link to="/login">
          <button className="group relative px-8 py-4 bg-primary text-white rounded-2xl font-bold transition-all hover:scale-105 shadow-glow overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </Link>
        <button className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl font-bold transition-all text-white backdrop-blur-sm">
          Platform Overview
        </button>
      </motion.div>

      {/* Feature Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 w-full max-w-5xl"
      >
        {[
          { icon: Shield, label: "Zero Trust" },
          { icon: Cpu, label: "AI Engine" },
          { icon: Lock, label: "DLP" },
          { icon: Globe, label: "Global SOC" },
        ].map((feature, i) => (
          <div key={i} className="flex flex-col items-center gap-3 group cursor-default">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-300">
              <feature.icon className="w-6 h-6 text-gray-500 group-hover:text-primary transition-colors" />
            </div>
            <span className="text-xs font-semibold text-gray-500 group-hover:text-gray-300 transition-colors uppercase tracking-widest">{feature.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none"></div>
    </div>
  );
};

export default LandingPage;
