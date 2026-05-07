import React, { useState, useEffect } from 'react';
import { Shield, Wifi, Lock, Clock, Server } from 'lucide-react';

const SecurityStatus = () => {
  const [ping, setPing] = useState(null);
  const [time, setTime] = useState(new Date());
  const [serverOk, setServerOk] = useState(true);

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000);

    const checkServer = async () => {
      const start = Date.now();
      try {
        await fetch('/api/v1/health', { method: 'GET', signal: AbortSignal.timeout(3000) });
        setPing(Date.now() - start);
        setServerOk(true);
      } catch {
        setPing(null);
        setServerOk(false);
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 30000);

    return () => { clearInterval(tick); clearInterval(interval); };
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
      {/* Secure Connection */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest">
        <Lock className="w-3 h-3" />
        TLS 1.3 Encrypted
      </div>

      {/* Server Status */}
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest ${
        serverOk
          ? 'bg-secondary/10 border-secondary/20 text-secondary'
          : 'bg-accent/10 border-accent/20 text-accent'
      }`}>
        <Server className="w-3 h-3" />
        <span className={`w-1.5 h-1.5 rounded-full ${serverOk ? 'bg-secondary animate-pulse' : 'bg-accent'}`} />
        {serverOk ? `${ping ?? '...'}ms` : 'Offline'}
      </div>

      {/* Time */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-500 text-[10px] font-mono">
        <Clock className="w-3 h-3" />
        {time.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default SecurityStatus;
