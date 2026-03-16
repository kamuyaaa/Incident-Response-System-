/**
 * Sanitize text inputs: trim, limit length, remove control characters.
 */
function sanitizeString(value, maxLength = 2000) {
  if (value == null) return '';
  const s = String(value).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
  return s.slice(0, maxLength);
}

function sanitizeGuestReport(body) {
  const coords = body.coordinates;
  const lat = body.latitude ?? coords?.latitude;
  const lng = body.longitude ?? coords?.longitude;
  return {
    type: sanitizeString(body.type || body.category, 100),
    category: sanitizeString(body.type || body.category, 100),
    description: sanitizeString(body.description, 2000),
    severity: body.severity,
    latitude: lat != null ? Number(lat) : undefined,
    longitude: lng != null ? Number(lng) : undefined,
    coordinates: coords && typeof coords === 'object' ? { latitude: Number(coords.latitude), longitude: Number(coords.longitude) } : undefined,
    guestReporter: body.guestReporter && typeof body.guestReporter === 'object'
      ? {
          name: sanitizeString(body.guestReporter.name, 200),
          phone: sanitizeString(body.guestReporter.phone, 30),
        }
      : {},
    media: Array.isArray(body.media)
      ? body.media.slice(0, 10).map((m) => (m && m.url ? { url: sanitizeString(m.url, 2048), type: sanitizeString(m.type || 'image', 50) } : null)).filter(Boolean)
      : [],
  };
}

module.exports = { sanitizeString, sanitizeGuestReport };
