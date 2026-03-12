import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/client';
import { DASHBOARD, INCIDENTS, ALERTS, AUDIT, DEMO, USERS } from '../api/endpoints';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { StatusBadge, PriorityBadge } from '../components/incident/StatusBadge';
import { IncidentMap } from '../components/map/IncidentMap';
import { LoadingScreen } from '../components/ui/LoadingSpinner';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import { EmptyState } from '../components/ui/EmptyState';
import {
  ClipboardList,
  CheckCircle,
  UserPlus,
  Loader2,
  CheckCheck,
  AlertTriangle,
  MapPin,
  Bell,
  Activity,
  ArrowRight,
  RotateCcw,
  Search,
  Users,
  Zap,
} from 'lucide-react';

const stagger = { show: { transition: { staggerChildren: 0.03 } } };
const item = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } };

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'reported', label: 'Open' },
  { value: 'validated', label: 'Validated' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PRIORITY_OPTIONS = [
  { value: '', label: 'All priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const CATEGORY_OPTIONS = [
  { value: '', label: 'All types' },
  { value: 'Fire', label: 'Fire' },
  { value: 'Medical Emergency', label: 'Medical' },
  { value: 'Road Accident', label: 'Accident' },
  { value: 'Security Threat', label: 'Security' },
  { value: 'Rescue Request', label: 'Rescue' },
];

export function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [audit, setAudit] = useState([]);
  const [responders, setResponders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);

  function load() {
    const incParams = new URLSearchParams();
    if (statusFilter) incParams.set('status', statusFilter);
    if (priorityFilter) incParams.set('priority', priorityFilter);
    incParams.set('limit', '100');

    Promise.all([
      api.get(DASHBOARD),
      api.get(`${INCIDENTS.list}?${incParams}`),
      api.get(`${ALERTS.list}?acknowledged=false`),
      api.get(`${AUDIT.list}?limit=20`),
      api.get(USERS.responders).catch(() => ({ data: [] })),
    ])
      .then(([dashRes, incRes, alertRes, auditRes, respondersRes]) => {
        setSummary(dashRes.data);
        let list = incRes.data || [];
        if (categoryFilter) {
          list = list.filter((i) => (i.category || '').toLowerCase() === categoryFilter.toLowerCase());
        }
        setIncidents(list);
        setAlerts(alertRes.data || []);
        setAudit(auditRes.data || []);
        setResponders(respondersRes.data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [statusFilter, priorityFilter, categoryFilter]);

  useEffect(() => {
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, [statusFilter, priorityFilter, categoryFilter]);

  const handleResetDemoData = () => {
    if (!window.confirm('Reset all incidents, assignments, alerts, and audit logs and load fresh demo data? This cannot be undone.')) return;
    setResetting(true);
    setResetMessage(null);
    api
      .post(DEMO.reset)
      .then((res) => {
        setResetMessage(`Demo data reset. Created: ${res.data?.data?.incidentsCreated ?? 0} incidents, ${res.data?.data?.assignmentsCreated ?? 0} assignments.`);
        load();
      })
      .catch((err) => setResetMessage(err.response?.data?.error || err.message || 'Reset failed'))
      .finally(() => setResetting(false));
  };

  const filteredIncidents = useMemo(() => {
    if (!searchQuery.trim()) return incidents;
    const q = searchQuery.trim().toLowerCase();
    return incidents.filter(
      (i) =>
        (i.title || '').toLowerCase().includes(q) ||
        (i.category || '').toLowerCase().includes(q) ||
        (i.description || '').toLowerCase().includes(q)
    );
  }, [incidents, searchQuery]);

  if (loading && !summary) {
    return (
      <PageLayout title="Admin Dashboard">
        <LoadingScreen message="Loading dashboard…" />
      </PageLayout>
    );
  }

  const counts = summary?.incidentCountsByStatus || {};
  const total = summary?.totalIncidents ?? Object.values(counts).reduce((a, b) => a + b, 0);
  const active =
    summary?.activeIncidents ??
    (counts.reported || 0) + (counts.validated || 0) + (counts.assigned || 0) + (counts.in_progress || 0);
  const overdue = summary?.unacknowledgedAlertsCount ?? 0;
  const resolved = summary?.resolvedIncidents ?? (counts.resolved || 0);
  const respondersAvailable = summary?.respondersAvailable ?? 0;

  const activeForMap = incidents.filter(
    (i) => i.location?.coordinates?.length === 2 && !['resolved', 'cancelled'].includes(i.status)
  );
  const respondersWithLocation = responders.filter((r) => r.location?.coordinates?.length >= 2);
  const mapCenter = activeForMap[0]
    ? { lat: activeForMap[0].location.coordinates[1], lng: activeForMap[0].location.coordinates[0] }
    : respondersWithLocation[0]
      ? { lat: respondersWithLocation[0].location.coordinates[1], lng: respondersWithLocation[0].location.coordinates[0] }
      : { lat: 40.7, lng: -74 };

  return (
    <PageLayout
      title="Operations"
      subtitle="Incidents, responders, and activity"
      actions={
        <Button
          variant="secondary"
          onClick={handleResetDemoData}
          disabled={resetting}
          className="!py-2 !px-3 text-sm"
        >
          {resetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
          <span className="ml-1.5 hidden sm:inline">Reset Demo</span>
        </Button>
      }
    >
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      {resetMessage && (
        <div
          className={`mb-4 p-3 rounded-xl text-sm flex items-center justify-between flex-wrap gap-2 ${
            resetMessage.includes('Created') ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'
          }`}
        >
          <span>{resetMessage}</span>
          <button type="button" onClick={() => setResetMessage(null)} className="underline">
            Dismiss
          </button>
        </div>
      )}

      <motion.div className="space-y-5" variants={stagger} initial="hidden" animate="show">
        <section>
          <h2 className="sr-only">Key metrics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-12 gap-3">
            <motion.div variants={item} className="lg:col-span-4">
              <Link to="/manage" className="block">
                <div className="rounded-xl border border-ers-subtle bg-ers-elevated p-4 sm:p-5 hover:border-ers-inkSecondary/30 transition-colors h-full">
                  <p className="text-3xl sm:text-4xl font-bold text-ers-ink tabular-nums tracking-tight">{total}</p>
                  <p className="text-sm text-ers-inkSecondary mt-1">Total incidents</p>
                  <ClipboardList className="w-6 h-6 text-ers-inkTertiary/60 mt-4" />
                </div>
              </Link>
            </motion.div>
            <motion.div variants={item} className="lg:col-span-2">
              <Link to="/manage?status=reported" className="block">
                <div className="rounded-xl border border-teal-200 bg-teal-50/80 p-4 hover:border-teal-300 transition-colors h-full">
                  <p className="text-2xl font-bold text-teal-700 tabular-nums">{active}</p>
                  <p className="text-xs text-ers-inkSecondary mt-0.5">Active</p>
                </div>
              </Link>
            </motion.div>
            <motion.div variants={item} className="lg:col-span-2">
              <Link to="/alerts" className="block">
                <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 hover:border-amber-300 transition-colors h-full">
                  <p className="text-2xl font-bold text-amber-700 tabular-nums">{overdue}</p>
                  <p className="text-xs text-ers-inkSecondary mt-0.5">Overdue</p>
                </div>
              </Link>
            </motion.div>
            <motion.div variants={item} className="lg:col-span-2">
              <Link to="/manage?status=resolved" className="block">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 hover:border-emerald-300 transition-colors h-full">
                  <p className="text-2xl font-bold text-emerald-700 tabular-nums">{resolved}</p>
                  <p className="text-xs text-ers-inkSecondary mt-0.5">Resolved</p>
                </div>
              </Link>
            </motion.div>
            <motion.div variants={item} className="lg:col-span-2">
              <div className="rounded-xl border border-ers-subtle bg-ers-surface/60 p-4 h-full">
                <p className="text-2xl font-bold text-ers-ink tabular-nums">{respondersAvailable}</p>
                <p className="text-xs text-ers-inkSecondary mt-0.5">Responders</p>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-5">
          <div className="xl:col-span-3 space-y-5">
            <section className="rounded-xl border border-ers-subtle bg-ers-elevated overflow-hidden">
              <div className="p-4 border-b border-ers-subtle">
                <h2 className="text-h4 text-ers-ink font-semibold flex items-center gap-2 mb-2">
                  <ClipboardList className="w-5 h-5 text-ers-inkTertiary" />
                  Incidents
                </h2>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <div className="relative flex-1 min-w-[140px] max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ers-inkTertiary pointer-events-none" />
                    <input
                      type="search"
                      placeholder="Search…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="ers-input pl-9 py-2.5 text-sm"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="ers-input w-auto min-w-[120px] text-sm py-2.5"
                  >
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value || 'all'} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="ers-input w-auto min-w-[100px] text-sm py-2.5"
                  >
                    {PRIORITY_OPTIONS.map((o) => (
                      <option key={o.value || 'all'} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="ers-input w-auto min-w-[100px] text-sm py-2.5"
                  >
                    {CATEGORY_OPTIONS.map((o) => (
                      <option key={o.value || 'all'} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
                {filteredIncidents.length === 0 ? (
                  <div className="p-8">
                    <EmptyState
                      icon={ClipboardList}
                      title="No incidents"
                      description={searchQuery ? 'Try a different search or clear filters.' : 'Change filters or wait for new reports.'}
                    />
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-ers-surface sticky top-0 z-[1] border-b border-ers-subtle">
                      <tr>
                        <th className="text-left p-3 sm:p-4 text-ers-inkSecondary font-medium">Title</th>
                        <th className="text-left p-3 sm:p-4 text-ers-inkSecondary font-medium hidden sm:table-cell">Type</th>
                        <th className="text-left p-3 sm:p-4 text-ers-inkSecondary font-medium">Status</th>
                        <th className="text-left p-3 sm:p-4 text-ers-inkSecondary font-medium">Priority</th>
                        <th className="p-3 sm:p-4 w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIncidents.slice(0, 20).map((inc) => (
                        <motion.tr
                          key={inc._id}
                          variants={item}
                          className="border-t border-ers-subtle hover:bg-ers-subtle/80 transition-colors"
                        >
                          <td className="p-3">
                            <Link to={`/incidents/${inc._id}`} className="text-ers-ink font-medium hover:text-teal-600 transition-colors line-clamp-1">
                              {inc.title}
                            </Link>
                          </td>
                          <td className="p-3 text-ers-inkSecondary hidden sm:table-cell">{inc.category}</td>
                          <td className="p-3">
                            <StatusBadge status={inc.status} />
                          </td>
                          <td className="p-3">
                            <PriorityBadge priority={inc.priority} />
                          </td>
                          <td className="p-3">
                            <Link to={`/incidents/${inc._id}`} className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-ers-subtle/80 text-ers-inkSecondary hover:text-ers-ink transition-colors">
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              {filteredIncidents.length > 20 && (
                <div className="p-3 border-t border-ers-subtle text-center">
                  <Link to="/manage" className="text-body-sm text-teal-600 hover:text-teal-700 font-medium">
                    View all ({filteredIncidents.length})
                  </Link>
                </div>
              )}
            </section>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Alerts */}
              <section className="rounded-xl surface-card overflow-hidden">
                <div className="p-4 border-b border-ers-subtle flex items-center justify-between">
                  <h2 className="text-h4 text-ers-ink flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-600" />
                    Alerts
                  </h2>
                  {alerts.length > 0 && (
                    <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-lg">
                      {alerts.length}
                    </span>
                  )}
                </div>
                <div className="p-4 max-h-[220px] overflow-y-auto">
                  {alerts.length === 0 ? (
                    <p className="text-ers-inkTertiary text-sm">No unacknowledged alerts.</p>
                  ) : (
                    <ul className="space-y-2">
                      {alerts.slice(0, 6).map((a) => (
                        <li key={a._id} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="text-ers-ink line-clamp-2">{a.message}</p>
                            <Link
                              to={`/incidents/${a.incidentId?._id || a.incidentId}`}
                              className="text-caption text-teal-600 hover:text-teal-700 mt-0.5 inline-block"
                            >
                              View incident →
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  {alerts.length > 0 && (
                    <Link to="/alerts" className="inline-block mt-2 text-caption text-teal-600 hover:text-teal-700">
                      View all alerts
                    </Link>
                  )}
                </div>
              </section>

              {/* Activity feed */}
              <section className="rounded-xl surface-card overflow-hidden">
                <div className="p-4 border-b border-ers-subtle">
                  <h2 className="text-h4 text-ers-ink flex items-center gap-2">
                    <Activity className="w-4 h-4 text-ers-inkSecondary" />
                    Activity
                  </h2>
                </div>
                <div className="p-4 max-h-[220px] overflow-y-auto">
                  {audit.length === 0 ? (
                    <p className="text-ers-inkTertiary text-sm">No recent activity.</p>
                  ) : (
                    <ul className="space-y-2">
                      {audit.map((e) => (
                        <li key={e._id} className="text-xs flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <span className="text-ers-inkSecondary font-medium">{e.action?.replace(/_/g, ' ')}</span>
                          <span className="text-ers-inkTertiary">{e.entityType || e.resource}</span>
                          {e.actorRole && <span className="text-ers-inkTertiary">· {e.actorRole}</span>}
                          <span className="text-ers-inkTertiary ml-auto shrink-0">{new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link to="/activity" className="inline-block mt-2 text-caption text-teal-600 hover:text-teal-700">
                    View full log
                  </Link>
                </div>
              </section>
            </div>
          </div>

          {/* Right: Map */}
          <div className="xl:col-span-2">
            <section className="rounded-xl surface-card overflow-hidden sticky top-24">
              <div className="p-4 border-b border-ers-subtle flex items-center justify-between">
                <h2 className="text-h4 text-ers-ink flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  Live map
                </h2>
                <span className="flex items-center gap-1.5 text-xs text-ers-inkTertiary">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Updates every 20s
                </span>
              </div>
              <div className="relative">
                {activeForMap.length === 0 && respondersWithLocation.length === 0 ? (
                  <div className="p-8 text-center text-ers-inkTertiary text-sm">
                    No incident or responder locations to show.
                  </div>
                ) : (
                  <IncidentMap
                    incidents={activeForMap}
                    responders={respondersWithLocation}
                    center={mapCenter}
                    zoom={activeForMap.length || respondersWithLocation.length ? 11 : 10}
                    height="min(420px, 50vh)"
                    showFit={activeForMap.length > 0 || respondersWithLocation.length > 0}
                    showLegend={activeForMap.length > 0}
                    colorByType
                  />
                )}
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </PageLayout>
  );
}
