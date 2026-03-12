import { useState, useCallback, useRef } from 'react';

const GEO_TIMEOUT = 15000;
const GEO_MAX_AGE = 60000;

function getErrorMessage(err) {
  if (!err) return null;
  const code = err.code;
  const message = err.message || '';
  if (code === 1) return 'Location permission denied. Use the map to set your location, or allow access and try again.';
  if (code === 2) return 'Location unavailable. Check your connection and try again.';
  if (code === 3) return 'Location request timed out. Try again or set location on the map.';
  if (message.toLowerCase().includes('not supported')) return 'Geolocation is not supported in this browser. Tap the map to set your location.';
  return 'Could not get your location. Tap the map to set it, or try again.';
}

export function useGeolocation(options = {}) {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const requestedOnce = useRef(false);

  const getPosition = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setError({ code: 0, message: 'Geolocation is not supported' });
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPosition({ lat: p.coords.latitude, lng: p.coords.longitude });
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setPosition(null);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: options.timeout ?? GEO_TIMEOUT,
        maximumAge: options.maximumAge ?? GEO_MAX_AGE,
        ...options,
      }
    );
  }, []);

  function requestOnce() {
    if (requestedOnce.current) return;
    requestedOnce.current = true;
    getPosition();
  }

  return {
    position,
    error,
    errorMessage: error ? getErrorMessage(error) : null,
    loading,
    getPosition,
    requestOnce,
  };
}
