import { motion } from 'framer-motion';

export function Skeleton({ className = '', ...props }) {
  return (
    <motion.div
      className={`rounded-xl bg-ers-subtle/80 animate-pulse ${className}`}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1.2, repeatType: 'reverse' }}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="surface-card p-5 space-y-4">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
