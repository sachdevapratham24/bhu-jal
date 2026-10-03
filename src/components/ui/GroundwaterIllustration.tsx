/** Animated groundwater depletion illustration for the Hero section */
export function GroundwaterIllustration() {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[220px] mx-auto opacity-80"
      aria-hidden="true"
    >
      {/* Ground layers */}
      <rect x="10" y="100" width="180" height="12" rx="4" fill="#1a7a8a" opacity="0.4" />
      <rect x="10" y="118" width="180" height="12" rx="4" fill="#0f4c5c" opacity="0.5" />
      <rect x="10" y="136" width="180" height="12" rx="4" fill="#0d3d4a" opacity="0.6" />
      <rect x="10" y="154" width="180" height="16" rx="4" fill="#071e26" opacity="0.8" />

      {/* Aquifer water - animated fill */}
      <rect x="20" y="156" width="160" height="10" rx="3" fill="#00b4d8" opacity="0.5">
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
      </rect>

      {/* Borewell pipe */}
      <rect x="94" y="40" width="12" height="70" rx="3" fill="#64748b" opacity="0.7" />
      {/* Pump head */}
      <ellipse cx="100" cy="40" rx="18" ry="8" fill="#00b4d8" opacity="0.8" />
      <rect x="92" y="32" width="16" height="10" rx="3" fill="#0284c7" />

      {/* Water droplets going up (extraction) */}
      <circle cx="100" cy="20" r="4" fill="#00b4d8" opacity="0.9">
        <animate attributeName="cy" values="70;10;10" dur="1.8s" repeatCount="indefinite" begin="0s" />
        <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" begin="0s" />
      </circle>
      <circle cx="100" cy="20" r="3" fill="#90e0ef" opacity="0.9">
        <animate attributeName="cy" values="70;10;10" dur="1.8s" repeatCount="indefinite" begin="0.6s" />
        <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" begin="0.6s" />
      </circle>
      <circle cx="100" cy="20" r="3.5" fill="#00b4d8" opacity="0.9">
        <animate attributeName="cy" values="70;10;10" dur="1.8s" repeatCount="indefinite" begin="1.2s" />
        <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" begin="1.2s" />
      </circle>

      {/* Rain drops (recharge) - falling */}
      {[30, 55, 145, 165].map((x, i) => (
        <g key={x}>
          <line x1={x} y1="0" x2={x - 3} y2="15" stroke="#90e0ef" strokeWidth="2" strokeLinecap="round" opacity="0.6">
            <animate attributeName="y1" values="0;90;0" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
            <animate attributeName="y2" values="15;105;15" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
            <animate attributeName="opacity" values="0;0.7;0" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
          </line>
        </g>
      ))}

      {/* Labels */}
      <text x="30" y="92" fontSize="9" fill="#90e0ef" fontFamily="sans-serif" opacity="0.8">Rain ↓</text>
      <text x="116" y="25" fontSize="9" fill="#f87171" fontFamily="sans-serif" opacity="0.9">Extract ↑</text>
      <text x="28" y="163" fontSize="8" fill="#00b4d8" fontFamily="sans-serif" opacity="0.7">Aquifer</text>
    </svg>
  )
}
