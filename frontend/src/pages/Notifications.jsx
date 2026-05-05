import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Check, Trash2, ShieldAlert, Info, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    // Real app would call backend to mark all read
  };

  const getIcon = (severity) => {
    switch(severity) {
      case 'High': return <ShieldAlert className="w-6 h-6 text-red-500" />;
      case 'Medium': return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      default: return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Bell className="w-8 h-8 mr-3 text-primary" />
            Alert Center
          </h1>
          <p className="text-gray-400">System notifications and real-time security alerts.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center px-4 py-2 bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors text-sm"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark all as read
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-white/5 rounded-lg"></div>)}
          </div>
        ) : notifications.length === 0 ? (
          <div className="glass-panel p-12 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>You have no notifications.</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {notifications.map((notif, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={notif.id}
                className={`p-4 rounded-lg border mb-4 flex items-start transition-colors ${
                  notif.read ? 'bg-black/20 border-white/5' : 'bg-black/60 border-primary/30 shadow-lg shadow-primary/5'
                }`}
              >
                <div className="mr-4 mt-1">
                  {getIcon(notif.severity)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold ${notif.read ? 'text-gray-300' : 'text-white'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {notif.timestamp}
                    </span>
                  </div>
                  <p className={`text-sm ${notif.read ? 'text-gray-500' : 'text-gray-300'}`}>
                    {notif.message}
                  </p>
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  {!notif.read && (
                    <button 
                      onClick={() => markAsRead(notif.id)}
                      className="p-1.5 text-primary hover:bg-primary/20 rounded transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
