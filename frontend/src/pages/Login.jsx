import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, Smartphone } from 'lucide-react';
import { authApi } from '../services/api';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

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

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  const decoded = jwtDecode(credentialResponse.credential);
                  const isAdmin = decoded.email === 'balamanikantajogi591@gmail.com';
                  onLoginSuccess({ 
                    role: isAdmin ? 'ADMIN' : 'USER', 
                    email: decoded.email,
                    name: decoded.name,
                    picture: decoded.picture 
                  });
                }}
                onError={() => {
                  setError('Google Authentication Failed');
                }}
                theme="filled_black"
                shape="pill"
              />
            </div>

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
