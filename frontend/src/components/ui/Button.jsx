import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-md',
  secondary: 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900',
  outline: 'bg-transparent border-2 border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
  amber: 'bg-amber-600 hover:bg-amber-700 text-white font-semibold',
  teal: 'bg-teal-600 hover:bg-teal-700 text-white',
};

const sizes = {
  md: 'min-h-[44px] px-5 py-3 rounded-lg text-btn gap-2',
  sm: 'min-h-[36px] px-3 py-2 rounded-md text-body-sm font-medium gap-1.5',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled,
  className = '',
  ...props
}) {
  const sizeClass = sizes[size] ?? sizes.md;
  const variantClass = variants[variant] ?? variants.primary;
  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      whileHover={disabled ? undefined : { transition: { duration: 0.15 } }}
      className={`inline-flex items-center justify-center font-sans transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-target ${sizeClass} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
