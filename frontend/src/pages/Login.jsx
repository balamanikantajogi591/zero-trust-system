import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { setAuthState } from '../utils/auth';
import { authService } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [riskScore, setRiskScore] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  // Debounced risk score check
  useEffect(() => {
    if (formData.email.includes('@') && formData.email.includes('.')) {
      const timer = setTimeout(async () => {
        try {
          const res = await axios.get(`/api/auth/risk-score?email=${formData.email}`);
          setRiskScore(res.data);
        } catch (err) {
          console.error("Risk score check failed");
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setRiskScore(null);
    }
  }, [formData.email]);

  const validate = () => {
    if (!formData.email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) return "Invalid email format";
    if (!formData.password) return "Password is required";
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const valError = validate();
    if (valError) {
      setError(valError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await authService.login(formData.email, formData.password);
      setAuthState(data.token, data.role, data.email);
      
      const from = location.state?.from?.pathname || (data.role === 'ROLE_ADMIN' ? '/dashboard' : '/dashboard');
      navigate(from, { replace: true });
    } catch (err) {
      setError("Invalid credentials");
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050505] font-sans">
      {/* Animated Background Particles (Simplified) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: Math.random() 
            }}
            animate={{ 
              y: [null, "-100%"],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        ))}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px]"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md px-6 relative z-10"
      >
        <div className="glass-panel p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-8">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4"
            >
              <Shield className="text-primary" size={32} />
            </motion.div>
            <h1 className="text-3xl font-black tracking-tighter text-white">
              SECURE<span className="text-primary">WEB</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Zero Trust Gateway</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center text-red-400 text-sm font-medium"
              >
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-1">
            <InputField
              label="Email Address"
              type="email"
              name="email"
              icon={Mail}
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <div className="relative">
              <InputField
                label="Security Key (Password)"
                type={showPassword ? "text" : "password"}
                name="password"
                icon={Lock}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between py-2 mb-4">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <div className={`
                  w-4 h-4 rounded border flex items-center justify-center transition-all
                  ${rememberMe ? 'bg-primary border-primary' : 'border-white/20 bg-black/40 group-hover:border-primary/50'}
                `} onClick={() => setRememberMe(!rememberMe)}>
                  {rememberMe && <CheckCircle2 size={12} className="text-black" />}
                </div>
                <span className="text-xs text-gray-400 font-medium">Remember Device</span>
              </label>
              <button type="button" className="text-xs text-primary hover:underline font-bold">
                Recovery Access?
              </button>
            </div>

            <Button 
              type="submit" 
              loading={loading}
              className="mt-6"
            >
              Authorize Access
            </Button>
          </form>

          {/* Bonus: Login Risk Score Display */}
          <AnimatePresence>
            {riskScore && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-white/5"
              >
                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-black mb-2">
                  <span className="text-gray-500">Security Context</span>
                  <span className={riskScore.trustLevel === 'Low' ? 'text-green-400' : 'text-red-400'}>
                    Risk: {riskScore.riskScore}%
                  </span>
                </div>
                <div className="flex items-center space-x-3 bg-white/5 p-2 rounded-lg border border-white/5">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${riskScore.trustLevel === 'Low' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-[11px] text-gray-400">
                    {riskScore.recommendation} — Using AI-Intelligence
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-600 mb-4 uppercase tracking-[0.2em] font-bold">Secure Federation</p>
            <div className="flex justify-center space-x-4">
              {['Google', 'Github', 'Okta'].map(provider => (
                <button 
                  key={provider}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-primary/30 transition-all text-[10px] font-bold text-gray-400 hover:text-white"
                  title={`Sign in with ${provider}`}
                  type="button"
                >
                  {provider[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <p className="text-center mt-8 text-gray-600 text-[10px] uppercase tracking-widest font-bold">
          Protected by AES-256 & Neural Guard • v4.2.0
        </p>
      </motion.div>
    </div>
  );
}
