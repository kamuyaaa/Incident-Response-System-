import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/client';
import { DASHBOARD, ASSIGNMENTS, INCIDENTS } from '../api/endpoints';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { StatusBadge, PriorityBadge } from '../components/incident/StatusBadge';
import { IncidentMap } from '../components/map/IncidentMap';
import { LoadingScreen } from '../components/ui/LoadingSpinner';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import { EmptyState } from '../components/ui/EmptyState';
import {
  ListTodo,
  MapPin,
  ArrowRight,
  Clock,
  CheckCircle,
  Navigation,
  Flag,
  XCircle,
} from 'lucide-react';

const stagger = { show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

function QuickAction({ assignment, incident, onStatus, updating }) {
  const status = assignment?.status;
  if (!status || status === 'completed' || status === 'declined') return null;

  const handle = (e, newStatus, incidentStatus) => {
    e.preventDefault();
    e.stopPropagation();
    onStatus(assignment._id, newStatus, incidentStatus);
  };
  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (status === 'pending') {
    return (
      <div className="flex gap-2 mt-3" onClick={stop}>
        <Button
          className="!py-2 !px-3 text-sm min-h-[44px] flex-1 sm:flex-none"
          onClick={(e) => handle(e, 'accepted')}
          disabled={updating}
        >
          <CheckCircle className="w-4 h-4 sm:mr-1.5" />
          Accept
        </Button>
        <Button
          variant="secondary"
          className="!py-2 !px-3 text-sm min-h-[44px]"
          onClick={(e) => handle(e, 'declined')}
          disabled={updating}
        >
          <XCircle className="w-4 h-4" />
        </Button>
      </div>
    );
  }
  if (status === 'accepted') {
    return (
      <Button
        className="!py-2.5 !px-4 text-sm w-full min-h-[44px] mt-3"
        onClick={(e) => { handle(e, 'en_route', 'in_progress'); }}
        disabled={updating}
      >
        <Navigation className="w-4 h-4 mr-2" />
        En route
      </Button>
    );
  }
  if (status === 'en_route') {
    return (
      <Button
        className="!py-2.5 !px-4 text-sm w-full min-h-[44px] mt-3"
        onClick={(e) => { handle(e, 'on_site'); }}
        disabled={updating}
      >
        <MapPin className="w-4 h-4 mr-2" />
        On site
      </Button>
    );
  }
  if (status === 'on_site') {
    return (
      <Button
        className="!py-2.5 !px-4 text-sm w-full min-h-[44px] mt-3"
        onClick={(e) => { handle(e, 'completed', 'resolved'); }}
        disabled={updating}
      >
        <Flag className="w-4 h-4 mr-2" />
        Resolved
      </Button>
    );
  }
  return null;
}

export function ResponderDashboard() {
  const [summary, setSummary] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState(false);

  function load() {
    const params = statusFilter ? `?status=${statusFilter}` : '';
    Promise.all([api.get(DASHBOARD), api.get(`${ASSIGNMENTS.my}${params}`)])
      .then(([dashRes, assignRes]) => {
        setSummary(dashRes.data);
        setAssignments(assignRes.data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [statusFilter]);

  useEffect(() => {
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [statusFilter]);

  const handleStatusChange = async (assignmentId, status, incidentStatus) => {
    setUpdating(true);
    try {
      await api.patch(ASSIGNMENTS.status(assignmentId), { status });
      const a = assignments.find((x) => x._id === assignmentId);
      const incId = a?.incidentId?._id || a?.incidentId;
      if (incidentStatus && incId) await api.patch(INCIDENTS.update(incId), { status: incidentStatus });
      load();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  if (loading && !assignments.length) {
    return (
      <PageLayout title="Dashboard">
        <LoadingScreen message="Loading…" />
      </PageLayout>
    );
  }

  const counts = summary?.assignmentCountsByStatus || {};
  const pending = counts.pending || 0;
  const active = (counts.accepted || 0) + (counts.en_route || 0) + (counts.on_site || 0);
  const completed = counts.completed || 0;

  const activeForMap = assignments
    .filter((a) => a.incidentId?.location?.coordinates?.length === 2 && !['completed', 'declined'].includes(a.status))
    .map((a) => a.incidentId);
  const mapCenter = activeForMap[0]
    ? { lat: activeForMap[0].location.coordinates[1], lng: activeForMap[0].location.coordinates[0] }
    : { lat: 40.7, lng: -74 };

  return (
    <PageLayout title="Assignments" subtitle="Your assigned incidents">
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <motion.div className="max-w-4xl mx-auto space-y-6 pb-10" variants={stagger} initial="hidden" animate="show">
        {/* Metrics */}
        <section className="grid grid-cols-3 gap-2 sm:gap-3">
          <motion.div variants={item}>
            <div className="rounded-xl surface-panel p-3 sm:p-4 border border-amber-200 bg-amber-50/80">
              <p className="text-xl sm:text-2xl font-bold text-amber-300 tabular-nums">{pending}</p>
              <p className="text-ers-inkSecondary text-body-sm mt-0.5">Pending</p>
              <Clock className="w-4 h-4 text-amber-400/80 mt-1.5" />
            </div>
          </motion.div>
          <motion.div variants={item}>
            <div className="rounded-xl surface-panel p-3 sm:p-4 border border-teal-200 bg-teal-50/80">
              <p className="text-xl sm:text-2xl font-bold text-teal-600 tabular-nums">{active}</p>
              <p className="text-ers-inkSecondary text-body-sm mt-0.5">Active</p>
              <Navigation className="w-4 h-4 text-teal-600/80 mt-1.5" />
            </div>
          </motion.div>
          <motion.div variants={item}>
            <div className="rounded-xl surface-panel p-3 sm:p-4 border border-emerald-200 bg-emerald-50/80">
              <p className="text-xl sm:text-2xl font-bold text-emerald-300 tabular-nums">{completed}</p>
              <p className="text-body-sm text-ers-inkTertiary mt-0.5">Completed</p>
              <CheckCircle className="w-4 h-4 text-emerald-400/80 mt-1.5" />
            </div>
          </motion.div>
        </section>

        {/* Map */}
        {activeForMap.length > 0 && (
          <motion.section variants={item}>
            <h2 className="text-h4 text-ers-ink font-semibold flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-teal-600" aria-hidden />
              Destinations
            </h2>
            <div className="rounded-xl overflow-hidden border border-ers-subtle h-[220px] sm:h-[260px]">
              <IncidentMap
                incidents={activeForMap}
                center={mapCenter}
                zoom={12}
                height="100%"
                showFit
              />
            </div>
          </motion.section>
        )}

        {/* Assignments list */}
        <section>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h2 className="text-h4 text-ers-ink font-semibold flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-ers-inkTertiary" aria-hidden />
              Assigned incidents
            </h2>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="ers-input w-auto min-w-[130px] text-body-sm py-2.5"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="en_route">En route</option>
              <option value="on_site">On site</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {assignments.length === 0 ? (
            <div className="rounded-xl surface-card p-8">
              <EmptyState
                icon={ListTodo}
                title="No assignments"
                description="You have no assigned incidents. Check back later."
              />
            </div>
          ) : (
            <ul className="space-y-3">
              {assignments.map((a) => {
                const inc = a.incidentId;
                const hasLocation = inc?.location?.coordinates?.length === 2;
                return (
                  <motion.li key={a._id} variants={item}>
                    <Link to={`/incidents/${inc?._id || a.incidentId}`} className="block">
                      <div className="rounded-xl surface-card p-4 sm:p-5 border border-ers-subtle hover:border-ers-inkSecondary/30 transition-colors">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <PriorityBadge priority={inc?.priority} />
                              <StatusBadge status={a.status} />
                            </div>
                            <h3 className="font-semibold text-ers-ink truncate">{inc?.title}</h3>
                            <p className="text-body-sm text-ers-inkTertiary mt-0.5">{inc?.category}</p>
                            {(inc?.address || hasLocation) && (
                              <p className="text-caption text-ers-inkSecondary mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3 shrink-0" aria-hidden />
                                {inc?.address || 'Location set'}
                              </p>
                            )}
                            <p className="text-caption text-ers-inkSecondary mt-1">Assigned by {a.assignedBy?.name}</p>
                          </div>
                          <span className="shrink-0 p-2 rounded-lg surface-subtle text-ers-inkTertiary hover:text-ers-ink transition-colors">
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                        <QuickAction
                          assignment={a}
                          incident={inc}
                          onStatus={handleStatusChange}
                          updating={updating}
                        />
                      </div>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </section>
      </motion.div>
    </PageLayout>
  );
}
