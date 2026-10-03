interface BalanceGaugeProps {
  percentage: number
  size?: number
  strokeWidth?: number
  label?: string
}

export function BalanceGauge({
  percentage,
  size = 200,
  strokeWidth = 16,
  label = 'Stage of Extraction',
}: BalanceGaugeProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  // Only show 75% of the circle (top arc)
  const arcLength = circumference * 0.75
  const offset = arcLength - (percentage / 100) * arcLength
  const startAngle = 135 // degrees

  const getColor = (pct: number) => {
    if (pct < 70) return '#2d6a4f'
    if (pct < 90) return '#e9c46a'
    if (pct < 100) return '#f4a261'
    return '#e63946'
  }

  const color = getColor(percentage)

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label}: ${percentage.toFixed(2)}%`}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: `rotate(${startAngle}deg)` }}
        aria-hidden="true"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease',
            filter: `drop-shadow(0 0 8px ${color}80)`,
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white font-heading" aria-hidden="true">
          {percentage.toFixed(1)}%
        </span>
        <span className="text-xs text-white/60 text-center mt-1 max-w-[120px] leading-tight">
          {label}
        </span>
      </div>
    </div>
  )
}
