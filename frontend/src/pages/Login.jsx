import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Lock, Mail, Fingerprint, Activity, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fingerprint, setFingerprint] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate capturing device fingerprint
    setFingerprint({
      os: navigator.platform,
      browser: navigator.userAgent.split(' ')[0],
      ip: "192.168.1.105",
      riskScore: "Low (12/100)"
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/login', { username: email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20 backdrop-blur-sm overflow-hidden p-2">
            <img src={logo} alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_5px_rgba(var(--primary-rgb),0.3)]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wider">SECURE<span className="text-primary">WEB</span></h1>
          <p className="text-gray-400 text-sm mt-1">Enterprise Security Operations</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email or Username</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                required
                className="w-full bg-black/40 border border-white/10 rounded px-10 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-black/40 border border-white/10 rounded px-10 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-400 cursor-pointer">
              <input type="checkbox" className="mr-2 rounded border-white/10 bg-black/40 text-primary focus:ring-primary focus:ring-offset-background" />
              Remember me
            </label>
            <a href="#" className="text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-black font-bold rounded hover:bg-primary/90 transition-colors flex justify-center items-center"
          >
            {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : 'Secure Login'}
          </button>
          
          <div className="text-center mt-4 text-sm text-gray-400">
            Don't have an account? <a href="#" className="text-primary hover:text-primary/80 font-semibold transition-colors">Request Access</a>
          </div>
        </form>

        {fingerprint && (
          <div className="mt-8 pt-6 border-t border-white/5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
              <Fingerprint className="w-4 h-4 mr-2" /> Device Fingerprint
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-black/40 p-2 rounded border border-white/5">
                <span className="text-gray-500 block mb-0.5">OS / Browser</span>
                <span className="text-gray-300">{fingerprint.os}</span>
              </div>
              <div className="bg-black/40 p-2 rounded border border-white/5">
                <span className="text-gray-500 block mb-0.5">IP Address</span>
                <span className="text-gray-300 font-mono">{fingerprint.ip}</span>
              </div>
              <div className="bg-black/40 p-2 rounded border border-white/5 col-span-2 flex justify-between items-center">
                <div>
                  <span className="text-gray-500 block mb-0.5">Initial ML Risk Score</span>
                  <span className="text-green-400 font-bold">{fingerprint.riskScore}</span>
                </div>
                <Activity className="w-4 h-4 text-green-500/50" />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
