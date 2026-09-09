import { useMemo, useState } from 'react'

const W = 900
const H = 420
const PAD = { top: 24, right: 20, bottom: 110, left: 46 }

const COLOR_SCORE = '#3987e5'
const COLOR_FIT = '#199e70'
const COLOR_ISRAEL = '#e66767'

function linearRegression(points) {
  const n = points.length
  const sumX = points.reduce((a, p) => a + p.x, 0)
  const sumY = points.reduce((a, p) => a + p.y, 0)
  const sumXY = points.reduce((a, p) => a + p.x * p.y, 0)
  const sumXX = points.reduce((a, p) => a + p.x * p.x, 0)
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  return { slope, intercept }
}

export default function TeacherSalaryVsScoreTrend({ data }) {
  const [hoverIdx, setHoverIdx] = useState(null)

  const sorted = useMemo(
    () =>
      [...data].sort(
        (a, b) => a.salaryUsdPpp - b.salaryUsdPpp || a.country.localeCompare(b.country, 'he')
      ),
    [data]
  )

  const { slope, intercept } = useMemo(
    () => linearRegression(sorted.map((d) => ({ x: d.salaryUsdPpp, y: d.meanScore }))),
    [sorted]
  )

  const scoreMin = Math.floor(Math.min(...sorted.map((d) => d.meanScore)) / 10) * 10 - 10
  const scoreMax = Math.ceil(Math.max(...sorted.map((d) => d.meanScore)) / 10) * 10 + 10

  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const n = sorted.length

  const scaleX = (i) => PAD.left + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW)
  const scaleY = (score) => PAD.top + plotH - ((score - scoreMin) / (scoreMax - scoreMin)) * plotH

  const fitPoints = [0, n - 1]
    .map((i) => `${scaleX(i)},${scaleY(slope * sorted[i].salaryUsdPpp + intercept)}`)
    .join(' ')

  const gridLines = 5
  const gridStep = (scoreMax - scoreMin) / gridLines

  const hovered = hoverIdx != null ? sorted[hoverIdx] : null

  return (
    <div className="chart-wrap money-trend-wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="תרשים: שכר מורים ממוצע מול ציון PISA ממוצע, ממוין לפי שכר, עם קו מגמה"
      >
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

        <polyline points={fitPoints} fill="none" stroke={COLOR_FIT} strokeWidth="2.5" strokeLinecap="round" />

        {sorted.map((d, i) => {
          const x = scaleX(i)
          const y = scaleY(d.meanScore)
          const isIsrael = d.code === 'ISR'
          const isHovered = hoverIdx === i
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
              <rect x={x - 10} y={PAD.top} width={20} height={plotH} fill="transparent" />
              <line
                x1={x}
                x2={x}
                y1={PAD.top + plotH}
                y2={PAD.top + plotH + 6}
                stroke="#2a2f3a"
                strokeWidth="1"
              />
              <text
                x={x}
                y={PAD.top + plotH + 14}
                fontSize={isIsrael ? '11' : '10'}
                fill={isIsrael ? COLOR_ISRAEL : '#9ca3af'}
                fontWeight={isIsrael ? 700 : 400}
                textAnchor="end"
                transform={`rotate(-90, ${x}, ${PAD.top + plotH + 14})`}
              >
                {d.country} · {d.salaryUsdPpp.toLocaleString()}$
              </text>
              <circle
                cx={x}
                cy={y}
                r={isIsrael ? 6 : isHovered ? 5.5 : 4}
                fill={isIsrael ? COLOR_ISRAEL : COLOR_SCORE}
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
                  <rect
                    x={boxX}
                    y={boxY}
                    width={boxW}
                    height={boxH}
                    rx="6"
                    fill="#1b1f27"
                    stroke="#2a2f3a"
                  />
                  <text x={boxX + 12} y={boxY + 20} fontSize="12" fill="#eceef2" fontWeight="700">
                    {hovered.country}
                  </text>
                  <text x={boxX + 12} y={boxY + 37} fontSize="11" fill="#9ca3af">
                    שכר ממוצע: {hovered.salaryUsdPpp.toLocaleString()}$ PPP
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
          ציון PISA ממוצע לפי מדינה
        </span>
        <span>
          <i style={{ background: COLOR_ISRAEL }} />
          ישראל
        </span>
        <span>
          <i style={{ background: COLOR_FIT, borderRadius: 0, height: 3 }} />
          קו מגמה (רגרסיה לינארית)
        </span>
      </div>
      <p className="dash-section-note" style={{ marginTop: 4 }}>
        ציר X: מדינות ממוינות לפי שכר מורה יסודי ממוצע (15 שנות ותק, $ PPP), עולה. ציר Y: ציון PISA 2022 ממוצע
        (מתמטיקה/קריאה/מדעים).
      </p>
    </div>
  )
}
