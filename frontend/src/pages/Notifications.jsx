import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  ShieldAlert, 
  Info, 
  CheckCircle, 
  Clock, 
  Trash2, 
  CheckCheck,
  Smartphone
} from 'lucide-react';
import { eventApi } from '../services/api';

const Notifications = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventApi.getEvents();
      // Map security events to alert structure
      const mappedEvents = response.data.map(event => ({
        id: event.id,
        type: event.severity === 'CRITICAL' ? 'CRITICAL' : 
              event.severity === 'HIGH' ? 'WARNING' : 
              event.type === 'LOGIN' ? 'INFO' : 'SUCCESS',
        title: event.type.replace('_', ' '),
        message: event.message,
        time: new Date(event.timestamp).toLocaleTimeString(),
        read: event.status === 'RESOLVED',
        userId: event.userId
      }));
      setEvents(mappedEvents.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold neon-text mb-2">Security Alerts</h1>
          <p className="text-gray-500">Real-time notifications and system status updates</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-all px-4 py-2 rounded-xl hover:bg-white/5">
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
          <button className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-all px-4 py-2 rounded-xl hover:bg-accent/5">
            <Trash2 className="w-4 h-4" />
            Clear all
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {events.length > 0 ? events.map((alert) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={alert.id}
            className={`glass-card p-5 border-l-4 relative group transition-all hover:bg-white/5 ${
              alert.read ? 'opacity-70 border-gray-700' : 
              alert.type === 'CRITICAL' ? 'border-accent shadow-[0_0_15px_rgba(244,63,94,0.1)]' :
              alert.type === 'WARNING' ? 'border-orange-500' :
              alert.type === 'SUCCESS' ? 'border-secondary' : 'border-primary'
            }`}
          >
            <div className="flex gap-4">
              <div className={`p-3 rounded-xl h-fit ${
                alert.type === 'CRITICAL' ? 'bg-accent/10 text-accent' :
                alert.type === 'WARNING' ? 'bg-orange-500/10 text-orange-500' :
                alert.type === 'SUCCESS' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
              }`}>
                {alert.type === 'CRITICAL' ? <ShieldAlert className="w-6 h-6" /> : 
                 alert.type === 'WARNING' ? <Smartphone className="w-6 h-6" /> :
                 alert.type === 'SUCCESS' ? <CheckCircle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold ${alert.read ? 'text-gray-400' : 'text-white'}`}>
                    {alert.title} <span className="text-[10px] font-normal text-gray-500 ml-2">ID: {alert.userId}</span>
                  </h3>
                  <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alert.time}
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
                  {alert.message}
                </p>
                
                {!alert.read && (
                  <div className="mt-4 flex gap-3">
                    <button className="text-xs font-bold text-primary hover:underline">View Incident</button>
                    <button className="text-xs font-bold text-gray-500 hover:text-white">Dismiss</button>
                  </div>
                )}
              </div>
            </div>

            {!alert.read && (
              <span className="absolute top-4 right-4 w-2 h-2 bg-accent rounded-full"></span>
            )}
          </motion.div>
        )) : (
          <div className="text-center py-20 text-gray-600">
            {loading ? "Syncing with Zero Trust Engine..." : "No recent security events found."}
          </div>
        )}
      </div>

      <div className="pt-8 text-center">
        <button className="text-sm text-gray-600 hover:text-primary transition-all font-semibold">
          View Notification History
        </button>
      </div>
    </div>
  );
};

export default Notifications;
