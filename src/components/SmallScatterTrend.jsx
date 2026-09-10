import { useMemo, useState } from 'react'

const W = 700
const H = 360
const PAD = { top: 24, right: 20, bottom: 90, left: 46 }

const COLOR_SCORE = '#3987e5'
const COLOR_ISRAEL = '#e66767'
const COLOR_REF = '#f5a623'

// תרשים פיזור קטן: ציר X = מדינות ממוינות לפי xKey, ציר Y = ציון PISA.
// מיועד לטבלאות קטנות (4-8 מדינות) שאינן מספיקות לקו רגרסיה אמין.
export default function SmallScatterTrend({ data, xKey, xLabel, yLabel, ariaLabel, highlightCode = 'ISR', refCode = 'OECD' }) {
  const [hoverIdx, setHoverIdx] = useState(null)

  const sorted = useMemo(
    () => [...data].sort((a, b) => a[xKey] - b[xKey]),
    [data, xKey]
  )

  const scoreMin = Math.floor(Math.min(...sorted.map((d) => d.meanScore)) / 10) * 10 - 10
  const scoreMax = Math.ceil(Math.max(...sorted.map((d) => d.meanScore)) / 10) * 10 + 10

  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const n = sorted.length

  const scaleX = (i) => PAD.left + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW)
  const scaleY = (score) => PAD.top + plotH - ((score - scoreMin) / (scoreMax - scoreMin)) * plotH

  const gridLines = 5
  const gridStep = (scoreMax - scoreMin) / gridLines
  const hovered = hoverIdx != null ? sorted[hoverIdx] : null

  return (
    <div className="chart-wrap money-trend-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel}>
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const value = scoreMin + gridStep * i
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

        {sorted.map((d, i) => {
          const x = scaleX(i)
          const y = scaleY(d.meanScore)
          const isIsrael = d.code === highlightCode
          const isRef = d.code === refCode
          const isHovered = hoverIdx === i
          const color = isIsrael ? COLOR_ISRAEL : isRef ? COLOR_REF : COLOR_SCORE
          return (
            <g
              key={d.code}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx((cur) => (cur === i ? null : cur))}
              onFocus={() => setHoverIdx(i)}
              onBlur={() => setHoverIdx((cur) => (cur === i ? null : cur))}
              tabIndex={0}
              style={{ cursor: 'pointer', outline: 'none' }}
            >
              <rect x={x - 14} y={PAD.top} width={28} height={plotH} fill="transparent" />
              <line x1={x} x2={x} y1={PAD.top + plotH} y2={PAD.top + plotH + 6} stroke="#2a2f3a" strokeWidth="1" />
              <text
                x={x}
                y={PAD.top + plotH + 14}
                fontSize={isIsrael || isRef ? '11' : '10'}
                fill={color === COLOR_SCORE ? '#9ca3af' : color}
                fontWeight={isIsrael || isRef ? 700 : 400}
                textAnchor="end"
                transform={`rotate(-90, ${x}, ${PAD.top + plotH + 14})`}
              >
                {d.country} · {d[xKey] ?? '—'}
              </text>
              <circle
                cx={x}
                cy={y}
                r={isIsrael ? 6 : isHovered ? 5.5 : 4}
                fill={color}
                stroke="var(--bg, #12151a)"
                strokeWidth={isHovered || isIsrael ? 2 : 1}
              />
            </g>
          )
        })}

        {hovered && (
          <g pointerEvents="none">
            {(() => {
              const x = scaleX(hoverIdx)
              const y = scaleY(hovered.meanScore)
              const boxW = 190
              const boxH = 58
              const flip = x + 12 + boxW > W - PAD.right
              const boxX = flip ? x - 12 - boxW : x + 12
              const boxY = Math.max(PAD.top, Math.min(y - boxH / 2, PAD.top + plotH - boxH))
              return (
                <g>
                  <rect x={boxX} y={boxY} width={boxW} height={boxH} rx="6" fill="#1b1f27" stroke="#2a2f3a" />
                  <text x={boxX + 12} y={boxY + 20} fontSize="12" fill="#eceef2" fontWeight="700">
                    {hovered.country}
                  </text>
                  <text x={boxX + 12} y={boxY + 37} fontSize="11" fill="#9ca3af">
                    {xLabel}: {hovered[xKey] ?? hovered.note ?? '—'}
                  </text>
                  <text x={boxX + 12} y={boxY + 52} fontSize="11" fill="#9ca3af">
                    ציון PISA ממוצע: {hovered.meanScore}
                  </text>
                </g>
              )
            })()}
          </g>
        )}
      </svg>

      <div className="dash-legend" style={{ marginTop: 6 }}>
        <span>
          <i style={{ background: COLOR_SCORE }} />
          ציון PISA ממוצע
        </span>
        <span>
          <i style={{ background: COLOR_ISRAEL }} />
          ישראל
        </span>
        <span>
          <i style={{ background: COLOR_REF }} />
          ממוצע OECD
        </span>
      </div>
      <p className="dash-section-note" style={{ marginTop: 4 }}>
        ציר X: {xLabel}, ממוין עולה. ציר Y: {yLabel}. מספר מדינות מוגבל — אין קו רגרסיה מהימן על מדגם כה קטן.
      </p>
    </div>
  )
}
