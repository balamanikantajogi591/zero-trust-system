import { motion } from 'framer-motion';

export default function InputField({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  error, 
  placeholder,
  icon: Icon
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full bg-black/40 border rounded-lg py-2.5 transition-all outline-none font-medium
            ${Icon ? 'pl-10 pr-4' : 'px-4'}
            ${error 
              ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]' 
              : 'border-white/10 focus:border-primary/50 focus:shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]'
            }
            placeholder:text-gray-600 text-white
          `}
        />
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 mt-1.5 ml-1"
          >
            {error}
          </motion.p>
        )}
      </div>
    </div>
  );
}
