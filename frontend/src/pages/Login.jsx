import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Lock, User, Activity } from 'lucide-react';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Mocking behavioral data for ML service
      const activityData = {
        username,
        password,
        hourOfDay: new Date().getHours(),
        downloadCount: Math.floor(Math.random() * 5),
        failedLogins: 0
      };

      // Since backend is not running, we'll simulate the successful response
      // In production: const res = await axios.post('http://localhost:8080/api/auth/login', activityData);
      
      const simulateAuth = true;
      if (simulateAuth) {
        setTimeout(() => {
          if (username === 'admin' && password === 'password') {
            localStorage.setItem('token', 'mock_jwt_token_123');
            navigate('/dashboard');
          } else {
            setError('Invalid credentials or access denied by Zero Trust Policy.');
          }
        }, 1000);
      }
    } catch (err) {
      setError('Login failed. Endpoint may be unreachable.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-md p-8 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-primary/10 rounded-full mb-4">
            <ShieldAlert className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider">ZERO TRUST</h1>
          <p className="text-sm text-gray-400 mt-1">Secure Authentication Gateway</p>
        </div>

        {error && (
          <div className="bg-secondary/20 border border-secondary/50 text-secondary px-4 py-3 rounded mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="Username"
              />
            </div>
          </div>
          
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="Password"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary text-black font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            AUTHENTICATE
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Protected by AI-Driven Anomaly Detection
          </p>
        </div>
      </motion.div>
    </div>
  );
}
