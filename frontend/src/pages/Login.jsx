import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Lock, Mail, Fingerprint, Activity, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      if (isRegister) {
        await axios.post('/api/auth/register', { username: email.split('@')[0], email, password });
        setIsRegister(false);
        setError('Registration successful! Please login.');
      } else {
        const res = await axios.post('/api/auth/login', { username: email.split('@')[0], email, password });
        localStorage.setItem('token', res.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      // Simulate Google Login
      const res = await axios.post('/api/auth/google-login', { 
        email: 'user@gmail.com', 
        hourOfDay: new Date().getHours(),
        downloadCount: 0,
        failedLogins: 0
      });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Google authentication failed');
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
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wider">SECURE<span className="text-primary">WEB</span></h1>
          <p className="text-gray-400 text-sm mt-1">{isRegister ? 'Create your enterprise account' : 'Enterprise Security Operations'}</p>
        </div>

        <div className="flex bg-black/40 p-1 rounded-lg mb-6 border border-white/5">
          <button 
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${!isRegister ? 'bg-primary text-black' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${isRegister ? 'bg-primary text-black' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className={`p-3 rounded mb-6 text-sm text-center border ${error.includes('successful') ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-red-500/10 border-red-500/50 text-red-500'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
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

          {isRegister && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded px-10 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          {!isRegister && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-400 cursor-pointer">
                <input type="checkbox" className="mr-2 rounded border-white/10 bg-black/40 text-primary focus:ring-primary focus:ring-offset-background" />
                Remember me
              </label>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-black font-bold rounded hover:bg-primary/90 transition-colors flex justify-center items-center shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
          >
            {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : (isRegister ? 'Create Account' : 'Secure Login')}
          </button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1a1a24] px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2.5 bg-white/5 border border-white/10 text-white font-medium rounded hover:bg-white/10 transition-colors flex justify-center items-center space-x-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Google Intelligence</span>
          </button>
          
          <div className="text-center mt-6 text-sm text-gray-500">
            {isRegister ? "Already have an account?" : "Need enterprise access?"}{' '}
            <button 
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-primary hover:text-primary/80 font-bold transition-colors"
            >
              {isRegister ? 'Sign In' : 'Request Credentials'}
            </button>
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
