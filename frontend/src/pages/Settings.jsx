import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Cpu, 
  Database,
  Globe,
  Save,
  Smartphone
} from 'lucide-react';

const Settings = () => {
  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold neon-text mb-2">System Settings</h1>
          <p className="text-gray-500">Manage security policies, model parameters, and account security</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/80 px-8 py-3 rounded-2xl font-bold transition-all shadow-glow">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Tabs (Vertical) */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { icon: User, label: 'Account Profile', active: true },
            { icon: Lock, label: 'Privacy & Security' },
            { icon: Shield, label: 'Access Control' },
            { icon: Cpu, label: 'AI Model Config' },
            { icon: Bell, label: 'Notification Rules' },
            { icon: Database, label: 'DLP Policies' },
            { icon: Globe, label: 'Network Whitelist' },
          ].map((tab, i) => (
            <button 
              key={i}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                tab.active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-semibold text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Section */}
          <section className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 border-b border-white/5 pb-4">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-primary/50 outline-none" defaultValue="Mani" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-primary/50 outline-none" defaultValue="047" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Work Email</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-primary/50 outline-none" defaultValue="balamanikantajogi591@gmail.com" />
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 border-b border-white/5 pb-4">
              <Shield className="w-5 h-5 text-primary" />
              Advanced Security Policies
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Multi-Factor Authentication (MFA)</p>
                  <p className="text-xs text-gray-500">Require OTP for every new session</p>
                </div>
                <div className="w-12 h-6 bg-secondary/20 rounded-full relative cursor-pointer border border-secondary/30">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-secondary rounded-full shadow-glow"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Device Fingerprinting</p>
                  <p className="text-xs text-gray-500">Lock access to verified hardware only</p>
                </div>
                <div className="w-12 h-6 bg-primary/20 rounded-full relative cursor-pointer border border-primary/30">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-primary rounded-full shadow-glow"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">AI Anomaly Auto-Block</p>
                  <p className="text-xs text-gray-500">Automatically block users with Risk Score &gt; 90</p>
                </div>
                <div className="w-12 h-6 bg-white/5 rounded-full relative cursor-pointer border border-white/10">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </section>

          {/* AI Config */}
          <section className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 border-b border-white/5 pb-4">
              <Cpu className="w-5 h-5 text-primary" />
              Model Sensitivity
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
                <span>Conservative</span>
                <span>Aggressive</span>
              </div>
              <input type="range" className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary" min="0" max="100" defaultValue="45" />
              <p className="text-xs text-gray-500 italic">Current Sensitivity: 45% (Balanced)</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
