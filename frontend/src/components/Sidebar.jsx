import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { 
  Activity,
  Users, 
  AlertTriangle, 
  BrainCircuit, 
  Database, 
  Shield,
  BarChart3, 
  Bell, 
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'User Management', path: '/users', icon: Users },
    { name: 'Threat Detection', path: '/threats', icon: AlertTriangle },
    { name: 'AI Insights', path: '/insights', icon: BrainCircuit },
    { name: 'Data Protection', path: '/data-access', icon: Database },
    { name: 'Audit Logs', path: '/audit-logs', icon: Shield },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 min-h-screen bg-[#1a1a24] border-r border-white/5 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center space-x-3 mb-2 border-b border-white/5 bg-background/50 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => navigate('/')}>
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-wider">SECURE<span className="text-primary">WEB</span></h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Enterprise Security</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar py-4 px-3">
        <nav className="space-y-1.5 relative">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors relative group ${
                  isActive ? 'text-primary' : 'text-gray-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarTab"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-primary' : 'text-gray-500 group-hover:text-gray-300'}`} />
                <span className="relative z-10 text-sm font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="bg-green-500/10 border border-green-500/20 rounded p-3 flex flex-col items-center justify-center text-center">
          <div className="flex items-center space-x-2 mb-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-green-400 uppercase tracking-wider">System Online</span>
          </div>
          <span className="text-[10px] text-gray-500 font-mono">v2.4.0-prod</span>
        </div>
      </div>
    </div>
  );
}
