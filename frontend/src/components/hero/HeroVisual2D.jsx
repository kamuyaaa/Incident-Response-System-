/**
 * Premium 2D hero visual — no 3D. Gradient + subtle beacon/signal motif.
 * Keeps the hero area intentional and on-brand without WebGL.
 */
export function HeroVisual2D() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-ers-surface via-ers-subtle/95 to-ers-elevated" />
      <svg
        className="absolute w-full max-w-[85%] h-full max-h-[80%] text-ers-inkTertiary/[0.06]"
        viewBox="0 0 400 320"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        aria-hidden
      >
        {/* Soft concentric arcs — signal/coverage feel */}
        <ellipse cx="200" cy="160" rx="140" ry="100" />
        <ellipse cx="200" cy="160" rx="110" ry="78" />
        <ellipse cx="200" cy="160" rx="80" ry="56" />
        {/* Central beacon dot */}
        <circle cx="200" cy="160" r="12" className="fill-emergency-500/20 stroke-emergency-500/30" strokeWidth="1.5" />
        <circle cx="200" cy="160" r="6" className="fill-emergency-500/40" />
      </svg>
    </div>
  );
}
