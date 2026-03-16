import L from 'leaflet';

/** Marker color by emergency category for main map */
export const EMERGENCY_TYPE_COLORS = {
  Fire: '#ef4444',
  'Medical Emergency': '#22c55e',
  'Road Accident': '#f97316',
  'Security Threat': '#3b82f6',
  'Rescue Request': '#a855f7',
  Flood: '#a855f7',
  Other: '#6b7280',
};

export function incidentIconByCategory(category) {
  const color = EMERGENCY_TYPE_COLORS[category] || EMERGENCY_TYPE_COLORS.Other;
  return L.divIcon({
    className: 'ers-marker ers-marker-incident-type',
    html: `<div style="
      width: 28px; height: 28px;
      border-radius: 50%;
      background: ${color};
      border: 2px solid #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

/** Incident / emergency location – red, prominent */
export const incidentIcon = L.divIcon({
  className: 'ers-marker ers-marker-incident',
  html: `<div style="
    width: 32px; height: 32px;
    border-radius: 50%;
    background: #ef4444;
    border: 3px solid #fff;
    box-shadow: 0 2px 10px rgba(239,68,68,0.5), 0 0 0 2px rgba(0,0,0,0.2);
  "></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

/** Incident for tracking view – slightly larger */
export const incidentTrackingIcon = L.divIcon({
  className: 'ers-marker ers-marker-incident-tracking',
  html: `<div style="
    width: 38px; height: 38px;
    border-radius: 50%;
    background: #ef4444;
    border: 3px solid #fff;
    box-shadow: 0 2px 12px rgba(239,68,68,0.5);
  "></div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

/** Responder – cyan circle */
export const responderIcon = L.divIcon({
  className: 'ers-marker ers-marker-responder',
  html: `<div style="
    width: 28px; height: 28px;
    border-radius: 50%;
    background: #06b6d4;
    border: 3px solid #fff;
    box-shadow: 0 2px 10px rgba(6,182,212,0.5);
  "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

/** Responder with type emoji (tracking) */
export function responderTrackingIcon(type) {
  const emoji = { fire_truck: '🚒', ambulance: '🚑', police: '🚔', general: '🚗' }[type] || '🚗';
  return L.divIcon({
    className: 'ers-marker ers-marker-responder-tracking',
    html: `<div style="
      width: 42px; height: 42px;
      border-radius: 50%;
      background: rgba(6, 182, 212, 0.95);
      border: 3px solid #fff;
      box-shadow: 0 2px 12px rgba(6,182,212,0.5);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px;
    ">${emoji}</div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });
}

/** Current user / “my location” – blue with ring */
export const userLocationIcon = L.divIcon({
  className: 'ers-marker ers-marker-user',
  html: `<div style="
    width: 28px; height: 28px;
    border-radius: 50%;
    background: #3b82f6;
    border: 3px solid #fff;
    box-shadow: 0 0 0 4px rgba(59,130,246,0.35);
  "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

/** Selected location (e.g. report form) – red pin style */
export const selectedLocationIcon = L.divIcon({
  className: 'ers-marker ers-marker-selected',
  html: `<div style="
    width: 30px; height: 30px;
    border-radius: 50%;
    background: #ef4444;
    border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});
