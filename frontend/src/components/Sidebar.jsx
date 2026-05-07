import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, ShieldAlert, BrainCircuit,
  FileLock2, History, BarChart3, Bell, Settings, LogOut, Menu, X, User
} from 'lucide-react';

const Sidebar = ({ user, collapsed, onToggle }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Users', path: '/users', adminOnly: true },
    { icon: ShieldAlert, label: 'Threats', path: '/threats' },
    { icon: BrainCircuit, label: 'AI Insights', path: '/ai-insights' },
    { icon: FileLock2, label: 'Data Protection', path: '/dlp' },
    { icon: History, label: 'Audit Logs', path: '/logs' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || user?.role === 'ADMIN');


  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-screen z-50 flex flex-col
        bg-card border-r border-white/5
        transition-all duration-300 ease-in-out
        ${collapsed ? '-translate-x-full lg:translate-x-0 lg:w-[72px]' : 'translate-x-0 w-64'}
      `}>
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-white/5 h-16">
          {!collapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <ShieldAlert className="w-7 h-7 text-primary shrink-0" />
              <span className="text-sm font-bold tracking-tight text-primary truncate">ADVANCED SECURITY</span>
            </div>
          )}
          {collapsed && <ShieldAlert className="w-7 h-7 text-primary mx-auto" />}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                ${isActive
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
              {collapsed && (
                <span className="absolute left-full ml-3 px-2 py-1 bg-card border border-white/10 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-3 border-t border-white/5 space-y-1">
          <NavLink to="/profile" className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`
          }>
            <div className="w-5 h-5 shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-3 h-3 text-primary" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">{user?.name || user?.email?.split('@')[0] || 'User'}</p>
                <p className="text-[10px] text-gray-600 truncate">{user?.role}</p>
              </div>
            )}
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-gray-400 hover:text-accent hover:bg-accent/5 rounded-xl transition-all group"
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:rotate-12 transition-transform" />
            {!collapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
