/**
 * Tracking showcase illustration — map, route, incident + responder markers.
 */
export function TrackingShowcaseIllustration() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-ers-surface via-ers-subtle/85 to-ers-elevated" />
      <svg viewBox="0 0 720 420" className="absolute inset-0 w-full h-full" fill="none">
        {/* Map tiles */}
        <g stroke="rgba(120,113,108,0.14)" strokeWidth="1">
          {Array.from({ length: 6 }).map((_, r) =>
            Array.from({ length: 10 }).map((_, c) => (
              <rect key={`${r}-${c}`} x={60 + c * 60} y={50 + r * 55} width="52" height="46" rx="10" />
            ))
          )}
        </g>

        {/* Route */}
        <path
          d="M 140 300 C 220 240 270 260 330 220 C 410 170 470 170 560 130"
          stroke="rgba(15,118,110,0.35)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 140 300 C 220 240 270 260 330 220 C 410 170 470 170 560 130"
          stroke="rgba(15,118,110,0.18)"
          strokeWidth="18"
          strokeLinecap="round"
        />

        {/* Incident marker */}
        <g transform="translate(560 130)">
          <circle cx="0" cy="0" r="24" fill="rgba(229,57,53,0.12)" />
          <path d="M0 -22 C14 -22 22 -14 22 0 C22 18 0 32 0 32 C0 32 -22 18 -22 0 C-22 -14 -14 -22 0 -22 Z" fill="rgba(229,57,53,0.65)" />
          <circle cx="0" cy="-2" r="7" fill="rgba(255,255,255,0.9)" />
        </g>

        {/* Responder marker */}
        <g transform="translate(140 300)">
          <circle cx="0" cy="0" r="22" fill="rgba(14,165,233,0.14)" />
          <rect x="-18" y="-12" width="36" height="24" rx="12" fill="rgba(14,165,233,0.55)" />
          <circle cx="0" cy="-12" r="8" fill="rgba(255,255,255,0.85)" />
        </g>

        {/* Legend chips */}
        <g>
          <rect x="60" y="28" width="150" height="28" rx="14" fill="rgba(229,57,53,0.08)" stroke="rgba(229,57,53,0.18)" />
          <circle cx="80" cy="42" r="6" fill="rgba(229,57,53,0.6)" />
          <rect x="220" y="28" width="170" height="28" rx="14" fill="rgba(14,165,233,0.08)" stroke="rgba(14,165,233,0.18)" />
          <circle cx="240" cy="42" r="6" fill="rgba(14,165,233,0.6)" />
        </g>
      </svg>
    </div>
  );
}

