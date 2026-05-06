import { motion } from 'framer-motion';
import Loader from './Loader';

export default function Button({ 
  children, 
  onClick, 
  type = 'button', 
  loading = false, 
  disabled = false,
  variant = 'primary',
  className = ''
}) {
  const variants = {
    primary: 'bg-primary text-black shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)]',
    secondary: 'bg-white/5 text-white border border-white/10 hover:bg-white/10',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center overflow-hidden
        ${variants[variant]}
        ${(disabled || loading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {loading ? (
        <Loader size="sm" color={variant === 'primary' ? 'black' : 'white'} />
      ) : (
        children
      )}
      
      {/* Glossy overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
    </motion.button>
  );
}
