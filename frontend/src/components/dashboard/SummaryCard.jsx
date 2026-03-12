import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const variantStyles = {
  default: 'bg-ers-elevated border-ers-subtle',
  overdue: 'bg-amber-50 border-amber-200',
  open: 'bg-emergency-50 border-emergency-200',
};

export function SummaryCard({ label, count, variant = 'default', to, icon: Icon }) {
  const content = (
    <motion.div
      className={`surface-card-hover rounded-xl p-4 sm:p-5 border ${variantStyles[variant] || variantStyles.default}`}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-h2 font-bold text-ers-ink tabular-nums tracking-tight">{count}</p>
          <p className="text-body-sm text-ers-inkSecondary mt-1">{label}</p>
        </div>
        {Icon && <Icon className="w-6 h-6 text-ers-inkTertiary shrink-0 opacity-80" />}
      </div>
    </motion.div>
  );
  if (to) return <Link to={to} className="block">{content}</Link>;
  return content;
}
