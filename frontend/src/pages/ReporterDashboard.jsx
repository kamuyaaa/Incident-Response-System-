import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { DASHBOARD } from '../api/endpoints';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { StatusBadge, PriorityBadge } from '../components/incident/StatusBadge';
import { LoadingScreen } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import { AlertCircle, ClipboardList, ChevronRight, MapPin } from 'lucide-react';

const stagger = { show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export function ReporterDashboard() {
  const { user, hasAnyRole } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get(DASHBOARD)
      .then((res) => { if (!cancelled) setSummary(res.data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    const t = setInterval(() => api.get(DASHBOARD).then((r) => setSummary(r.data)).catch(() => {}), 20000);
    return () => { cancelled = true; clearInterval(t); };
  }, []);

  if (loading) {
    return (
      <PageLayout title="Dashboard">
        <LoadingScreen message="Loading…" />
      </PageLayout>
    );
  }
  if (error) {
    return (
      <PageLayout title="Dashboard">
        <ErrorBanner message={error} onDismiss={() => setError(null)} />
      </PageLayout>
    );
  }

  const recentIncidents = summary?.recentIncidents || [];

  return (
    <PageLayout title="Dashboard">
      <motion.div
        className="max-w-2xl mx-auto pb-8"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.section variants={item} className="mb-6 sm:mb-8">
          <p className="text-caption font-medium text-ers-inkTertiary mb-0.5">Welcome back</p>
          <h1 className="text-h1 text-ers-ink tracking-tight">{user?.name}</h1>
        </motion.section>

        <motion.section variants={item} className="mb-6 sm:mb-8">
          <Link to="/report" className="block">
            <motion.div
              className="rounded-xl surface-card overflow-hidden border border-ers-subtle hover:border-emergency-500/40 transition-colors"
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
            >
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
                <div className="rounded-xl bg-emergency-50 p-3.5 shrink-0">
                  <AlertCircle className="w-10 h-10 text-emergency-600" aria-hidden />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-h3 text-ers-ink mb-0.5">Report emergency</h2>
                  <p className="text-body-sm text-ers-inkSecondary">
                    Send location and details. Help is dispatched quickly.
                  </p>
                </div>
                <Button className="w-full sm:w-auto min-h-[44px] px-5 shrink-0">
                  Report now
                </Button>
              </div>
            </motion.div>
          </Link>
        </motion.section>

        <motion.section variants={item}>
          <h2 className="flex items-center gap-2 text-h4 text-ers-ink mb-3">
            <ClipboardList className="w-5 h-5 text-ers-inkTertiary" />
            My reports
          </h2>
          {recentIncidents.length === 0 ? (
            <div className="rounded-xl surface-card p-6 sm:p-8">
              <EmptyState
                icon={ClipboardList}
                title="No reports yet"
                description="When you report an emergency, it will appear here. You can track status and responder ETA."
                action={
                  hasAnyRole('REPORTER', 'ADMIN') && (
                    <Link to="/report">
                      <Button>Report emergency</Button>
                    </Link>
                  )
                }
              />
            </div>
          ) : (
            <ul className="space-y-2">
              {recentIncidents.slice(0, 10).map((inc) => (
                <motion.li key={inc._id} variants={item}>
                  <Link to={`/incidents/${inc._id}`}>
                    <motion.div
                      className="rounded-xl surface-card p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:bg-ers-subtle/80 transition-colors touch-target min-h-[72px]"
                      whileHover={{ x: 2 }}
                    >
                      <div className="rounded-lg bg-ers-subtle/80 border border-ers-subtle p-2 shrink-0">
                        <MapPin className="w-4 h-4 text-teal-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-ers-ink truncate">{inc.title}</p>
                        <p className="text-body-sm text-ers-inkSecondary mt-0.5">
                          {inc.category} · {inc.reporterId?.name || inc.guestReporter?.name || 'Guest'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <PriorityBadge priority={inc.priority} />
                        <StatusBadge status={inc.status} />
                        <ChevronRight className="w-5 h-5 text-ers-inkTertiary" />
                      </div>
                    </motion.div>
                  </Link>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.section>
      </motion.div>
    </PageLayout>
  );
}
