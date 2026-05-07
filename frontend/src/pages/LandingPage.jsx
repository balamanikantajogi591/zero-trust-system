import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Shield, Lock, Cpu, Globe, ArrowRight, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TiltCard = ({ icon: Icon, label, description }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors duration-300 group cursor-pointer"
    >
      <div 
        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
        style={{ transform: "translateZ(-20px)" }}
      />
      <div 
        className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-primary/20 transition-all duration-300"
        style={{ transform: "translateZ(50px)" }}
      >
        <Icon className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
      </div>
      <h3 
        className="text-lg font-bold text-white tracking-wider"
        style={{ transform: "translateZ(30px)" }}
      >
        {label}
      </h3>
      <p 
        className="text-sm text-gray-500 text-center"
        style={{ transform: "translateZ(20px)" }}
      >
        {description}
      </p>
    </motion.div>
  );
};

const MockTerminal = () => {
  const [logs, setLogs] = useState([]);
  const fullLogs = [
    { type: "info", text: "Initializing Security Protocol..." },
    { type: "success", text: "Connection Established via TLS 1.3" },
    { type: "info", text: "Scanning global node traffic..." },
    { type: "warning", text: "Anomaly detected in IP block 192.168.1.x" },
    { type: "success", text: "DLP Engine blocked unauthorized data exfiltration" },
    { type: "info", text: "Awaiting next event..." }
  ];

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < fullLogs.length) {
        setLogs(prev => [...prev, fullLogs[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="hidden lg:flex flex-col w-[450px] bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.15)] overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Live Monitor</span>
      </div>
      <div className="p-4 flex flex-col gap-3 font-mono text-xs h-[250px] overflow-hidden">
        {logs.map((log, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 items-start"
          >
            <span className="text-gray-600 mt-0.5">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
            {log.type === 'info' && <Activity className="w-4 h-4 text-primary shrink-0" />}
            {log.type === 'warning' && <AlertTriangle className="w-4 h-4 text-accent shrink-0" />}
            {log.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
            <span className={`
              ${log.type === 'info' ? 'text-gray-400' : ''}
              ${log.type === 'warning' ? 'text-accent' : ''}
              ${log.type === 'success' ? 'text-green-400' : ''}
            `}>
              {log.text}
            </span>
          </motion.div>
        ))}
        {logs.length < fullLogs.length && (
          <motion.div 
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="w-2 h-4 bg-primary ml-16"
          />
        )}
      </div>
    </motion.div>
  );
};

const MagneticButton = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    x.set(mouseX * 0.2);
    y.set(mouseY * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.button>
  );
};

const LandingPage = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <div 
      className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center"
      onMouseMove={handleMouseMove}
    >
      {/* Interactive Cursor Background */}
      <motion.div 
        className="pointer-events-none fixed inset-0 z-0 opacity-40 transition-opacity duration-300"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(circle 600px at ${x}px ${y}px, rgba(59, 130, 246, 0.15), transparent 80%)`
          )
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-24 flex flex-col">
        
        {/* Top Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 w-full">
          
          <div className="flex-1 flex flex-col items-start text-left">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-6 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                Enterprise Grade Protection
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent leading-[1.1]"
            >
              AI-POWERED <br />
              <span className="text-primary drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">SECURITY</span> & DATA
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="max-w-xl text-gray-400 text-lg md:text-xl mb-10 leading-relaxed font-light"
            >
              Defend your infrastructure with real-time anomaly detection, immutable audit logs, 
              and autonomous data leak prevention. The future of cybersecurity is actively monitoring.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
            >
              <Link to="/login" className="w-full sm:w-auto">
                <MagneticButton className="w-full sm:w-auto group relative px-8 py-4 bg-primary text-white rounded-2xl font-bold transition-all hover:bg-primary/90 shadow-[0_0_40px_rgba(59,130,246,0.4)] overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Enter Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                </MagneticButton>
              </Link>
              <MagneticButton className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl font-bold transition-all text-white backdrop-blur-sm">
                View Capabilities
              </MagneticButton>
            </motion.div>
          </div>

          <MockTerminal />

        </div>

        {/* 3D Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-32 w-full perspective-1000"
        >
          <TiltCard 
            icon={Shield} 
            label="Zero Trust" 
            description="Continuous verification of every user and device request." 
          />
          <TiltCard 
            icon={Cpu} 
            label="AI Engine" 
            description="Machine learning models that adapt to new threat vectors." 
          />
          <TiltCard 
            icon={Lock} 
            label="DLP Matrix" 
            description="Autonomous prevention of sensitive data exfiltration." 
          />
          <TiltCard 
            icon={Globe} 
            label="Global SOC" 
            description="Real-time geographic tracking of anomalies and attacks." 
          />
        </motion.div>

      </div>

      {/* Grid Overlay */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
    </div>
  );
};

export default LandingPage;
