import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { incidentTrackingIcon, responderTrackingIcon } from '../map/mapIcons';
import { MapWrapper } from '../map/MapWrapper';

function FitBoundsTracking({ incidentPos, responderPos, padding = [56, 56], maxZoom = 15 }) {
  const map = useMap();
  useEffect(() => {
    if (incidentPos && responderPos) {
      const bounds = L.latLngBounds([incidentPos, responderPos]);
      map.fitBounds(bounds, { padding, maxZoom });
    } else if (incidentPos) {
      map.setView(incidentPos, 14);
    } else if (responderPos) {
      map.setView(responderPos, 14);
    }
  }, [map, incidentPos, responderPos, padding, maxZoom]);
  return null;
}

export function TrackingMap({
  incident,
  simulation,
  display,
  height = '320px',
  loading = false,
}) {
  const incidentCoords = incident?.location?.coordinates;
  const incidentPos = incidentCoords?.length >= 2 ? [incidentCoords[1], incidentCoords[0]] : null;
  const responderPos = simulation
    ? [simulation.responderLat, simulation.responderLng]
    : null;
  const linePositions =
    incidentPos && responderPos
      ? [
          [incidentPos[0], incidentPos[1]],
          [responderPos[0], responderPos[1]],
        ]
      : [];
  const hasData = incidentPos || responderPos;
  const center = incidentPos || responderPos || [40.7128, -74.006];

  if (!hasData) {
    return (
      <MapWrapper
        height={height}
        showFallback
        fallback={
          <div className="flex flex-col items-center justify-center h-full text-ers-inkTertiary p-6">
            <p className="text-sm">No location data for this incident</p>
          </div>
        }
      />
    );
  }

  return (
    <MapWrapper height={height} loading={loading}>
      <MapContainer
        center={Array.isArray(center) ? center : [center.lat, center.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%', minHeight: 200 }}
        scrollWheelZoom
        className="z-0"
      >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <FitBoundsTracking incidentPos={incidentPos} responderPos={responderPos} />
          {incidentPos && (
            <Marker position={incidentPos} icon={incidentTrackingIcon}>
              <Popup>
                <div className="text-ers-inkSecondary text-sm min-w-[140px]">
                  <strong className="text-ers-ink">Incident</strong>
                  <br />
                  <span className="text-ers-inkSecondary truncate block">{incident?.title}</span>
                </div>
              </Popup>
            </Marker>
          )}
          {responderPos && simulation && (
            <Marker position={responderPos} icon={responderTrackingIcon(simulation.responderType)}>
              <Popup>
                <div className="text-ers-inkSecondary text-sm min-w-[120px]">
                  <strong className="text-ers-ink">{simulation.responderName}</strong>
                  <br />
                  <span className="text-ers-inkSecondary capitalize">{simulation.stage?.replace('_', ' ')}</span>
                </div>
              </Popup>
            </Marker>
          )}
          {linePositions.length === 2 && simulation?.stage !== 'resolved' && (
            <Polyline
              positions={linePositions}
              pathOptions={{
                color: 'rgba(6, 182, 212, 0.75)',
                weight: 4,
                dashArray: '10, 10',
              }}
            />
          )}
      </MapContainer>
      {display && simulation?.stage !== 'resolved' && (
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 pointer-events-none z-[500]">
            <div className="rounded-xl px-3 py-2 text-sm text-ers-inkSecondary bg-ers-elevated/95 border border-ers-subtle shadow-ers-sm">
              <span className="text-ers-inkTertiary">ETA </span>
              <strong className="text-ers-ink">{display.etaMinutes} min</strong>
            </div>
            <div className="rounded-xl px-3 py-2 text-sm text-ers-inkSecondary bg-ers-elevated/95 border border-ers-subtle shadow-ers-sm">
              <span className="text-ers-inkTertiary">Distance </span>
              <strong className="text-ers-ink">{typeof display.distanceKm === 'number' ? display.distanceKm.toFixed(2) : display.distanceKm} km</strong>
            </div>
            <div className="rounded-xl px-3 py-2 text-sm bg-ers-elevated/95 border border-ers-subtle shadow-ers-sm">
              <span className="text-accent-teal font-medium capitalize">{display.stage?.replace('_', ' ')}</span>
            </div>
        </div>
      )}
    </MapWrapper>
  );
}
