function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function moveToward(fromLat, fromLng, toLat, toLng, stepKm) {
  const dLat = toLat - fromLat;
  const dLng = toLng - fromLng;
  const dist = Math.sqrt(dLat * dLat + dLng * dLng) || 1e-10;
  const degPerKm = 1 / 111;
  const stepDeg = stepKm * degPerKm;
  const scale = Math.min(1, stepDeg / dist);
  return {
    lat: fromLat + dLat * scale,
    lng: fromLng + dLng * scale,
  };
}

module.exports = { haversineKm, moveToward };

