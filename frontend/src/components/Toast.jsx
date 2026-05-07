import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const colors = {
  success: 'border-green-500 text-green-400 bg-green-500/10',
  warning: 'border-yellow-500 text-yellow-400 bg-yellow-500/10',
  error: 'border-accent text-accent bg-accent/10',
  info: 'border-primary text-primary bg-primary/10',
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ message, type = 'info', title }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, title }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 max-w-sm w-full">
        <AnimatePresence>
          {toasts.map(t => {
            const Icon = icons[t.type] || Info;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 80 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`glass-card p-4 border-l-4 flex items-start gap-3 shadow-2xl ${colors[t.type]}`}
              >
                <Icon className="w-5 h-5 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  {t.title && <p className="font-bold text-sm text-white mb-0.5">{t.title}</p>}
                  <p className="text-xs text-gray-300 leading-relaxed">{t.message}</p>
                </div>
                <button onClick={() => dismiss(t.id)} className="text-gray-500 hover:text-white transition-colors shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
