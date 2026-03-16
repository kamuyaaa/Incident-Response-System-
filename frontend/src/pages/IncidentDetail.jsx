import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { INCIDENTS, ASSIGNMENTS, TRACKING } from '../api/endpoints';
import { PageLayout } from '../components/layout/PageLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge, PriorityBadge } from '../components/incident/StatusBadge';
import { IncidentMap } from '../components/map/IncidentMap';
import { TrackingMap } from '../components/tracking/TrackingMap';
import { TrackingCard } from '../components/tracking/TrackingCard';
import { TrackingSummaryCard } from '../components/tracking/TrackingSummaryCard';
import { Skeleton } from '../components/ui/Skeleton';
import {
  getTrackingDisplay,
} from '../services/trackingSimulation';
import { ArrowLeft, UserPlus, CheckCircle, XCircle, MapPin, Navigation, Flag, History, ArrowUpRight, Shield } from 'lucide-react';

function IncidentDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="rounded-xl surface-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-7 w-20 rounded-lg" />
          <Skeleton className="h-7 w-16 rounded-lg" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="rounded-xl overflow-hidden">
        <Skeleton className="h-[280px] w-full" />
      </div>
      <div className="rounded-xl surface-card p-5 space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}

function AssignmentActionButtons({ assignment, incident, updating, onStatus, onIncidentStatus, touchFriendly }) {
  const status = assignment.status;
  if (status === 'completed' || status === 'declined') return null;

  const btnClass = touchFriendly ? '!py-2.5 !px-4 text-sm min-h-[48px] w-full sm:w-auto' : '!py-1.5 !px-3 text-sm';

  return (
    <div className={`flex flex-wrap gap-2 ${touchFriendly ? 'flex-col sm:flex-row' : ''}`}>
      {status === 'pending' && (
        <>
          <Button className={btnClass} onClick={() => onStatus(assignment._id, 'accepted')} disabled={updating}>
            <CheckCircle className="w-4 h-4 mr-1.5" /> Accept
          </Button>
          <Button className={btnClass} variant="secondary" onClick={() => onStatus(assignment._id, 'declined')} disabled={updating}>
            <XCircle className="w-4 h-4 mr-1.5" /> Decline
          </Button>
        </>
      )}
      {status === 'accepted' && (
        <Button className={btnClass} onClick={() => onStatus(assignment._id, 'en_route', 'en_route')} disabled={updating}>
          <Navigation className="w-4 h-4 mr-1.5" /> En route
        </Button>
      )}
      {status === 'en_route' && (
        <Button className={btnClass} onClick={() => onStatus(assignment._id, 'near_scene', 'near_scene')} disabled={updating}>
          <MapPin className="w-4 h-4 mr-1.5" /> Near scene
        </Button>
      )}
      {status === 'near_scene' && (
        <Button className={btnClass} onClick={() => onStatus(assignment._id, 'on_site', 'on_site')} disabled={updating}>
          <MapPin className="w-4 h-4 mr-1.5" /> On site
        </Button>
      )}
      {status === 'on_site' && (
        <Button className={btnClass} onClick={() => onStatus(assignment._id, 'resolving', 'resolving')} disabled={updating}>
          <Flag className="w-4 h-4 mr-1.5" /> Resolving
        </Button>
      )}
      {status === 'resolving' && (
        <Button className={btnClass} onClick={() => onStatus(assignment._id, 'completed', 'resolved')} disabled={updating}>
          <CheckCircle className="w-4 h-4 mr-1.5" /> Resolved
        </Button>
      )}
    </div>
  );
}

