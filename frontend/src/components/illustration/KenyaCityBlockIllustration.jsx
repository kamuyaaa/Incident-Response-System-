/**
 * Kenya city block illustration — roads, buildings, incident pins.
 */
export function KenyaCityBlockIllustration() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-ers-surface via-ers-subtle/90 to-ers-elevated" />
      <svg viewBox="0 0 720 420" className="absolute inset-0 w-full h-full" fill="none">
        {/* Roads (cross) */}
        <rect x="120" y="195" width="480" height="46" rx="18" fill="rgba(120,113,108,0.14)" />
        <rect x="337" y="90" width="46" height="260" rx="18" fill="rgba(120,113,108,0.14)" />
        <circle cx="360" cy="218" r="34" fill="rgba(239,235,230,0.95)" stroke="rgba(120,113,108,0.14)" />

        {/* Buildings */}
        <rect x="170" y="120" width="130" height="110" rx="22" fill="rgba(229,57,53,0.10)" stroke="rgba(229,57,53,0.16)" />
        <rect x="430" y="120" width="140" height="90" rx="22" fill="rgba(217,119,6,0.10)" stroke="rgba(217,119,6,0.16)" />
        <rect x="165" y="265" width="150" height="110" rx="22" fill="rgba(15,118,110,0.10)" stroke="rgba(15,118,110,0.16)" />
        <rect x="430" y="250" width="140" height="130" rx="22" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.14)" />

        {/* Green spot */}
        <rect x="585" y="300" width="70" height="58" rx="18" fill="rgba(16,185,129,0.10)" stroke="rgba(16,185,129,0.14)" />

        {/* Incident pins */}
        <g>
          <circle cx="450" cy="250" r="16" fill="rgba(229,57,53,0.18)" />
          <circle cx="450" cy="250" r="7" fill="rgba(229,57,53,0.55)" />
          <circle cx="250" cy="290" r="16" fill="rgba(14,165,233,0.16)" />
          <circle cx="250" cy="290" r="7" fill="rgba(14,165,233,0.55)" />
          <circle cx="520" cy="210" r="16" fill="rgba(217,119,6,0.16)" />
          <circle cx="520" cy="210" r="7" fill="rgba(217,119,6,0.55)" />
        </g>
      </svg>
    </div>
  );
}

