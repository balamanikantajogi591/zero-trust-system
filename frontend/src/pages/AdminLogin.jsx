import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Mail, Lock, Eye, EyeOff, 
  Loader2, AlertTriangle, ChevronRight, Fingerprint
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CyberBackground from '../components/CyberBackground';
import SecurityStatus from '../components/SecurityStatus';
import { authApi } from '../services/api';

/* ─── Typing animation hook ─── */
const useTyping = (texts, speed = 80, pause = 2000) => {
  const [display, setDisplay] = useState('');
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[idx];
    const delay = deleting ? speed / 2 : charIdx === current.length ? pause : speed;

    const timer = setTimeout(() => {
      if (!deleting && charIdx < current.length) {
        setDisplay(current.slice(0, charIdx + 1));
        setCharIdx(c => c + 1);
      } else if (!deleting && charIdx === current.length) {
        setDeleting(true);
      } else if (deleting && charIdx > 0) {
        setDisplay(current.slice(0, charIdx - 1));
        setCharIdx(c => c - 1);
      } else {
        setDeleting(false);
        setIdx(i => (i + 1) % texts.length);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [charIdx, deleting, idx, texts, speed, pause]);

  return display;
};

/* ─── Shield pulse component ─── */
const CyberShield = () => (
  <div className="relative flex items-center justify-center w-20 h-20 mx-auto mb-6">
    <motion.div
      animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
    />
    <motion.div
      animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.3, 0.15] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      className="absolute inset-[-8px] rounded-full bg-primary/10 blur-2xl"
    />
    <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/5 border border-primary/40 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)]">
      <ShieldCheck className="w-9 h-9 text-primary" />
    </div>
  </div>
);

/* ─── Input field component ─── */
const InputField = ({ icon: Icon, label, type, value, onChange, rightEl, id }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
      <Icon className="w-3 h-3" />
      {label}
    </label>
    <div className="relative group">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={type === 'email' ? 'email' : 'current-password'}
        required
        className="
          w-full bg-white/[0.04] border border-white/10 rounded-xl
          px-4 py-3.5 text-sm text-white placeholder-gray-600
          focus:outline-none focus:border-primary/60 focus:bg-white/[0.07]
          focus:shadow-[0_0_20px_rgba(59,130,246,0.15)]
          transition-all duration-300 pr-12
        "
        placeholder={type === 'email' ? 'admin@company.com' : '••••••••••••'}
      />
      {rightEl && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightEl}
        </div>
      )}
    </div>
  </div>
);

/* ─── Main AdminLogin ─── */
const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const typedText = useTyping([
    'AI-Powered Zero Trust Security',
    'Threat Intelligence Dashboard',
    'Advanced Data Protection',
    'Real-Time SOC Operations',
  ]);

  // Pre-fill from remember me
  useEffect(() => {
    const saved = localStorage.getItem('remember_admin');
    if (saved) setEmail(saved);
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.adminLogin({ email, password });
      const { token, role, username, email: respEmail } = response.data;

      if (role !== 'ADMIN') {
        setError('Access Restricted: Admins Only. Your account does not have admin privileges.');
        triggerShake();
        setLoading(false);
        return;
      }

      const userData = {
        role,
        email: respEmail || email,
        name: username || email.split('@')[0],
        token,
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      if (rememberMe) {
        localStorage.setItem('remember_admin', email);
      } else {
        localStorage.removeItem('remember_admin');
      }

      onLoginSuccess(userData);
      navigate('/dashboard');

    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || '';
      if (err.response?.status === 403 || String(msg).toLowerCase().includes('admin')) {
        setError('Access Restricted: Admins Only.');
      } else if (err.response?.status === 401) {
        setError('Invalid credentials. Please verify your email and password.');
      } else {
        setError('Authentication service unavailable. Please try again.');
      }
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      <CyberBackground />

      {/* Corner decorations */}
      <div className="fixed top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/20 pointer-events-none" />
      <div className="fixed top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-primary/20 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-primary/20 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-primary/20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <motion.div
          animate={shake ? { x: [-10, 10, -8, 8, -5, 5, 0] } : { x: 0 }}
          transition={{ duration: 0.5 }}
          className="
            bg-white/[0.03] backdrop-blur-2xl border border-white/10
            rounded-3xl p-8 shadow-[0_0_80px_rgba(0,0,0,0.6),0_0_40px_rgba(59,130,246,0.05)]
          "
        >
          {/* Shield + Branding */}
          <div className="text-center mb-8">
            <CyberShield />

            <h1 className="text-2xl font-extrabold tracking-tighter text-white mb-1">
              Admin Portal
            </h1>
            <div className="text-primary text-xs font-mono h-5">
              {typedText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="ml-0.5 inline-block w-[2px] h-3 bg-primary align-middle"
              />
            </div>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 overflow-hidden"
              >
                <div className="flex items-start gap-3 bg-accent/10 border border-accent/30 rounded-xl p-3.5 text-accent text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              id="admin-email"
              icon={Mail}
              label="Administrator Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <InputField
              id="admin-password"
              icon={Lock}
              label="Secure Passphrase"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              rightEl={
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="text-gray-600 hover:text-gray-300 transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border transition-all ${
                    rememberMe ? 'bg-primary border-primary' : 'border-white/20 bg-white/5'
                  }`}>
                    {rememberMe && (
                      <svg className="w-3 h-3 text-white m-auto" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-gray-500 group-hover:text-gray-300 transition-colors">Remember device</span>
              </label>
              <button
                type="button"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Forgot passphrase?
              </button>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="
                relative w-full py-3.5 rounded-xl font-bold text-white
                bg-gradient-to-r from-primary via-blue-500 to-primary
                bg-[length:200%_auto] hover:bg-right-top
                transition-all duration-500
                shadow-[0_0_30px_rgba(59,130,246,0.35)]
                hover:shadow-[0_0_50px_rgba(59,130,246,0.55)]
                disabled:opacity-60 disabled:cursor-not-allowed
                overflow-hidden group
              "
            >
              <span className="relative z-10 flex items-center justify-center gap-2.5">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying Identity...
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-5 h-5" />
                    Authenticate
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[10px] text-gray-700 uppercase tracking-widest">Admin Access Only</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Security Status */}
          <SecurityStatus />

          {/* Footer */}
          <p className="text-center text-[10px] text-gray-700 mt-5 uppercase tracking-[0.15em]">
            AI-Powered Zero Trust · Secured by BCrypt + JWT
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
