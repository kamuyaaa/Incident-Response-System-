import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import { useGeolocation } from '../../hooks/useGeolocation';
import { reverseGeocode, coordsFallbackText } from '../../services/reverseGeocode';
import { Button } from '../ui/Button';
import { userLocationIcon, selectedLocationIcon } from './mapIcons';
import { MapWrapper } from './MapWrapper';
import { MapPin, CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function SetViewWhenCenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (!center?.lat || !center?.lng) return;
    map.setView([center.lat, center.lng], typeof zoom === 'number' ? zoom : map.getZoom());
  }, [map, center?.lat, center?.lng, zoom]);
  return null;
}

const DEFAULT_CENTER = { lat: -1.2921, lng: 36.8219 };
const PICKER_MIN_HEIGHT = 220;

export function LocationPicker({ value, onChange, height = '300px', autoRequest = false }) {
  const { position: geoPosition, getPosition, requestOnce, loading: geoLoading, error, errorMessage } = useGeolocation();
  const [internal, setInternal] = useState(value ?? null);
  const [address, setAddress] = useState(value?.address ?? null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const lastFetchedKey = useRef(null);

  useEffect(() => {
    if (autoRequest) requestOnce();
  }, [autoRequest, requestOnce]);

  useEffect(() => {
    const d = internal || value;
    if (d?.lat == null || d?.lng == null) return;
    const key = `${Number(d.lat).toFixed(4)},${Number(d.lng).toFixed(4)}`;
    if (lastFetchedKey.current === key) return;
    if (d.address != null && d.address !== '') {
      setAddress(d.address);
      lastFetchedKey.current = key;
      return;
    }
    lastFetchedKey.current = key;
    setAddressLoading(true);
    reverseGeocode({ lat: d.lat, lng: d.lng })
      .then((text) => {
        setAddress(text);
      })
      .finally(() => setAddressLoading(false));
  }, [internal?.lat, internal?.lng, value?.lat, value?.lng, value?.address]);

  const fetchAddress = useCallback(async (lat, lng) => {
    setAddressLoading(true);
    try {
      const text = await reverseGeocode({ lat, lng });
      setAddress(text || null);
      return text;
    } catch {
      setAddress(null);
      return null;
    } finally {
      setAddressLoading(false);
    }
  }, []);

  const handleSelect = useCallback(
    async (pos) => {
      setInternal(pos);
      setLocationSuccess(false);
      const addr = await fetchAddress(pos.lat, pos.lng);
      onChange?.({ lat: pos.lat, lng: pos.lng, address: addr ?? undefined });
    },
    [onChange, fetchAddress]
  );

  useEffect(() => {
    if (!geoPosition || geoLoading) return;
    setInternal(geoPosition);
    setLocationSuccess(true);
    fetchAddress(geoPosition.lat, geoPosition.lng).then((addr) => {
      onChange?.({ lat: geoPosition.lat, lng: geoPosition.lng, address: addr ?? undefined });
    });
  }, [geoPosition, geoLoading]);

  const display = internal || value;
  const hasSelection = display?.lat != null && display?.lng != null;
  const hasUserLocation = geoPosition?.lat != null && geoPosition?.lng != null;
  const center = display || geoPosition || DEFAULT_CENTER;
  const zoom = (hasSelection || hasUserLocation) ? 14 : 10;
  const displayAddress = address ?? value?.address ?? (hasSelection ? coordsFallbackText(display.lat, display.lng) : null);
  const effectiveHeight = typeof height === 'string' ? height : `${Math.max(PICKER_MIN_HEIGHT, height)}px`;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => getPosition()}
          disabled={geoLoading}
          className="min-h-[44px]"
        >
          {geoLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span className="ml-2">Detecting your location…</span>
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="ml-2">Use my location</span>
            </>
          )}
        </Button>
        {error && (
          <>
            <span className="text-sm text-amber-400 flex items-center gap-1.5" role="alert">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMessage}
            </span>
            <Button type="button" variant="ghost" onClick={() => getPosition()} className="min-h-[36px] !py-2 !px-3 text-sm">
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Retry
            </Button>
          </>
        )}
        {locationSuccess && hasSelection && !geoLoading && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-sm text-emerald-400 flex items-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4 shrink-0" />
            Location set
          </motion.span>
        )}
      </div>

      <MapWrapper height={effectiveHeight}>
        <MapContainer
          center={[center.lat || 0, center.lng || 0]}
          zoom={zoom}
          style={{ height: '100%', width: '100%', minHeight: PICKER_MIN_HEIGHT }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <SetViewWhenCenter center={center} zoom={zoom} />
          <MapClickHandler onSelect={handleSelect} />
          {hasUserLocation && (!hasSelection || Math.abs(display.lat - geoPosition.lat) > 1e-5 || Math.abs(display.lng - geoPosition.lng) > 1e-5) && (
            <Marker position={[geoPosition.lat, geoPosition.lng]} icon={userLocationIcon} />
          )}
          {hasSelection && (
            <Marker
              position={[display.lat, display.lng]}
              icon={selectedLocationIcon}
              draggable
              eventHandlers={{
                dragend(e) {
                  const { lat, lng } = e.target.getLatLng();
                  handleSelect({ lat, lng });
                },
              }}
            />
          )}
        </MapContainer>
      </MapWrapper>

      <AnimatePresence mode="wait">
        {hasSelection && (
          <motion.div
            key="location-card"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="surface-card p-4 sm:p-5 overflow-hidden"
          >
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-ers-subtle/80 border border-ers-subtle flex items-center justify-center">
                <MapPin className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-cyan-400" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <AnimatePresence mode="wait">
                  {addressLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-ers-inkSecondary"
                    >
                      <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                      <span className="text-sm">Looking up address…</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={displayAddress ?? 'coords'}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1.5"
                    >
                      <p className="text-sm sm:text-base text-ers-ink leading-snug font-medium">
                        {displayAddress || 'Location selected'}
                      </p>
                      <p className="text-xs text-ers-inkTertiary">
                        {Number(display.lat).toFixed(5)}, {Number(display.lng).toFixed(5)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <p className="text-xs text-ers-inkTertiary mt-2 pt-2 border-t border-ers-subtle">
                  Tap the map or drag the marker to adjust.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
