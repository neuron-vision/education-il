import { useMemo, useState } from 'react'

const W = 1000
const H = 460
const PAD = { top: 20, right: 24, bottom: 96, left: 44 }
const EVENT_LANE_H = 30
const EVENT_LANES = 2

function niceYearTicks(minYear, maxYear, targetCount = 9) {
  const span = maxYear - minYear
  if (span <= 0) return [minYear]
  const rawStep = span / targetCount
  const steps = [1, 2, 5, 10, 20, 25, 50]
  const step = steps.find((s) => s >= rawStep) ?? steps[steps.length - 1]
  const start = Math.ceil(minYear / step) * step
  const ticks = []
  for (let y = start; y <= maxYear; y += step) ticks.push(y)
  if (ticks[0] !== minYear) ticks.unshift(minYear)
  if (ticks[ticks.length - 1] !== maxYear) ticks.push(maxYear)
  return ticks
}

export default function TimelineChart({ series, events, activeKeys, minYear, maxYear }) {
  const scaleX = (year) => {
    const span = W - PAD.left - PAD.right
    return PAD.left + ((year - minYear) / (maxYear - minYear || 1)) * span
  }

  const activeSeries = series.filter((s) => activeKeys.includes(s.key))
  const allValues = activeSeries.flatMap((s) => s.points.map((p) => p.value))
  const vMin = allValues.length ? Math.floor(Math.min(...allValues) - 8) : 0
  const vMax = allValues.length ? Math.ceil(Math.max(...allValues) + 8) : 100

  const scaleY = (value) => {
    const span = H - PAD.top - PAD.bottom
    const ratio = (value - vMin) / (vMax - vMin || 1)
    return H - PAD.bottom - ratio * span
  }

  const yTicks = niceYearTicks(minYear, maxYear)
  const gridLines = 4
  const gridStep = (vMax - vMin) / gridLines

  // Assign events to alternating lanes by x-proximity to reduce label overlap.
  const laidOutEvents = useMemo(() => {
    const sorted = [...events].sort((a, b) => a.year - b.year)
    let lastX = -Infinity
    let lane = 0
    return sorted.map((e) => {
      const x = scaleX(e.year)
      if (x - lastX < 90) {
        lane = (lane + 1) % EVENT_LANES
      } else {
        lane = 0
      }
      lastX = x
      return { ...e, x, lane }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, minYear, maxYear])

  const [hoveredEvent, setHoveredEvent] = useState(null)

  return (
    <div className="chart-wrap timeline-chart-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="ציר זמן מגמות ואירועים">
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const value = vMin + gridStep * i
          const y = scaleY(value)
          return (
            <g key={i}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="#2a2f3a" strokeWidth="1" />
              <text x={PAD.left - 8} y={y + 4} fontSize="11" fill="#9ca3af" textAnchor="end">
                {Math.round(value)}
              </text>
            </g>
          )
        })}

        {yTicks.map((yr) => (
          <g key={yr}>
            <line
              x1={scaleX(yr)}
              x2={scaleX(yr)}
              y1={PAD.top}
              y2={H - PAD.bottom}
              stroke="#20242d"
              strokeWidth="1"
            />
            <text x={scaleX(yr)} y={H - PAD.bottom + 16} fontSize="11" fill="#9ca3af" textAnchor="middle">
              {yr}
            </text>
          </g>
        ))}

        {activeSeries.map((s) => {
          const pts = s.points
            .filter((p) => p.year >= minYear && p.year <= maxYear)
            .map((p) => `${scaleX(p.year)},${scaleY(p.value)}`)
            .join(' ')
          return (
            <g key={s.key}>
              <polyline
                points={pts}
                fill="none"
                stroke={s.color}
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray={s.dashed ? '6 4' : undefined}
              />
              {s.points
                .filter((p) => p.year >= minYear && p.year <= maxYear)
                .map((p) => (
                  <circle key={p.year} cx={scaleX(p.year)} cy={scaleY(p.value)} r="3.5" fill={s.color} />
                ))}
            </g>
          )
        })}

        {laidOutEvents.map((e, i) => {
          const laneY = H - PAD.bottom + 34 + e.lane * EVENT_LANE_H
          const isHovered = hoveredEvent === i
          return (
            <g
              key={`${e.year}-${e.label}`}
              onMouseEnter={() => setHoveredEvent(i)}
              onMouseLeave={() => setHoveredEvent(null)}
              style={{ cursor: 'pointer' }}
            >
              <line
                x1={e.x}
                x2={e.x}
                y1={PAD.top}
                y2={laneY - 6}
                stroke={e.color}
                strokeWidth={isHovered ? 2 : 1}
                strokeDasharray="3 3"
                opacity={isHovered ? 0.9 : 0.5}
              />
              <circle cx={e.x} cy={laneY} r={isHovered ? 5 : 4} fill={e.color} />
              <text
                x={e.x}
                y={laneY + 4}
                fontSize="10"
                fill={isHovered ? 'var(--text, #e5e7eb)' : '#9ca3af'}
                textAnchor="middle"
                fontWeight={isHovered ? 700 : 400}
              >
                ●
              </text>
              {isHovered && (
                <g>
                  <rect
                    x={Math.min(Math.max(e.x - 90, PAD.left), W - PAD.right - 180)}
                    y={laneY + 10}
                    width="180"
                    height="34"
                    rx="6"
                    fill="#12151c"
                    stroke={e.color}
                    strokeWidth="1"
                  />
                  <text
                    x={Math.min(Math.max(e.x, PAD.left + 90), W - PAD.right - 90)}
                    y={laneY + 24}
                    fontSize="10"
                    fill="var(--text, #e5e7eb)"
                    textAnchor="middle"
                  >
                    {Math.round(e.year)} · {e.label.length > 34 ? e.label.slice(0, 34) + '…' : e.label}
                  </text>
                  <text
                    x={Math.min(Math.max(e.x, PAD.left + 90), W - PAD.right - 90)}
                    y={laneY + 38}
                    fontSize="9"
                    fill={e.color}
                    textAnchor="middle"
                  >
                    {e.kindLabel}
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
