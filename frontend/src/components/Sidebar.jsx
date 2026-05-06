import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShieldAlert, 
  BrainCircuit, 
  FileLock2, 
  History, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut 
} from 'lucide-react';

const Sidebar = ({ user }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Users', path: '/users', adminOnly: true },
    { icon: ShieldAlert, label: 'Threats', path: '/threats' },
    { icon: BrainCircuit, label: 'AI Insights', path: '/ai-insights' },
    { icon: FileLock2, label: 'Data Protection', path: '/dlp' },
    { icon: History, label: 'Audit Logs', path: '/logs' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const filteredItems = menuItems.filter(item => !item.adminOnly || user.role === 'ADMIN');

  return (
    <div className="w-64 h-screen bg-card border-r border-white/5 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6">
        <h1 className="text-xl font-bold flex items-center gap-2 text-primary">
          <ShieldAlert className="w-8 h-8" />
          <span className="tracking-tight">ZERO TRUST</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-primary/10 text-primary border-r-4 border-primary shadow-glow' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'}
            `}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5">
        <button 
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-accent hover:bg-accent/5 rounded-xl transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="font-medium text-sm">Logout Session</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
