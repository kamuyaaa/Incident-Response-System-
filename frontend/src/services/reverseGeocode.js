/**
 * Reverse geocoding via OpenStreetMap Nominatim (free, no API key).
 * Caches results by rounded coordinates to reduce requests.
 * Formats readable address with Kenya-style preference (area, road, town, county).
 */

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';
const CACHE_KEY_PRECISION = 4;
const CACHE_MAX = 50;
const cache = new Map();

function cacheKey(lat, lng) {
  return `${Number(lat).toFixed(CACHE_KEY_PRECISION)},${Number(lng).toFixed(CACHE_KEY_PRECISION)}`;
}

function trimCache() {
  if (cache.size <= CACHE_MAX) return;
  const entries = [...cache.entries()].sort((a, b) => a[1].fetchedAt - b[1].fetchedAt);
  const toDelete = entries.slice(0, cache.size - CACHE_MAX).map((e) => e[0]);
  toDelete.forEach((k) => cache.delete(k));
}

/**
 * Format address from Nominatim address object for Kenya-style readability.
 * Prefer: suburb/neighbourhood, road, city/town, state/county, country.
 */
function formatAddress(addr) {
  if (!addr || typeof addr !== 'object') return null;
  const parts = [];
  const add = (...keys) => {
    for (const k of keys) {
      const v = addr[k];
      if (v && typeof v === 'string' && !parts.includes(v)) parts.push(v.trim());
    }
  };
  add('suburb', 'neighbourhood', 'quarter', 'village');
  add('road', 'street', 'footway');
  add('city', 'town', 'municipality');
  add('state', 'county');
  add('country');
  const str = parts.filter(Boolean).join(', ');
  return str || null;
}

/**
 * Reverse geocode coordinates to a human-readable address.
 * @param {{ lat: number, lng: number }} coords
 * @returns {Promise<string | null>} Address string or null on failure
 */
export async function reverseGeocode(coords) {
  const lat = coords?.lat;
  const lng = coords?.lng;
  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }
  const key = cacheKey(lat, lng);
  const cached = cache.get(key);
  if (cached) return cached.address;
  try {
    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lng),
      format: 'json',
      addressdetails: '1',
    });
    const res = await fetch(`${NOMINATIM_URL}?${params}`, {
      method: 'GET',
      headers: { Accept: 'application/json', 'User-Agent': 'KenyaEmergencyResponse/1.0' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const addr = data?.address;
    const formatted = formatAddress(addr) || data?.display_name || null;
    cache.set(key, { address: formatted, fetchedAt: Date.now() });
    trimCache();
    return formatted;
  } catch {
    return null;
  }
}

/**
 * Fallback text when reverse geocoding fails: coordinates + optional "Near X" for Kenya.
 */
export function coordsFallbackText(lat, lng) {
  if (lat == null || lng == null) return '';
  const la = Number(lat).toFixed(5);
  const ln = Number(lng).toFixed(5);
  return `${la}, ${ln}`;
}
