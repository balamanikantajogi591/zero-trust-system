import React from 'react';
import { Search, User, Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ user, onLogout, onMenuToggle }) => {
  const navigate = useNavigate();

  return (
    <div className="h-16 bg-card/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* Hamburger toggle */}
        <button
          onClick={onMenuToggle}
          className="p-2 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-48 md:w-80 lg:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search events, users, threats..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <button className="relative cursor-pointer p-1" onClick={() => navigate('/notifications')}>
          <Bell className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full border-2 border-card animate-pulse" />
        </button>

        <div
          className="flex items-center gap-3 pl-4 border-l border-white/10 cursor-pointer group"
          onClick={() => navigate('/profile')}
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold group-hover:text-primary transition-colors">
              {user.name || user.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-[10px] text-gray-500">{user.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center hover:border-primary/60 transition-all overflow-hidden">
            {user.picture ? (
              <img src={user.picture} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-primary" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
