/**
 * 2D placeholder for "Live map" product section.
 * Clean, stylized map suggestion — no 3D. Fits design system.
 */
export function MapPreviewPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ers-surface via-ers-subtle/90 to-ers-elevated">
      <svg
        viewBox="0 0 400 240"
        className="w-full max-w-[90%] h-full max-h-[85%] text-ers-inkTertiary/40"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        aria-hidden
      >
        {/* Grid */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={`v${i}`} x1={80 + i * 56} y1={20} x2={80 + i * 56} y2={220} />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`h${i}`} x1={80} y1={20 + i * 50} x2={360} y2={20 + i * 50} />
        ))}
        {/* Abstract road/path */}
        <path
          d="M 120 180 Q 200 120 280 80"
          strokeWidth="3"
          className="text-ers-inkTertiary/30"
        />
        {/* Markers */}
        <circle cx="120" cy="180" r="8" className="fill-emergency-500 text-emergency-500" />
        <circle cx="200" cy="120" r="6" className="fill-teal-500 text-teal-500" />
        <circle cx="280" cy="80" r="8" className="fill-emerald-500 text-emerald-500" />
      </svg>
    </div>
  );
}
