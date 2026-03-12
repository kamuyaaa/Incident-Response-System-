/**
 * Hospital/emergency cluster illustration — infrastructure + readiness.
 */
export function HospitalClusterIllustration() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-ers-surface via-ers-subtle/90 to-ers-elevated" />
      <svg viewBox="0 0 720 420" className="absolute inset-0 w-full h-full" fill="none">
        {/* Base platform */}
        <path
          d="M 120 310 C 240 260 480 260 600 310 L 600 360 C 480 400 240 400 120 360 Z"
          fill="rgba(239,235,230,0.95)"
          stroke="rgba(120,113,108,0.16)"
        />

        {/* Main hospital */}
        <rect x="280" y="120" width="180" height="170" rx="22" fill="rgba(229,57,53,0.10)" stroke="rgba(229,57,53,0.18)" />
        <rect x="300" y="140" width="140" height="130" rx="18" fill="rgba(255,255,255,0.65)" stroke="rgba(120,113,108,0.12)" />
        {/* Windows */}
        <g fill="rgba(15,118,110,0.10)">
          {Array.from({ length: 4 }).map((_, r) =>
            Array.from({ length: 5 }).map((_, c) => (
              <rect key={`${r}-${c}`} x={315 + c * 24} y={160 + r * 22} width="14" height="14" rx="4" />
            ))
          )}
        </g>
        {/* Cross */}
        <g transform="translate(370 210)">
          <rect x="-10" y="-34" width="20" height="68" rx="6" fill="rgba(229,57,53,0.75)" />
          <rect x="-34" y="-10" width="68" height="20" rx="6" fill="rgba(229,57,53,0.75)" />
        </g>

        {/* ER wing */}
        <rect x="170" y="190" width="140" height="100" rx="20" fill="rgba(15,118,110,0.10)" stroke="rgba(15,118,110,0.18)" />
        <rect x="190" y="210" width="100" height="26" rx="13" fill="rgba(15,118,110,0.18)" />

        {/* Ambulance bay + vehicles */}
        <rect x="170" y="310" width="220" height="36" rx="18" fill="rgba(28,25,23,0.05)" />
        <rect x="190" y="312" width="84" height="32" rx="16" fill="rgba(255,255,255,0.75)" stroke="rgba(229,57,53,0.18)" />
        <rect x="290" y="312" width="84" height="32" rx="16" fill="rgba(255,255,255,0.75)" stroke="rgba(16,185,129,0.18)" />

        {/* Beacon */}
        <g transform="translate(560 140)">
          <circle cx="0" cy="0" r="10" fill="rgba(229,57,53,0.35)" />
          <circle cx="0" cy="0" r="24" stroke="rgba(229,57,53,0.16)" strokeWidth="2" />
          <circle cx="0" cy="0" r="44" stroke="rgba(229,57,53,0.10)" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

