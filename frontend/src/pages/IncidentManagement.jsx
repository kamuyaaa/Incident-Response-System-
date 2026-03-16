import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/client';
import { INCIDENTS } from '../api/endpoints';
import { PageLayout } from '../components/layout/PageLayout';
import { Card } from '../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../components/incident/StatusBadge';
import { LoadingScreen } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import { ClipboardList } from 'lucide-react';

const stagger = { show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } };

export function IncidentManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    const load = () => {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (priorityFilter) params.set('priority', priorityFilter);
      api
        .get(`${INCIDENTS.list}?${params}`)
        .then((res) => setItems(res.data || []))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    };
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [statusFilter, priorityFilter]);

  if (loading) return <PageLayout title="Incident Management"><LoadingScreen /></PageLayout>;
  if (error) return <PageLayout title="Incident Management"><ErrorBanner message={error} onDismiss={() => setError(null)} /></PageLayout>;

  return (
    <PageLayout title="Incident Management" subtitle="Validate, prioritize, and assign incidents">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="ers-input w-auto min-w-[160px]"
          >
            <option value="">All statuses</option>
            <option value="reported">Reported</option>
            <option value="validated">Validated</option>
            <option value="escalated">Escalated</option>
            <option value="assigned">Assigned</option>
            <option value="en_route">En route</option>
            <option value="near_scene">Near scene</option>
            <option value="on_site">On site</option>
            <option value="resolving">Resolving</option>
            <option value="in_progress">In progress</option>
            <option value="resolved">Resolved</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="ers-input w-auto min-w-[120px]"
          >
            <option value="">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        {items.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No incidents match filters" description="Change filters or wait for new reports." />
        ) : (
          <motion.ul className="space-y-2" variants={stagger} initial="hidden" animate="show">
            {items.map((inc) => (
              <motion.li key={inc._id} variants={item}>
                <Link to={`/incidents/${inc._id}`}>
                  <Card className="p-4 sm:p-5 hover:bg-ers-subtle/80 transition-colors">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <span className="font-medium text-white">{inc.title}</span>
                      <div className="flex items-center gap-2">
                        <PriorityBadge priority={inc.priority} />
                        <StatusBadge status={inc.status} />
                      </div>
                    </div>
                    <p className="text-sm text-ers-inkSecondary mt-1">{inc.category} · {inc.reporterId?.name}</p>
                  </Card>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </PageLayout>
  );
}
