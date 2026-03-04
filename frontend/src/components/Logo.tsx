export default function Logo() {
  return (
    <div className="w-24 h-24 mx-auto mb-8 flex items-center justify-center relative">
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1 justify-center" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="w-1 bg-[#d92323] rounded-full opacity-80"
            style={{
              height: 8 + i * 2,
              transform: `rotate(${-15 + i * 7.5}deg)`,
              transformOrigin: 'bottom center',
            }}
          />
        ))}
      </div>
      <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-lg" aria-hidden>
        <defs>
          <filter id="logo-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
          </filter>
        </defs>
        <g filter="url(#logo-shadow)">
          <path
            d="M32 12c-6.627 0-12 5.373-12 12 0 10 12 24 12 24s12-14 12-24c0-6.627-5.373-12-12-12z"
            fill="#d92323"
            stroke="#b81e1e"
            strokeWidth="1.5"
          />
          <path
            d="M34 24l-6 10h4l-3 12 9-14h-5l7-8z"
            fill="#f59e0b"
            stroke="#d97706"
            strokeWidth="0.5"
          />
          <path
            d="M16 32a4 4 0 01-4-4 4 4 0 014-4"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 32a8 8 0 01-8-8 8 8 0 018-8"
            fill="none"
            stroke="#2563eb"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M8 32a12 12 0 01-12-12 12 12 0 0112-12"
            fill="none"
            stroke="#2563eb"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M48 32a4 4 0 004-4 4 4 0 00-4-4"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M52 32a8 8 0 008-8 8 8 0 00-8-8"
            fill="none"
            stroke="#2563eb"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M56 32a12 12 0 0012-12 12 12 0 00-12-12"
            fill="none"
            stroke="#2563eb"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.5"
          />
        </g>
      </svg>
    </div>
  )
}
