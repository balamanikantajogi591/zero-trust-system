import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Lock, User, Activity, Mail } from 'lucide-react';
import axios from 'axios';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || '';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const activityData = {
        username,
        password,
        hourOfDay: new Date().getHours(),
        downloadCount: Math.floor(Math.random() * 5),
        failedLogins: 0
      };

      const res = await axios.post(`${apiUrl}/api/auth/login`, activityData);
      
      if (res.status === 200 && res.data.token) {
        localStorage.setItem('token', res.data.token);
        if (res.data.mfaRequired) {
          alert("High Risk Detected! MFA would trigger here. Risk Score: " + res.data.riskScore);
        }
        navigate('/dashboard');
      } else {
        setError('Invalid credentials or access denied by Zero Trust Policy.');
      }
    } catch (err) {
      setError(err.response?.data || 'Login failed. Endpoint may be unreachable.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/api/auth/register`, {
        username,
        email,
        password
      });

      if (res.status === 200) {
        setSuccess('Registration successful! Please login.');
        setIsLogin(true); // Switch back to login
      }
    } catch (err) {
      setError(err.response?.data || 'Registration failed.');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    // Simulated Google Auth flow
    try {
      // In a real app, this would be an ID token returned from the Google OAuth popup
      const mockGoogleData = {
        token: "mock-google-id-token-123",
        email: "demo.user@gmail.com",
        name: "Demo User",
        hourOfDay: new Date().getHours(),
        downloadCount: 0,
        failedLogins: 0
      };

      const res = await axios.post(`${apiUrl}/api/auth/google-login`, mockGoogleData);

      if (res.status === 200 && res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Google Sign-In failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-md p-8 relative z-10"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-primary/10 rounded-full mb-4">
            <ShieldAlert className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider">ZERO TRUST</h1>
          <p className="text-sm text-gray-400 mt-1">Secure Authentication Gateway</p>
        </div>

        {/* Toggle between Login and Register */}
        <div className="flex bg-black/40 rounded-lg p-1 mb-6">
          <button 
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${isLogin ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white'}`}
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
          >
            LOGIN
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${!isLogin ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white'}`}
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
          >
            REGISTER
          </button>
        </div>

        {error && (
          <div className="bg-secondary/20 border border-secondary/50 text-secondary px-4 py-3 rounded mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded mb-6 flex items-center">
            <span className="text-sm">{success}</span>
          </div>
        )}

        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
          <div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="Username"
                required
              />
            </div>
          </div>
          
          {!isLogin && (
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="Email"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="Password"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="Confirm Password"
                  required
                />
              </div>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-primary text-black font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(0,240,255,0.3)] mt-2"
          >
            {isLogin ? 'AUTHENTICATE' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="grow border-t border-white/10"></div>
          <span className="mx-4 text-xs text-gray-500">OR</span>
          <div className="grow border-t border-white/10"></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          type="button"
          className="w-full bg-white text-black font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Protected by AI-Driven Anomaly Detection
          </p>
        </div>
      </motion.div>
    </div>
  );
}
