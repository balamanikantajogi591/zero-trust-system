import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, Smartphone } from 'lucide-react';
import { authApi } from '../services/api';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [step, setStep] = useState('login'); // login, register, mfa
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleToggle = () => {
    setStep(step === 'login' ? 'register' : 'login');
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authApi.login({ email, password });
      if (response.data.mfaRequired || true) { // Force MFA step for Zero Trust demo
        setStep('mfa'); 
      }
      setError('');
    } catch (err) {
      setError('Invalid credentials or access denied by Zero Trust policy.');
    }
  };

  const handleMfa = async (e) => {
    e.preventDefault();
    try {
      // For demo purposes, we accept 123456 but in production this would verify via backend
      if (otp === '123456') {
        const isAdmin = email === 'balamanikantajogi591@gmail.com';
        onLoginSuccess({ role: isAdmin ? 'ADMIN' : 'USER', email });
      } else {
        setError('Invalid MFA code.');
      }
    } catch (err) {
      setError('MFA Verification failed.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Zero Trust Access</h1>
          <p className="text-gray-500 text-sm">Identity & Device Verification Required</p>
        </div>

        {error && (
          <div className="bg-accent/10 border border-accent/20 text-accent text-xs p-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {step === 'mfa' ? (
          <form onSubmit={handleMfa} className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-400">A security code has been sent to your registered device.</p>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase ml-1">MFA Code</label>
              <div className="relative mt-1">
                <Smartphone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-center tracking-[1em] font-mono focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="000000"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/80 py-3 rounded-xl font-bold transition-all mt-4"
            >
              Confirm Access
            </button>
            <button 
              type="button"
              onClick={() => setStep('login')}
              className="w-full text-xs text-gray-500 hover:text-white transition-all mt-2"
            >
              Back to Login
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={handleLogin} className="space-y-4">
              {step === 'register' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase ml-1">First Name</label>
                    <input 
                      type="text" 
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all mt-1"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Last Name</label>
                    <input 
                      type="text" 
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all mt-1"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Corporate Email</label>
                <div className="relative mt-1">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Password</label>
                <div className="relative mt-1">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/80 py-3 rounded-xl font-bold transition-all mt-4 shadow-glow"
              >
                {step === 'login' ? 'Verify Identity' : 'Create Account'}
              </button>
            </form>

            <div className="relative my-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <span className="relative bg-card px-4 text-xs text-gray-500 uppercase font-bold">Or continue with</span>
            </div>

            <button className="w-full bg-white text-black hover:bg-gray-200 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google Workspace
            </button>

            <p className="text-center mt-6 text-sm text-gray-500">
              {step === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={handleToggle}
                className="text-primary hover:underline ml-2 font-semibold"
              >
                {step === 'login' ? 'Register Now' : 'Log In'}
              </button>
            </p>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
            Protected by AI Anomaly Detection
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
