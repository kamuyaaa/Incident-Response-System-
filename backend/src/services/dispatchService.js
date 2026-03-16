const User = require('../models/User');
const Assignment = require('../models/Assignment');

const VALID_SERVICE_TYPES = ['general', 'fire', 'medical', 'police', 'hazard', 'rescue'];

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function getBusyResponderIds() {
  return Assignment.distinct('responderId', {
    status: { $in: ['pending', 'accepted', 'en_route', 'on_site'] },
  });
}

async function getNearestAvailableResponders(incidentLocation, options = {}) {
  const {
    limit = 10,
    serviceType = null,
    capabilities = null,
    incidentCategory = null,
  } = options;

  const [lng, lat] = Array.isArray(incidentLocation) ? incidentLocation : [incidentLocation.lng ?? 0, incidentLocation.lat ?? 0];
  const assignedIds = await getBusyResponderIds();

  const query = {
    role: 'RESPONDER',
    isAvailable: true,
    _id: { $nin: assignedIds },
    'location.coordinates.0': { $exists: true, $ne: null },
    'location.coordinates.1': { $exists: true, $ne: null },
  };

  if (serviceType && VALID_SERVICE_TYPES.includes(serviceType)) {
    query.$or = [{ serviceType }, { serviceType: 'general' }];
  } else if (serviceType) {
    query.serviceType = serviceType;
  }
  if (Array.isArray(capabilities) && capabilities.length > 0) {
    query.capabilities = { $in: capabilities.map((c) => String(c).trim()).filter(Boolean) };
  }

  const responders = await User.find(query)
    .select('name email location isAvailable serviceType capabilities')
    .lean();

  const withDistance = responders
    .map((r) => {
      const [rLng, rLat] = r.location?.coordinates || [0, 0];
      const distanceKm = haversineKm(lat, lng, rLat, rLng);
      return {
        ...r,
        distanceKm: Math.round(distanceKm * 100) / 100,
        coordinates: r.location?.coordinates ? { longitude: r.location.coordinates[0], latitude: r.location.coordinates[1] } : null,
      };
    })
    .filter((r) => r.distanceKm >= 0)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit)
    .map((r, index) => ({ ...r, rank: index + 1 }));

  return withDistance;
}

module.exports = {
  getNearestAvailableResponders,
  getBusyResponderIds,
  haversineKm,
  VALID_SERVICE_TYPES,
};
