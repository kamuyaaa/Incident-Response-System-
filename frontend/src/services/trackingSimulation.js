/**
 * Demo tracking simulation: responder moves toward incident on each page load.
 * State persisted in localStorage so progress continues across refreshes.
 */

const STORAGE_KEY = 'ers-demo-tracking';

const STAGES = ['assigned', 'en_route', 'near_scene', 'on_site', 'resolving', 'resolved'];

const STEP_DEGREES = 0.012; // ~1.3 km per refresh at equator
const NEAR_SCENE_KM = 0.3;
const ON_SITE_KM = 0.05;
const ON_SITE_TICKS_BEFORE_RESOLVING = 2;
const SECONDS_PER_STEP = 45; // assumed time between refreshes for ETA

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function moveToward(fromLat, fromLng, toLat, toLng, stepDegrees) {
  const dLat = toLat - fromLat;
  const dLng = toLng - fromLng;
  const dist = Math.sqrt(dLat * dLat + dLng * dLng) || 1e-10;
  const scale = Math.min(1, stepDegrees / dist);
  return {
    lat: fromLat + dLat * scale,
    lng: fromLng + dLng * scale,
  };
}

function getStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setStored(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

function getIncidentCoords(incident) {
  const c = incident?.location?.coordinates;
  if (Array.isArray(c) && c.length >= 2) return { lat: c[1], lng: c[0] };
  return null;
}

function responderTypeFromCategory(category) {
  const s = (category || '').toLowerCase();
  if (s.includes('fire')) return 'fire_truck';
  if (s.includes('medical') || s.includes('accident')) return 'ambulance';
  if (s.includes('crime')) return 'police';
  return 'general';
}

/**
 * Create or get simulation state for an assigned incident.
 * Responder starts at a point ~2km away from incident.
 */
export function getOrCreateSimulation(incidentId, incident, assignment) {
  const coords = getIncidentCoords(incident);
  if (!coords || !assignment) return null;

  const stored = getStored();
  let sim = stored[incidentId];

  if (sim && sim.stage === 'resolved') return sim;

  if (!sim) {
    const angle = Math.random() * 2 * Math.PI;
    const startKm = 1.8 + Math.random() * 0.6;
    const degPerKm = 1 / 111;
    const responderLat = coords.lat + (startKm * Math.cos(angle)) * degPerKm;
    const responderLng = coords.lng + (startKm * Math.sin(angle)) * degPerKm / Math.cos((coords.lat * Math.PI) / 180);
    const responderType = responderTypeFromCategory(incident.category);
    sim = {
      incidentId,
      assignmentId: assignment._id,
      incidentLat: coords.lat,
      incidentLng: coords.lng,
      responderLat,
      responderLng,
      stage: 'assigned',
      responderType,
      responderName: assignment.responderId?.name || 'Responder',
      createdAt: new Date().toISOString(),
      lastAdvancedAt: new Date().toISOString(),
      timeline: [{ stage: 'assigned', at: new Date().toISOString() }],
      onSiteTicks: 0,
    };
    stored[incidentId] = sim;
    setStored(stored);
  }

  return sim;
}

/**
 * Advance simulation by one step (call once per page load).
 * Moves responder toward incident; updates stage by distance thresholds.
 */
export function advanceSimulation(incidentId, onStageChange) {
  const stored = getStored();
  const sim = stored[incidentId];
  if (!sim || sim.stage === 'resolved') return sim;

  const prevStage = sim.stage;
  let { responderLat, responderLng, incidentLat, incidentLng, stage, onSiteTicks, timeline } = sim;

  const distanceKm = haversineKm(responderLat, responderLng, incidentLat, incidentLng);

  if (stage === 'on_site') {
    onSiteTicks = (onSiteTicks || 0) + 1;
    sim.onSiteTicks = onSiteTicks;
    if (onSiteTicks >= ON_SITE_TICKS_BEFORE_RESOLVING) {
      stage = 'resolving';
      timeline = [...(timeline || []), { stage: 'resolving', at: new Date().toISOString() }];
    }
  } else if (stage === 'resolving') {
    stage = 'resolved';
    timeline = [...(timeline || []), { stage: 'resolved', at: new Date().toISOString() }];
    sim.responderLat = incidentLat;
    sim.responderLng = incidentLng;
  } else {
    const next = moveToward(responderLat, responderLng, incidentLat, incidentLng, STEP_DEGREES);
    sim.responderLat = next.lat;
    sim.responderLng = next.lng;

    const newDistanceKm = haversineKm(next.lat, next.lng, incidentLat, incidentLng);

    if (stage === 'assigned') {
      stage = 'en_route';
      timeline = [...(timeline || []), { stage: 'en_route', at: new Date().toISOString() }];
    } else if (stage === 'en_route' && newDistanceKm <= NEAR_SCENE_KM) {
      stage = 'near_scene';
      timeline = [...(timeline || []), { stage: 'near_scene', at: new Date().toISOString() }];
    } else if ((stage === 'en_route' || stage === 'near_scene') && newDistanceKm <= ON_SITE_KM) {
      stage = 'on_site';
      sim.responderLat = incidentLat;
      sim.responderLng = incidentLng;
      timeline = [...(timeline || []), { stage: 'on_site', at: new Date().toISOString() }];
    }
  }

  sim.stage = stage;
  sim.timeline = timeline;
  sim.lastAdvancedAt = new Date().toISOString();
  stored[incidentId] = sim;
  setStored(stored);

  if (onStageChange && stage !== prevStage) onStageChange(incidentId, stage, prevStage);
  return sim;
}

/**
 * Get current simulation state (does not advance).
 */
export function getSimulation(incidentId) {
  const stored = getStored();
  return stored[incidentId] || null;
}

/**
 * Get state for UI: distance remaining, ETA minutes, progress 0-100.
 */
export function getTrackingDisplay(sim) {
  if (!sim) return null;
  if (sim.stage === 'resolved') {
    return {
      stage: sim.stage,
      distanceKm: 0,
      etaMinutes: 0,
      progress: 100,
      timeline: sim.timeline || [],
    };
  }
  const distanceKm = haversineKm(
    sim.responderLat,
    sim.responderLng,
    sim.incidentLat,
    sim.incidentLng
  );
  const initialKmEstimate = 2;
  const progress = Math.min(100, Math.max(0, ((initialKmEstimate - distanceKm) / initialKmEstimate) * 100));
  const stepsRemaining = distanceKm / (STEP_DEGREES * 111 * 0.7);
  const etaMinutes = Math.max(0, Math.round(stepsRemaining * SECONDS_PER_STEP / 60));
  return {
    stage: sim.stage,
    distanceKm: Math.round(distanceKm * 100) / 100,
    etaMinutes,
    progress,
    timeline: sim.timeline || [],
  };
}

export { STAGES };
