const W = 640
const H = 280
const PAD = { top: 20, right: 16, bottom: 34, left: 40 }

function scaleX(i, count) {
  const span = W - PAD.left - PAD.right
  return PAD.left + (count === 1 ? span / 2 : (i / (count - 1)) * span)
}

function scaleY(value, min, max) {
  const span = H - PAD.top - PAD.bottom
  const ratio = (value - min) / (max - min || 1)
  return H - PAD.bottom - ratio * span
}

export default function LineChart({ years, series, yMin, yMax, unit = '' }) {
  const allValues = series.flatMap((s) => s.values.filter((v) => v != null))
  const min = yMin ?? Math.floor(Math.min(...allValues) - 10)
  const max = yMax ?? Math.ceil(Math.max(...allValues) + 10)
  const gridLines = 4
  const gridStep = (max - min) / gridLines

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="גרף מגמה לאורך שנים">
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const value = min + gridStep * i
          const y = scaleY(value, min, max)
          return (
            <g key={i}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="#2a2f3a" strokeWidth="1" />
              <text x={PAD.left - 8} y={y + 4} fontSize="10" fill="#9ca3af" textAnchor="end">
                {Math.round(value)}
                {unit}
              </text>
            </g>
          )
        })}

        {years.map((yr, i) => (
          <text key={yr} x={scaleX(i, years.length)} y={H - PAD.bottom + 18} fontSize="10" fill="#9ca3af" textAnchor="middle">
            {yr}
          </text>
        ))}

        {series.map((s) => {
          if (s.refLine) {
            const refValue = s.values.find((v) => v != null)
            if (refValue == null) return null
            const y = scaleY(refValue, min, max)
            return (
              <g key={s.label}>
                <line
                  x1={PAD.left}
                  x2={W - PAD.right}
                  y1={y}
                  y2={y}
                  stroke={s.color}
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  opacity="0.85"
                />
                <text x={W - PAD.right - 4} y={y - 6} fontSize="10" fill={s.color} textAnchor="end">
                  {s.label} ({refValue})
                </text>
              </g>
            )
          }

          const points = s.values
            .map((v, i) => (v == null ? null : `${scaleX(i, years.length)},${scaleY(v, min, max)}`))
            .filter(Boolean)
            .join(' ')
          return (
            <g key={s.label}>
              <polyline
                points={points}
                fill="none"
                stroke={s.color}
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray={s.dashed ? '6 4' : undefined}
              />
              {s.values.map((v, i) => {
                if (v == null) return null
                const flagged = s.flaggedYears?.includes(years[i])
                return (
                  <circle
                    key={i}
                    cx={scaleX(i, years.length)}
                    cy={scaleY(v, min, max)}
                    r={flagged ? 4.5 : 3.5}
                    fill={flagged ? 'var(--bg, #12151c)' : s.color}
                    stroke={s.color}
                    strokeWidth={flagged ? 2 : 0}
                  />
                )
              })}
            </g>
          )
        })}
      </svg>
      <div className="dash-legend" style={{ marginTop: 4, marginBottom: 0 }}>
        {series.map((s) => (
          <span key={s.label}>
            <i style={{ background: s.color, opacity: s.dashed || s.refLine ? 0.55 : 1, borderRadius: s.dashed || s.refLine ? 0 : undefined }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  )
}
