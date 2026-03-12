import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export function ErrorBanner({ message, onDismiss }) {
  return (
    <motion.div
      role="alert"
      className="flex items-center gap-3 p-4 rounded-lg border border-emergency-200 bg-emergency-50 text-emergency-800"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <AlertCircle className="w-5 h-5 shrink-0 text-emergency-600" />
      <p className="flex-1 text-body-sm">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-body-sm font-medium text-emergency-700 hover:text-emergency-800 touch-target px-2 -mx-2"
          aria-label="Dismiss"
        >
          Dismiss
        </button>
      )}
    </motion.div>
  );
}