export function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasAnyRole } = useAuth();
  const [incident, setIncident] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [simulation, setSimulation] = useState(null);
  const trackingPollRef = useRef(null);
  const detailsPollRef = useRef(null);

  useEffect(() => {
    if (!id) {
      setError('Invalid incident');
      setLoading(false);
      return;
    }
    setError(null);
    const load = async () => {
      try {
        const [incRes, assignRes] = await Promise.all([
          api.get(INCIDENTS.one(id)),
          api.get(ASSIGNMENTS.byIncident(id)).catch(() => ({ data: [] })),
        ]);
        setIncident(incRes.data ?? incRes);
        setAssignments(Array.isArray(assignRes.data) ? assignRes.data : (assignRes.data ? [assignRes.data] : []));
      } catch (e) {
        console.error(e);
        setError(e.message || 'Failed to load incident');
        setIncident(null);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };
    load();
    detailsPollRef.current = setInterval(load, 8000);
    return () => {
      if (detailsPollRef.current) clearInterval(detailsPollRef.current);
      detailsPollRef.current = null;
    };
  }, [id]);

  // Shared tracking: poll backend so all roles see synchronized movement.
  useEffect(() => {
    if (!id || !incident) return undefined;

    const hasAssignment = assignments.some((a) => a.status !== 'declined');
    if (!hasAssignment) {
      setSimulation(null);
      return undefined;
    }

    let cancelled = false;

    const poll = async () => {
      try {
        const res = await api.get(TRACKING.byIncident(id));
        if (cancelled) return;
        const t = res.data;
        if (t && t.active) {
          setSimulation({
            incidentId: id,
            responderLat: t.responderLat,
            responderLng: t.responderLng,
            incidentLat: incident.location?.coordinates?.[1],
            incidentLng: incident.location?.coordinates?.[0],
            stage: t.stage,
            responderType: t.responder?.serviceType || 'general',
            responderName: t.responder?.name || 'Responder',
            timeline: [],
          });
        } else {
          setSimulation(null);
        }
      } catch {
        // Keep UI usable if tracking fails
      }
    };

    poll();
    trackingPollRef.current = setInterval(poll, 5000);
    return () => {
      cancelled = true;
      if (trackingPollRef.current) clearInterval(trackingPollRef.current);
      trackingPollRef.current = null;
    };
  }, [id, incident, assignments]);

  const loadRecommendations = async () => {
    try {
      const res = await api.get(ASSIGNMENTS.recommend(id));
      setRecommendations(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleValidate = async () => {
    setUpdating(true);
    try {
      const updated = await api.patch(INCIDENTS.validate(id), {});
      setIncident(updated.data);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const handleEscalate = async () => {
    setUpdating(true);
    try {
      const updated = await api.patch(INCIDENTS.escalate(id), { note: 'Escalated for supervisor review (demo).' });
      setIncident(updated.data);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const handlePriority = async (priority) => {
    setUpdating(true);
    try {
      const updated = await api.patch(INCIDENTS.priority(id), { priority });
      setIncident(updated.data);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const handleAssign = async (responderId) => {
    setAssigning(true);
    try {
      await api.post(ASSIGNMENTS.create, { incidentId: id, responderId });
      const [incRes, assignRes] = await Promise.all([
        api.get(INCIDENTS.one(id)),
        api.get(ASSIGNMENTS.byIncident(id)),
      ]);
      setIncident(incRes.data ?? incRes);
      setAssignments(assignRes.data || []);
      setRecommendations([]);
    } catch (e) {
      console.error(e);
    } finally {
      setAssigning(false);
    }
  };

  const handleStatusChange = async (status) => {
    setUpdating(true);
    try {
      const updated = await api.patch(INCIDENTS.update(id), { status });
      setIncident(updated.data);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignmentStatus = async (assignmentId, status) => {
    setUpdating(true);
    try {
      await api.patch(ASSIGNMENTS.status(assignmentId), { status });
      const [inc, assignRes] = await Promise.all([
        api.get(INCIDENTS.one(id)),
        api.get(ASSIGNMENTS.byIncident(id)),
      ]);
      setIncident(inc.data);
      setAssignments(assignRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <PageLayout title="Incident">
        <IncidentDetailSkeleton />
      </PageLayout>
    );
  }

  if (error || !incident) {
    return (
      <PageLayout title="Incident">
        <div className="max-w-md mx-auto rounded-xl surface-card border border-ers-subtle p-8 sm:p-10 text-center">
          <h2 className="text-h3 text-ers-ink mb-2">Incident not found</h2>
          <p className="text-body-sm text-ers-inkSecondary mb-6">
            {error || 'The incident may have been removed or you don’t have permission to view it.'}
          </p>
          <Link to="/incidents">
            <Button variant="secondary">Back to incidents</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const coords = incident.location?.coordinates;
  const mapCenter = coords?.length === 2 ? { lat: coords[1], lng: coords[0] } : null;
  const isReporter = incident.reporterId?._id === user?.id || incident.reporterId === user?.id;
  const canAdmin = hasAnyRole('ADMIN', 'SUPERVISOR');
  const canRespond = hasAnyRole('RESPONDER');
  const myAssignment = assignments.find(
    (a) => a.responderId?._id === user?.id || a.responderId === user?.id
  );

  const backTo = canRespond ? '/dashboard' : isReporter ? '/dashboard' : '/incidents';

  // Responder-focused layout: tracking + map first, then summary, actions, timeline
  if (canRespond && myAssignment && !canAdmin) {
    const trackingDisplay = simulation ? getTrackingDisplay(simulation) : null;
    return (
      <PageLayout
        title="Assignment"
        subtitle={incident.title}
        actions={
          <Link to={backTo}>
            <Button variant="ghost" className="min-h-[44px]"><ArrowLeft className="w-4 h-4" /> Back</Button>
          </Link>
        }
      >
        <motion.div
          className="max-w-3xl mx-auto space-y-4 sm:space-y-5 pb-24 sm:pb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {/* Tracking summary + map as main visual block */}
          <div className="space-y-3 sm:space-y-4">
            {(simulation || myAssignment) && (
              <TrackingSummaryCard
                simulation={simulation}
                display={trackingDisplay}
                assignment={!simulation ? myAssignment : null}
              />
            )}
            <div className="rounded-xl overflow-hidden border border-ers-subtle shadow-ers-card">
              {simulation ? (
                <TrackingMap
                  incident={incident}
                  simulation={simulation}
                  display={trackingDisplay}
                  height="min(380px, 52vh)"
                />
              ) : mapCenter ? (
                <IncidentMap incidents={[incident]} center={mapCenter} height="min(380px, 52vh)" showFit />
              ) : null}
            </div>
          </div>

          {/* Issue summary + destination */}
          <div className="rounded-xl surface-card border border-ers-subtle p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <PriorityBadge priority={incident.priority} />
              <StatusBadge status={incident.status} animated />
              <span className="text-body-sm text-ers-inkTertiary">{incident.category}</span>
            </div>
            <h2 className="text-h3 text-ers-ink mb-2">{incident.title}</h2>
            <p className="text-ers-ink text-body-sm sm:text-body leading-relaxed">{incident.description}</p>
            {(incident.address || mapCenter) && (
              <p className="text-ers-inkSecondary text-body-sm mt-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                {incident.address || 'Destination on map'}
              </p>
            )}
          </div>

          {/* Quick actions */}
          <div className="rounded-xl surface-card border border-ers-subtle p-4 sm:p-5">
            <p className="text-caption font-semibold uppercase tracking-wide text-ers-inkTertiary mb-3">Update status</p>
            <AssignmentActionButtons
              assignment={myAssignment}
              incident={incident}
              updating={updating}
              onStatus={handleAssignmentStatus}
              onIncidentStatus={handleStatusChange}
              touchFriendly
            />
          </div>

          {/* Timeline */}
          <div className="rounded-xl surface-card border border-ers-subtle p-5">
            <h3 className="text-h4 text-ers-ink mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-ers-inkTertiary" />
              Timeline
            </h3>
            <ul className="space-y-2 relative pl-4 border-l border-ers-subtle">
              {incident.reportedAt && (
                <li className="relative -left-4">
                  <span className="text-caption text-ers-inkSecondary">Reported — {new Date(incident.reportedAt).toLocaleString()}</span>
                </li>
              )}
              {(incident.statusHistory || []).map((entry, idx) => (
                <li key={idx} className="relative -left-4">
                  <span className="text-caption text-ers-inkSecondary capitalize">{entry.status.replace(/_/g, ' ')} — {new Date(entry.at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </PageLayout>
    );
  }

  // Reporter-focused: tracking summary + map first, then incident summary, activity
  if (isReporter && !canAdmin) {
    const trackingDisplay = simulation ? getTrackingDisplay(simulation) : null;
    const firstAssignment = assignments[0];
    return (
      <PageLayout
        title="Your report"
        subtitle={incident.title}
        actions={
          <Link to={backTo}>
            <Button variant="ghost" className="min-h-[44px]"><ArrowLeft className="w-4 h-4" /> Back</Button>
          </Link>
        }
      >
        <motion.div
          className="max-w-3xl mx-auto space-y-4 sm:space-y-5 pb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {/* Tracking summary + map as main visual block */}
          <div className="space-y-3 sm:space-y-4">
            {(simulation || firstAssignment) && (
              <TrackingSummaryCard
                simulation={simulation}
                display={trackingDisplay}
                assignment={!simulation ? firstAssignment : null}
              />
            )}
            {!simulation && assignments.length === 0 && (incident.status === 'reported' || incident.status === 'validated') && (
              <div className="rounded-xl surface-card border border-amber-500/20 p-4 sm:p-5">
                <p className="text-amber-700 text-body-sm font-medium">Your report has been received.</p>
                <p className="text-body-sm text-ers-inkSecondary mt-1">A responder will be assigned shortly. Refresh for updates.</p>
              </div>
            )}
            <div className="rounded-xl overflow-hidden border border-ers-subtle shadow-ers-card">
              {simulation ? (
                <TrackingMap
                  incident={incident}
                  simulation={simulation}
                  display={trackingDisplay}
                  height="min(400px, 55vh)"
                />
              ) : mapCenter ? (
                <IncidentMap incidents={[incident]} center={mapCenter} height="min(400px, 55vh)" showFit />
              ) : null}
            </div>
          </div>

          {/* Incident summary */}
          <div className="rounded-xl surface-card border border-ers-subtle p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <StatusBadge status={incident.status} animated />
              <PriorityBadge priority={incident.priority} />
              <span className="text-body-sm text-ers-inkTertiary">{incident.category}</span>
            </div>
            <h2 className="text-h3 text-ers-ink mb-2">{incident.title}</h2>
            <p className="text-ers-ink text-body-sm sm:text-body leading-relaxed">{incident.description}</p>
            {incident.address && (
              <p className="text-body-sm text-ers-inkTertiary mt-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                {incident.address}
              </p>
            )}
          </div>

          {/* Activity timeline */}
          <div className="rounded-xl surface-card border border-ers-subtle p-5">
            <h3 className="text-h4 text-ers-ink mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-ers-inkTertiary" />
              Activity
            </h3>
            <ul className="space-y-2 relative pl-4 border-l border-ers-subtle">
              {incident.reportedAt && (
                <li className="relative -left-4">
                  <span className="text-caption text-ers-inkSecondary">
                    Reported — {new Date(incident.reportedAt).toLocaleString()}
                  </span>
                </li>
              )}
              {(incident.statusHistory || []).map((entry, idx) => (
                <li key={idx} className="relative -left-4">
                  <span className="text-caption text-ers-inkSecondary capitalize">
                    {entry.status.replace(/_/g, ' ')} — {new Date(entry.at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </PageLayout>
    );
  }

  const reporterName = incident.reporterId?.name || incident.guestReporter?.name || 'Guest';
  const reporterPhone = incident.guestReporter?.phone || incident.reporterId?.email;
  const incidentIdShort = incident._id ? String(incident._id).slice(-8) : '—';
  const createdTime = incident.reportedAt || incident.createdAt;
  const updatedTime = incident.updatedAt || incident.resolvedAt || incident.validatedAt;

  const trackingDisplay = simulation ? getTrackingDisplay(simulation) : null;
  const firstAssignment = assignments[0];

  return (
    <PageLayout
      title={incident.title}
      subtitle={`${incident.category} · ${reporterName}`}
      actions={
        <Link to={backTo}>
          <Button variant="ghost" className="min-h-[44px]"><ArrowLeft className="w-4 h-4" /> Back</Button>
        </Link>
      }
    >
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1fr,minmax(360px,440px)]">
        {/* Left: incident details as one panel with sections */}
        <div className="space-y-4 order-2 lg:order-1">
          <div className="rounded-xl border border-ers-subtle bg-ers-elevated overflow-hidden shadow-surface-card">
            <div className="p-5 sm:p-6 border-b border-ers-subtle">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <StatusBadge status={incident.status} animated />
                <PriorityBadge priority={incident.priority} />
                <span className="text-ers-inkTertiary text-caption font-mono">ID: {incidentIdShort}</span>
              </div>
              {createdTime && (
                <p className="text-caption text-ers-inkTertiary mb-3">
                  Created {new Date(createdTime).toLocaleString()}
                  {updatedTime && ` · Updated ${new Date(updatedTime).toLocaleString()}`}
                </p>
              )}
              <p className="text-ers-ink leading-relaxed">{incident.description}</p>
              {incident.address && (
                <p className="text-body-sm text-ers-inkTertiary mt-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emergency-600/80 shrink-0" />
                  {incident.address}
                </p>
              )}
            </div>
            <div className="p-5 sm:p-6 border-b border-ers-subtle">
              <h3 className="text-h4 text-ers-ink mb-2 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-ers-inkTertiary" />
                Reporter / source
              </h3>
              <p className="text-ers-ink">{reporterName}</p>
              {reporterPhone && <p className="text-body-sm text-ers-inkTertiary mt-0.5">{reporterPhone}</p>}
              {incident.address && <p className="text-body-sm text-ers-inkSecondary mt-1">{incident.address}</p>}
            </div>
          </div>
          {canAdmin && incident.status === 'reported' && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
              <h3 className="text-h4 text-ers-ink mb-1">Triage this incident</h3>
              <p className="text-body-sm text-slate-500 mb-4">Review the report and take the appropriate action.</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={handleValidate} disabled={updating}>
                  <CheckCircle className="w-4 h-4 mr-1.5" /> Validate
                </Button>
                <Button variant="secondary" onClick={handleEscalate} disabled={updating}>
                  <ArrowUpRight className="w-4 h-4 mr-1.5" />
                  Escalate to supervisor
                </Button>
                <label className="text-label flex items-center gap-2">
                  <span>Priority</span>
                  <select
                    value={incident.priority}
                    onChange={(e) => handlePriority(e.target.value)}
                    className="ers-input w-auto min-w-[120px] py-2 text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </label>
              </div>
            </div>
          )}
          {canAdmin && incident.status === 'escalated' && (
            <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-5 sm:p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-h4 text-amber-900 mb-0.5">Escalated — Supervisor action required</h3>
                  <p className="text-body-sm text-amber-700">This incident was escalated for supervisor review. Choose how to proceed.</p>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <button
                  onClick={handleValidate}
                  disabled={updating}
                  className="flex flex-col items-start p-4 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 transition-all text-left disabled:opacity-50"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-600 mb-2" />
                  <span className="text-sm font-semibold text-slate-900">Validate & approve</span>
                  <span className="text-xs text-slate-500 mt-0.5">Confirm the report and proceed to assign a responder.</span>
                </button>
                <button
                  onClick={() => loadRecommendations()}
                  disabled={updating}
                  className="flex flex-col items-start p-4 rounded-xl border border-sky-200 bg-white hover:bg-sky-50 hover:border-sky-300 transition-all text-left disabled:opacity-50"
                >
                  <UserPlus className="w-5 h-5 text-sky-600 mb-2" />
                  <span className="text-sm font-semibold text-slate-900">Assign responder</span>
                  <span className="text-xs text-slate-500 mt-0.5">Find and dispatch the nearest available unit.</span>
                </button>
                <button
                  onClick={() => {}}
                  className="flex flex-col items-start p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all text-left"
                >
                  <label className="flex flex-col w-full cursor-pointer">
                    <span className="text-sm font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                      <Flag className="w-4 h-4 text-orange-500" /> Reprioritize
                    </span>
                    <select
                      value={incident.priority}
                      onChange={(e) => handlePriority(e.target.value)}
                      className="ers-input py-2 text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </label>
                </button>
              </div>
              {recommendations.length > 0 && (
                <div className="mt-4 p-4 rounded-xl bg-white border border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Recommended responders</h4>
                  <ul className="space-y-2">
                    {recommendations.map((r) => (
                      <li key={r._id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                        <span className="text-slate-700 text-body-sm">{r.name} — {(r.distanceKm || 0).toFixed(1)} km</span>
                        <Button disabled={assigning} onClick={() => handleAssign(r._id)} className="!py-1.5 !px-3 text-sm">Assign</Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {canAdmin && (incident.status === 'validated' || incident.status === 'assigned') && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
              <h3 className="text-h4 text-ers-ink mb-3">Assign responder</h3>
              {recommendations.length === 0 ? (
                <Button variant="secondary" onClick={loadRecommendations}>
                  <UserPlus className="w-4 h-4 mr-1.5" /> Find nearest responders
                </Button>
              ) : (
                <ul className="space-y-2">
                  {recommendations.map((r) => (
                    <li key={r._id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                      <span className="text-slate-700 text-body-sm">{r.name} — {(r.distanceKm || 0).toFixed(1)} km</span>
                      <Button disabled={assigning} onClick={() => handleAssign(r._id)}>Assign</Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {assignments.length > 0 && (
            <div className="rounded-xl border border-ers-subtle bg-ers-elevated p-5 sm:p-6">
              <h3 className="text-h4 text-ers-ink mb-3">Assignments</h3>
              <ul className="space-y-2">
                {assignments.map((a) => (
                  <li key={a._id} className="flex justify-between items-center flex-wrap gap-2">
                    <span className="text-ers-ink text-body-sm">
                      {a.responderId?.name ?? a.responderId} · <StatusBadge status={a.status} />
                    </span>
                    {canRespond && (a.responderId?._id === user?.id || a.responderId === user?.id) && (
                      <AssignmentActionButtons
                        assignment={a}
                        incident={incident}
                        updating={updating}
                        onStatus={handleAssignmentStatus}
                        onIncidentStatus={handleStatusChange}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {incident.media?.length > 0 && (
            <div className="rounded-xl border border-ers-subtle bg-ers-elevated p-5 sm:p-6">
              <h3 className="text-h4 text-ers-ink mb-3">Media / evidence</h3>
              <div className="flex flex-wrap gap-2">
                {incident.media.map((m, idx) => (
                  <a
                    key={idx}
                    href={m.url?.startsWith('http') ? m.url : `${window.location.origin}${m.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg overflow-hidden border border-ers-subtle hover:border-emergency-500/40 transition-colors"
                  >
                    <img src={m.url?.startsWith('http') ? m.url : `${window.location.origin}${m.url}`} alt="" className="w-24 h-24 object-cover" />
                  </a>
                ))}
              </div>
            </div>
          )}
          {(incident.statusHistory?.length > 0 || incident.reportedAt) && (
            <div className="rounded-xl border border-ers-subtle bg-ers-elevated p-5 sm:p-6">
              <h3 className="text-h4 text-ers-ink mb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-ers-inkTertiary" />
                Timeline
              </h3>
              <ul className="space-y-2 relative pl-4 border-l border-ers-subtle">
                {incident.reportedAt && (
                  <li className="relative -left-4">
                    <span className="text-caption text-ers-inkTertiary">
                      Reported — {new Date(incident.reportedAt).toLocaleString()}
                      {(incident.reporterId?.name || incident.guestReporter?.name || incident.guestReporter?.phone) &&
                        ` by ${incident.reporterId?.name || incident.guestReporter?.name || `Guest (${incident.guestReporter?.phone})`}`}
                    </span>
                  </li>
                )}
                {(incident.statusHistory || []).map((entry, idx) => (
                  <li key={idx} className="relative -left-4">
                    <span className="text-caption text-ers-inkSecondary">
                      {entry.status.replace(/_/g, ' ')} — {new Date(entry.at).toLocaleString()}
                      {entry.by && typeof entry.by === 'object' && entry.by.name && ` by ${entry.by.name}`}
                    </span>
                    {entry.note && <p className="text-caption text-ers-inkTertiary mt-0.5">{entry.note}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* Right: tracking + map as one product block */}
        <div className="space-y-3 sm:space-y-4 order-1 lg:order-2">
          {(simulation || firstAssignment) && (
            <TrackingSummaryCard
              simulation={simulation}
              display={trackingDisplay}
              assignment={!simulation ? firstAssignment : null}
            />
          )}
          <div className="rounded-xl overflow-hidden border border-ers-subtle shadow-ers-card">
            {simulation ? (
              <TrackingMap
                incident={incident}
                simulation={simulation}
                display={trackingDisplay}
                height="min(400px, 55vh)"
              />
            ) : mapCenter ? (
              <IncidentMap incidents={[incident]} center={mapCenter} height="min(400px, 55vh)" showFit />
            ) : null}
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
