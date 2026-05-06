import { useState } from 'react';
import { Shield, Key, Mail, User, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Settings() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setPasswordSuccess(true);
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-gray-400">Manage your Secure Web profile and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div whileHover={{ y: -5 }} className="md:col-span-1 space-y-4">
          <div className="glass-panel p-6 flex flex-col items-center text-center shadow-lg shadow-primary/5">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4 border border-primary/30">
              <User className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Admin User</h2>
            <p className="text-primary text-sm mt-1">ROLE_ADMIN</p>
          </div>
        </motion.div>

        <div className="md:col-span-2 space-y-6">
          <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 shadow-lg shadow-accent/5">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary" />
              Security Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/40 rounded border border-white/5 hover:border-white/20 transition-colors">
                <div>
                  <p className="font-semibold">Multi-Factor Authentication (MFA)</p>
                  <p className="text-sm text-gray-400">Adaptive MFA is currently active via ML Risk Scoring.</p>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm font-semibold border border-green-500/30">
                  Enabled
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 shadow-lg shadow-secondary/5">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Key className="w-5 h-5 mr-2 text-primary" />
              Access Credentials
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                <div className="flex">
                  <div className="bg-black/40 border border-white/10 rounded-l px-4 py-2 flex items-center justify-center text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input type="text" disabled value="admin@secureweb.local" className="flex-1 bg-black/40 border-y border-r border-white/10 rounded-r px-4 py-2 text-gray-300 focus:outline-none" />
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                {!showPasswordForm && !passwordSuccess ? (
                  <motion.button 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowPasswordForm(true)}
                    className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded hover:bg-primary hover:text-black transition-colors font-semibold"
                  >
                    Change Password
                  </motion.button>
                ) : passwordSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center space-x-2 text-green-400 bg-green-500/10 border border-green-500/20 p-3 rounded"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Password successfully updated!</span>
                  </motion.div>
                ) : (
                  <motion.form 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handlePasswordSubmit}
                    className="space-y-4 bg-black/40 p-4 rounded border border-white/10"
                  >
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Current Password</label>
                      <input type="password" required className="w-full bg-black/60 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">New Password</label>
                      <input type="password" required className="w-full bg-black/60 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-primary" />
                    </div>
                    <div className="flex space-x-3 pt-2">
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="px-4 py-2 bg-primary text-black rounded font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center min-w-[120px]"
                      >
                        {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : "Save"}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setShowPasswordForm(false)}
                        className="px-4 py-2 bg-transparent text-gray-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
