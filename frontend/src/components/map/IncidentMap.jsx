import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { incidentIcon, incidentIconByCategory, responderIcon, selectedLocationIcon, EMERGENCY_TYPE_COLORS } from './mapIcons';
import { MapWrapper } from './MapWrapper';

function FitBounds({ positions, padding = [32, 32], maxZoom = 14 }) {
  const map = useMap();
  useEffect(() => {
    if (!positions?.length) return;
    const bounds = L.latLngBounds(positions.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding, maxZoom });
  }, [map, positions, padding, maxZoom]);
  return null;
}

function SetCenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (!center?.lat || !center?.lng) return;
    map.setView([center.lat, center.lng], typeof zoom === 'number' ? zoom : map.getZoom());
  }, [map, center?.lat, center?.lng, zoom]);
  return null;
}

const DEFAULT_CENTER = { lat: 40.7128, lng: -74.006 }; // fallback for empty map

const LEGEND_ENTRIES = [
  { label: 'Fire', color: EMERGENCY_TYPE_COLORS.Fire },
  { label: 'Medical', color: EMERGENCY_TYPE_COLORS['Medical Emergency'] },
  { label: 'Road Accident', color: EMERGENCY_TYPE_COLORS['Road Accident'] },
  { label: 'Security', color: EMERGENCY_TYPE_COLORS['Security Threat'] },
  { label: 'Flood/Rescue', color: EMERGENCY_TYPE_COLORS['Rescue Request'] },
  { label: 'Other', color: EMERGENCY_TYPE_COLORS.Other },
];

export function IncidentMap({
  incidents = [],
  responders = [],
  center,
  zoom = 12,
  height = '400px',
  showFit = true,
  showLegend = false,
  colorByType = false,
  loading = false,
}) {
  const incidentPositions = incidents.filter((i) => i.location?.coordinates?.length >= 2).map((i) => ({
    lat: i.location.coordinates[1],
    lng: i.location.coordinates[0],
    ...i,
  }));
  const responderPositions = (responders || [])
    .filter((r) => r.location?.coordinates?.length >= 2)
    .map((r) => ({
      lat: r.location.coordinates[1],
      lng: r.location.coordinates[0],
      ...r,
    }));
  const allPositions = [...incidentPositions, ...responderPositions];
  const hasData = allPositions.length > 0 || (center && (center.lat !== 0 || center.lng !== 0));
  const mapCenter = center && (center.lat !== 0 || center.lng !== 0)
    ? center
    : allPositions[0]
      ? { lat: allPositions[0].lat, lng: allPositions[0].lng }
      : DEFAULT_CENTER;
  const initialZoom = allPositions.length > 1 ? 12 : zoom;

  if (!hasData) {
    return (
      <MapWrapper
        height={height}
        showFallback
        fallback={
          <div className="flex flex-col items-center justify-center h-full text-ers-inkTertiary p-6">
            <p className="text-sm">No incident or responder locations to show</p>
          </div>
        }
      />
    );
  }

  const getIncidentIcon = (incident) =>
    colorByType ? incidentIconByCategory(incident.category || incident.type) : incidentIcon;

  return (
    <MapWrapper height={height} loading={loading} className="relative">
      {showLegend && incidentPositions.length > 0 && (
        <div className="absolute bottom-3 left-3 z-[1000] rounded-xl border border-ers-subtle bg-ers-elevated px-3 py-2.5 shadow-ers-md">
          <p className="text-xs font-medium text-ers-inkSecondary mb-1.5">By type</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {LEGEND_ENTRIES.map(({ label, color }) => (
              <span key={label} className="inline-flex items-center gap-1.5 text-xs text-ers-inkSecondary">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 border border-ers-subtle"
                  style={{ background: color }}
                />
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={initialZoom}
        style={{ height: '100%', width: '100%', minHeight: 200 }}
        scrollWheelZoom
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {showFit && allPositions.length > 0 && (
          <FitBounds positions={allPositions} padding={[40, 40]} maxZoom={14} />
        )}
        {allPositions.length === 0 && center && (
          <>
            <SetCenter center={center} zoom={zoom} />
            <Marker position={[center.lat, center.lng]} icon={selectedLocationIcon}>
              <Popup><span className="text-ers-inkSecondary">Selected location</span></Popup>
            </Marker>
          </>
        )}
        {incidentPositions.map((incident, idx) => (
          <Marker key={incident._id || idx} position={[incident.lat, incident.lng]} icon={getIncidentIcon(incident)}>
            <Popup>
              <div className="text-ers-ink text-sm min-w-[160px]">
                <strong className="text-ers-ink block truncate">{incident.title}</strong>
                <span className="text-ers-inkSecondary block">{incident.status?.replace(/_/g, ' ')} · {incident.priority}</span>
                <Link
                  to={`/incidents/${incident._id}`}
                  className="mt-2 inline-block text-xs font-medium text-emergency-600 hover:text-emergency-700"
                >
                  View details →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
        {responderPositions.map((r, idx) => (
          <Marker key={r._id || `r-${idx}`} position={[r.lat, r.lng]} icon={responderIcon}>
            <Popup>
              <div className="text-ers-ink text-sm min-w-[120px]">
                <strong className="text-ers-ink">{r.name || 'Responder'}</strong>
                <br />
                <span className="text-ers-inkSecondary">{r.serviceType || 'Unit'}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </MapWrapper>
  );
}
