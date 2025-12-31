export function LegacyPiLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg" fill="none">
      {/* Outer circle - Pi Network purple */}
      <circle cx="100" cy="100" r="90" stroke="#6B21A8" strokeWidth="3" opacity="0.4" />

      {/* Inner circle - Pi Network purple */}
      <circle cx="100" cy="100" r="70" stroke="#7C3AED" strokeWidth="2" opacity="0.6" />

      {/* Lock body - representing security until 2030 */}
      <rect x="80" y="95" width="40" height="35" rx="4" fill="#7C3AED" stroke="#6B21A8" strokeWidth="2" />

      {/* Lock shackle */}
      <path
        d="M85 95 L85 80 Q85 65, 100 65 Q115 65, 115 80 L115 95"
        stroke="#6B21A8"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Red heart in center of lock */}
      <path
        d="M100 125 C92 118, 92 110, 96 107 C98 105, 99 105, 100 106 C101 105, 102 105, 104 107 C108 110, 108 118, 100 125 Z"
        fill="#EF4444"
        stroke="#DC2626"
        strokeWidth="1"
      />

      {/* Pi symbol (π) at the top */}
      <g transform="translate(100, 50)">
        <path
          d="M-15 0 L-15 -15 L15 -15 L15 0 M-8 -15 L-8 8 M8 -15 L8 8"
          stroke="#FCD34D"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Golden accent circle */}
      <circle cx="100" cy="100" r="55" stroke="#FCD34D" strokeWidth="1" opacity="0.3" />
    </svg>
  )
}
