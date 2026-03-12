import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-emergency-600 hover:bg-emergency-700 text-white shadow-ers-card hover:shadow-ers-glow',
  secondary: 'bg-ers-surface border border-ers-subtle text-ers-ink hover:bg-ers-subtle/80',
  outline: 'bg-transparent border-2 border-ers-subtle text-ers-ink hover:border-ers-inkSecondary hover:bg-ers-subtle/50',
  ghost: 'bg-transparent hover:bg-ers-subtle/80 text-ers-inkSecondary hover:text-ers-ink',
  danger: 'bg-emergency-700 hover:bg-emergency-800 text-white',
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
