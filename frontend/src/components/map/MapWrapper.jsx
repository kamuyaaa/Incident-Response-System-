import { MapPin } from 'lucide-react';

export function MapWrapper({
  children,
  loading = false,
  fallback = null,
  showFallback = false,
  height = '300px',
  className = '',
}) {
  const effectiveHeight = typeof height === 'string' ? height : `${height}px`;

  if (showFallback && fallback != null) {
    return (
      <div
        className={`rounded-xl overflow-hidden border border-ers-subtle bg-ers-surface/50 min-h-[200px] ${className}`}
        style={{ height: effectiveHeight }}
      >
        {fallback}
      </div>
    );
  }

  const defaultFallback = (
    <div className="flex flex-col items-center justify-center h-full text-ers-inkTertiary p-6">
      <MapPin className="w-10 h-10 mb-2 opacity-50" />
      <p className="text-body-sm">No location to show</p>
    </div>
  );

  return (
    <div
      className={`relative rounded-xl overflow-hidden border border-ers-subtle bg-ers-surface shadow-ers-card min-h-[200px] ${className}`}
      style={{ height: effectiveHeight }}
    >
      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-ers-elevated/90 backdrop-blur-sm">
          <div className="w-8 h-8 border-2 border-ers-subtle border-t-emergency-600 rounded-full animate-spin" />
        </div>
      )}
      {showFallback ? defaultFallback : children}
    </div>
  );
}
