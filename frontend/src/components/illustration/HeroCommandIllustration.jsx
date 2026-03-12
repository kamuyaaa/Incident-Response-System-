/**
 * Premium hero illustration (2D SVG) — command/dispatch motif.
 * Designed to replace the hero 3D panel when WebGL is unreliable.
 */
export function HeroCommandIllustration() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-ers-surface via-ers-subtle/90 to-ers-elevated" />

      <svg
        viewBox="0 0 720 520"
        className="absolute inset-0 w-full h-full"
        fill="none"
      >
        {/* Soft grid */}
        <g stroke="rgba(120,113,108,0.12)" strokeWidth="1">
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`h${i}`} x1="60" y1={80 + i * 38} x2="660" y2={80 + i * 38} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`v${i}`} x1={80 + i * 50} y1="70" x2={80 + i * 50} y2="450" />
          ))}
        </g>

        {/* Desk surface */}
        <path
          d="M 120 390 C 220 350 500 350 600 390 L 600 430 C 500 465 220 465 120 430 Z"
          fill="rgba(239,235,230,0.9)"
          stroke="rgba(120,113,108,0.18)"
        />

        {/* Main screen */}
        <rect x="110" y="140" width="250" height="170" rx="22" fill="rgba(28,25,23,0.06)" stroke="rgba(28,25,23,0.12)" />
        <rect x="130" y="160" width="210" height="130" rx="16" fill="rgba(14,165,233,0.12)" stroke="rgba(14,165,233,0.18)" />
        {/* Screen highlights */}
        <path d="M150 190 H320" stroke="rgba(28,25,23,0.18)" strokeWidth="10" strokeLinecap="round" />
        <path d="M150 220 H300" stroke="rgba(28,25,23,0.12)" strokeWidth="10" strokeLinecap="round" />
        <path d="M150 250 H280" stroke="rgba(28,25,23,0.10)" strokeWidth="10" strokeLinecap="round" />

        {/* City block cards */}
        <g>
          <rect x="410" y="150" width="210" height="90" rx="18" fill="rgba(229,57,53,0.08)" stroke="rgba(229,57,53,0.16)" />
          <rect x="410" y="260" width="210" height="90" rx="18" fill="rgba(15,118,110,0.08)" stroke="rgba(15,118,110,0.16)" />
          <rect x="410" y="370" width="210" height="60" rx="18" fill="rgba(217,119,6,0.08)" stroke="rgba(217,119,6,0.16)" />
          <circle cx="440" cy="195" r="10" fill="rgba(229,57,53,0.55)" />
          <circle cx="440" cy="305" r="10" fill="rgba(15,118,110,0.55)" />
          <circle cx="440" cy="400" r="10" fill="rgba(217,119,6,0.55)" />
        </g>

        {/* Beacon / signal arcs */}
        <g transform="translate(360 120)">
          <circle cx="0" cy="0" r="10" fill="rgba(229,57,53,0.35)" />
          <circle cx="0" cy="0" r="22" stroke="rgba(229,57,53,0.18)" strokeWidth="2" />
          <circle cx="0" cy="0" r="42" stroke="rgba(229,57,53,0.12)" strokeWidth="2" />
          <circle cx="0" cy="0" r="66" stroke="rgba(229,57,53,0.08)" strokeWidth="2" />
        </g>

        {/* Vehicle trio pills */}
        <g>
          <rect x="150" y="410" width="120" height="26" rx="13" fill="rgba(229,57,53,0.10)" />
          <rect x="300" y="410" width="120" height="26" rx="13" fill="rgba(15,118,110,0.10)" />
          <rect x="450" y="410" width="120" height="26" rx="13" fill="rgba(37,99,235,0.10)" />
          <circle cx="165" cy="423" r="6" fill="rgba(229,57,53,0.55)" />
          <circle cx="315" cy="423" r="6" fill="rgba(15,118,110,0.55)" />
          <circle cx="465" cy="423" r="6" fill="rgba(37,99,235,0.55)" />
        </g>
      </svg>
    </div>
  );
}

