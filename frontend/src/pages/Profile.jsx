import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, LogOut, Calendar, Shield, Activity, Globe } from 'lucide-react';

const Profile = ({ user, onLogout }) => {
  const loginTime = new Date().toLocaleString();
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : (user?.email?.substring(0, 2) || '??').toUpperCase();

  const roleColors = {
    ADMIN: 'bg-accent/10 text-accent border-accent/20',
    ANALYST: 'bg-primary/10 text-primary border-primary/20',
    USER: 'bg-secondary/10 text-secondary border-secondary/20',
    VIEWER: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold neon-text mb-1">My Profile</h1>
      <p className="text-gray-500 text-sm">Account details and session information</p>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 relative overflow-hidden"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {user?.picture ? (
            <img src={user.picture} alt="avatar" className="w-20 h-20 rounded-2xl border-2 border-primary/30 object-cover shadow-[0_0_30px_rgba(59,130,246,0.3)]" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/40 to-primary/10 border-2 border-primary/30 flex items-center justify-center text-3xl font-bold text-primary shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              {initials}
            </div>
          )}
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold mb-1">{user?.name || 'Anonymous'}</h2>
            <p className="text-gray-400 text-sm mb-3">{user?.email}</p>
            <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold border ${roleColors[user?.role] || roleColors.USER}`}>
              {user?.role || 'USER'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" /> Account Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-500 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-600 uppercase">Email</p>
                <p className="text-sm font-medium">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-gray-500 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-600 uppercase">Access Role</p>
                <p className="text-sm font-medium">{user?.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-500 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-600 uppercase">Session Started</p>
                <p className="text-sm font-medium">{loginTime}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> Permissions
          </h3>
          <div className="space-y-3">
            {[
              { label: 'View Dashboard', granted: true },
              { label: 'Manage Users', granted: user?.role === 'ADMIN' },
              { label: 'View AI Insights', granted: ['ADMIN', 'ANALYST'].includes(user?.role) },
              { label: 'Data Protection', granted: true },
              { label: 'Export Reports', granted: ['ADMIN', 'ANALYST'].includes(user?.role) },
              { label: 'System Settings', granted: user?.role === 'ADMIN' },
            ].map((perm, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{perm.label}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${perm.granted ? 'bg-secondary/10 text-secondary' : 'bg-white/5 text-gray-600'}`}>
                  {perm.granted ? 'Granted' : 'Denied'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Token info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500 flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-primary" /> Active Token
        </h3>
        <div className="flex items-center gap-4">
          <code className="text-xs text-gray-500 bg-white/5 rounded-xl px-4 py-2 flex-1 truncate font-mono">
            {user?.token?.substring(0, 60)}...
          </code>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent hover:bg-accent/20 rounded-xl text-sm font-semibold transition-all border border-accent/20 shrink-0"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
