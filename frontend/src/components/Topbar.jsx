import React from 'react';
import { Search, User, Bell } from 'lucide-react';

const Topbar = ({ user }) => {
  return (
    <div className="h-16 bg-card/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40 ml-64">
      <div className="relative w-96">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input 
          type="text" 
          placeholder="Search security events, users, or threats..." 
          className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer">
          <Bell className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full border-2 border-card"></span>
        </div>
        
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right">
            <p className="text-xs font-semibold">{user.role} Portal</p>
            <p className="text-[10px] text-gray-500">{user.role === 'ADMIN' ? 'Full Access' : 'Read Only'}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
