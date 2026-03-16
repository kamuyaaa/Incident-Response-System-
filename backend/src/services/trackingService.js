const Assignment = require('../models/Assignment');
const Incident = require('../models/Incident');
const User = require('../models/User');
const auditService = require('./auditService');
const incidentService = require('./incidentService');
const { haversineKm, moveToward } = require('../utils/geo');

const NEAR_SCENE_KM = 0.3;
const ON_SITE_KM = 0.05;
const STEP_KM = 0.25; // per poll ~250m for demo
const SECONDS_PER_STEP = 30;

function incidentCoords(incident) {
  const c = incident?.location?.coordinates;
  if (Array.isArray(c) && c.length >= 2) return { lat: c[1], lng: c[0] };
  return null;
}

function randomStartAround({ lat, lng }, km = 1.8) {
  const angle = Math.random() * 2 * Math.PI;
  const degPerKm = 1 / 111;
  const dLat = (km * Math.cos(angle)) * degPerKm;
  const dLng = (km * Math.sin(angle)) * degPerKm / Math.cos((lat * Math.PI) / 180);
  return { lat: lat + dLat, lng: lng + dLng };
}

function mapAssignmentToIncidentStatus(assignmentStatus) {
  if (assignmentStatus === 'en_route') return 'en_route';
  if (assignmentStatus === 'near_scene') return 'near_scene';
  if (assignmentStatus === 'on_site') return 'on_site';
  if (assignmentStatus === 'resolving') return 'resolving';
  if (assignmentStatus === 'completed') return 'resolved';
  return null;
}

async function getActiveAssignment(incidentId) {
  return Assignment.findOne({
    incidentId,
    status: { $in: ['pending', 'accepted', 'en_route', 'near_scene', 'on_site', 'resolving'] },
  })
    .populate('responderId', 'name serviceType location')
    .lean();
}

async function advanceTracking(incidentId, actorId = null, actorRole = null) {
  const incident = await Incident.findById(incidentId).lean();
  if (!incident) throw Object.assign(new Error('Incident not found'), { statusCode: 404 });

  const coords = incidentCoords(incident);
  if (!coords) {
    return { incident, active: false, reason: 'no_location' };
  }

  const assignment = await getActiveAssignment(incidentId);
  if (!assignment) {
    return { incident, active: false, reason: 'no_assignment' };
  }

  const responder = assignment.responderId;
  const responderCoordsArr = responder?.location?.coordinates;
  let responderLat = Array.isArray(responderCoordsArr) && responderCoordsArr.length >= 2 ? responderCoordsArr[1] : null;
  let responderLng = Array.isArray(responderCoordsArr) && responderCoordsArr.length >= 2 ? responderCoordsArr[0] : null;

  // Initialize responder location if missing/zero.
  if (!responderLat || !responderLng || (responderLat === 0 && responderLng === 0)) {
    const start = randomStartAround(coords, 1.8 + Math.random() * 0.6);
    responderLat = start.lat;
    responderLng = start.lng;
    await User.findByIdAndUpdate(responder._id, { location: { type: 'Point', coordinates: [responderLng, responderLat] } });
  }

  const distanceKm = haversineKm(responderLat, responderLng, coords.lat, coords.lng);

  // Advance only if not resolved.
  let nextLat = responderLat;
  let nextLng = responderLng;
  if (assignment.status !== 'resolving') {
    const moved = moveToward(responderLat, responderLng, coords.lat, coords.lng, STEP_KM);
    nextLat = moved.lat;
    nextLng = moved.lng;
    await User.findByIdAndUpdate(responder._id, { location: { type: 'Point', coordinates: [nextLng, nextLat] } });
  }

  const nextDistanceKm = haversineKm(nextLat, nextLng, coords.lat, coords.lng);

  // Auto-progress assignment status based on distance.
  let nextAssignmentStatus = assignment.status;
  if (assignment.status === 'pending' || assignment.status === 'accepted') nextAssignmentStatus = 'en_route';
  if (nextAssignmentStatus === 'en_route' && nextDistanceKm <= NEAR_SCENE_KM) nextAssignmentStatus = 'near_scene';
  if ((nextAssignmentStatus === 'en_route' || nextAssignmentStatus === 'near_scene') && nextDistanceKm <= ON_SITE_KM) nextAssignmentStatus = 'on_site';
  // If on_site for a while, move to resolving.
  if (nextAssignmentStatus === 'on_site') nextAssignmentStatus = 'resolving';

  const statusChanged = nextAssignmentStatus !== assignment.status;

  if (statusChanged) {
    await Assignment.findByIdAndUpdate(assignment._id, { status: nextAssignmentStatus, lastTrackedAt: new Date() });
    const incidentStatus = mapAssignmentToIncidentStatus(nextAssignmentStatus);
    if (incidentStatus && incidentStatus !== incident.status) {
      await incidentService.update(
        incidentId,
        {
          status: incidentStatus,
          ...(incidentStatus === 'resolved' ? { resolvedAt: new Date() } : {}),
          note: 'Auto-progressed by tracking simulation (demo).',
        },
        actorId || responder._id,
        actorRole || 'RESPONDER'
      );
    }
    await auditService.append(actorId || responder._id, actorRole || 'RESPONDER', 'tracking_advance', 'Incident', String(incidentId), {
      assignmentId: String(assignment._id),
      assignmentStatus: nextAssignmentStatus,
    });
  }

  const etaMinutes = Math.max(0, Math.round((nextDistanceKm / STEP_KM) * (SECONDS_PER_STEP / 60)));

  return {
    active: true,
    incidentId: String(incidentId),
    assignmentId: String(assignment._id),
    stage: mapAssignmentToIncidentStatus(nextAssignmentStatus) || incident.status,
    distanceKm: Math.round(nextDistanceKm * 100) / 100,
    etaMinutes,
    responder: {
      _id: responder._id,
      name: responder.name,
      serviceType: responder.serviceType || 'general',
    },
    responderLat: nextLat,
    responderLng: nextLng,
  };
}

module.exports = { advanceTracking };

