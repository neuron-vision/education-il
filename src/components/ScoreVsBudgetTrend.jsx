import { useState } from 'react'
import SourceList from './SourceList.jsx'

const W = 720
const H = 320
const PAD = { top: 20, right: 50, bottom: 34, left: 50 }

const COLOR_SCORE = '#3987e5'
const COLOR_BUDGET = '#199e70'

function buildYearAxis(scoreSeries, budgetSeries) {
  return Array.from(
    new Set([...scoreSeries.map((d) => d.year), ...budgetSeries.map((d) => d.year)])
  ).sort((a, b) => a - b)
}

function niceRange(values, padFrac = 0.1) {
  const present = values.filter((v) => v != null)
  const min = Math.min(...present)
  const max = Math.max(...present)
  const pad = (max - min || max || 1) * padFrac
  return { min: min - pad, max: max + pad }
}

// ממלא שנים ללא ציון מבחן בפועל בערך משוער באמצעות אינטרפולציה לינארית בין שתי שנות מבחן סמוכות.
function interpolateScores(years, scoreByYear) {
  const testYears = years.filter((y) => scoreByYear.has(y))
  return years.map((y) => {
    if (scoreByYear.has(y)) return { value: scoreByYear.get(y), isActual: true }
    const before = [...testYears].reverse().find((ty) => ty < y)
    const after = testYears.find((ty) => ty > y)
    if (before == null || after == null) return { value: null, isActual: false }
    const vBefore = scoreByYear.get(before)
    const vAfter = scoreByYear.get(after)
    const ratio = (y - before) / (after - before)
    return { value: vBefore + (vAfter - vBefore) * ratio, isActual: false }
  })
}

export default function ScoreVsBudgetTrend({ scoreData, budgetData, sources }) {
  const [hoverIdx, setHoverIdx] = useState(null)

  const years = buildYearAxis(scoreData, budgetData)
  const scoreByYear = new Map(scoreData.map((d) => [d.year, d.meanScore]))
  const budgetByYear = new Map(budgetData.map((d) => [d.year, d.budgetPerCapitaNis]))

  const interpolatedScores = interpolateScores(years, scoreByYear)
  const scoreValues = interpolatedScores.map((d) => d.value)
  const budgetValues = years.map((y) => budgetByYear.get(y) ?? null)

  const scoreRange = niceRange(scoreValues)
  const budgetRange = niceRange(budgetValues)

  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const n = years.length

  const scaleX = (i) => PAD.left + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW)
  const scaleScoreY = (v) => PAD.top + plotH - ((v - scoreRange.min) / (scoreRange.max - scoreRange.min || 1)) * plotH
  const scaleBudgetY = (v) => PAD.top + plotH - ((v - budgetRange.min) / (budgetRange.max - budgetRange.min || 1)) * plotH

  const gridLines = 4
  const scoreGridStep = (scoreRange.max - scoreRange.min) / gridLines

  const scorePoints = scoreValues
    .map((v, i) => (v == null ? null : `${scaleX(i)},${scaleScoreY(v)}`))
    .filter(Boolean)
    .join(' ')
  const budgetPoints = budgetValues
    .map((v, i) => (v == null ? null : `${scaleX(i)},${scaleBudgetY(v)}`))
    .filter(Boolean)
    .join(' ')

  const hoverYear = hoverIdx != null ? years[hoverIdx] : null
  const hoverScore = hoverIdx != null ? scoreValues[hoverIdx] : null
  const hoverScoreIsActual = hoverIdx != null ? interpolatedScores[hoverIdx]?.isActual : false
  const hoverBudget = hoverIdx != null ? budgetValues[hoverIdx] : null

  return (
    <div className="score-budget-trend">
      <div className="dash-card">
        <div className="chart-wrap">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label="תרשים דו-צירי: ציון PISA ממוצע (ציר שמאל) מול תקציב משרד החינוך לנפש בש״ח (ציר ימין), לאורך שנים"
          >
            {Array.from({ length: gridLines + 1 }).map((_, i) => {
              const value = scoreRange.min + scoreGridStep * i
              const y = scaleScoreY(value)
              return (
                <g key={i}>
                  <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="#2a2f3a" strokeWidth="1" />
                  <text x={PAD.left - 8} y={y + 4} fontSize="10.5" fill={COLOR_SCORE} textAnchor="end">
                    {Math.round(value)}
                  </text>
                </g>
              )
            })}

            {Array.from({ length: gridLines + 1 }).map((_, i) => {
              const value = budgetRange.min + ((budgetRange.max - budgetRange.min) / gridLines) * i
              const y = PAD.top + plotH - (i / gridLines) * plotH
              return (
                <text key={i} x={W - PAD.right + 8} y={y + 4} fontSize="10.5" fill={COLOR_BUDGET} textAnchor="start">
                  {Math.round(value)}
                </text>
              )
            })}

            {years.map((yr, i) => (
              <text key={yr} x={scaleX(i)} y={H - PAD.bottom + 18} fontSize="10.5" fill="#9ca3af" textAnchor="middle">
                {yr}
              </text>
            ))}

            <polyline points={budgetPoints} fill="none" stroke={COLOR_BUDGET} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="6 4" />
            {budgetValues.map((v, i) =>
              v == null ? null : (
                <circle key={`b${i}`} cx={scaleX(i)} cy={scaleBudgetY(v)} r={hoverIdx === i ? 5 : 3.5} fill={COLOR_BUDGET} />
              )
            )}

            <polyline points={scorePoints} fill="none" stroke={COLOR_SCORE} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {interpolatedScores.map((d, i) =>
              d.value == null ? null : (
                <circle
                  key={`s${i}`}
                  cx={scaleX(i)}
                  cy={scaleScoreY(d.value)}
                  r={hoverIdx === i ? 5 : d.isActual ? 3.5 : 2}
                  fill={COLOR_SCORE}
                  opacity={d.isActual ? 1 : 0.5}
                />
              )
            )}

            {years.map((yr, i) => (
              <rect
                key={`hit${yr}`}
                x={scaleX(i) - (plotW / Math.max(n - 1, 1)) / 2}
                y={PAD.top}
                width={plotW / Math.max(n - 1, 1)}
                height={plotH}
                fill="transparent"
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx((cur) => (cur === i ? null : cur))}
                onFocus={() => setHoverIdx(i)}
                onBlur={() => setHoverIdx((cur) => (cur === i ? null : cur))}
                tabIndex={0}
                style={{ cursor: 'pointer', outline: 'none' }}
              />
            ))}

            {hoverIdx != null && (
              <g pointerEvents="none">
                <line x1={scaleX(hoverIdx)} x2={scaleX(hoverIdx)} y1={PAD.top} y2={PAD.top + plotH} stroke="#6b7280" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                {(() => {
                  const x = scaleX(hoverIdx)
                  const boxW = 170
                  const boxH = 58
                  const flip = x + 12 + boxW > W - PAD.right
                  const boxX = flip ? x - 12 - boxW : x + 12
                  const boxY = PAD.top + 6
                  return (
                    <g>
                      <rect x={boxX} y={boxY} width={boxW} height={boxH} rx="6" fill="#1b1f27" stroke="#2a2f3a" />
                      <text x={boxX + 12} y={boxY + 18} fontSize="12" fill="#eceef2" fontWeight="700">
                        {hoverYear}
                      </text>
                      <text x={boxX + 12} y={boxY + 35} fontSize="11" fill={COLOR_SCORE}>
                        ציון ממוצע: {hoverScore != null ? hoverScore.toFixed(1) : '—'}
                        {hoverScore != null && !hoverScoreIsActual ? ' (משוער)' : ''}
                      </text>
                      <text x={boxX + 12} y={boxY + 50} fontSize="11" fill={COLOR_BUDGET}>
                        תקציב לנפש: {hoverBudget != null ? `${hoverBudget.toLocaleString()}₪` : '—'}
                      </text>
                    </g>
                  )
                })()}
              </g>
            )}
          </svg>
        </div>

        <div className="dash-legend" style={{ marginTop: 6 }}>
          <span>
            <i style={{ background: COLOR_SCORE }} />
            ציון PISA ממוצע (ציר שמאל)
          </span>
          <span>
            <i style={{ background: COLOR_BUDGET, opacity: 0.7 }} />
            תקציב משרד החינוך לנפש, ש״ח (ציר ימין, מקווקו)
          </span>
        </div>
      </div>

      <div className="callout" style={{ marginTop: 14 }}>
        <b>אזהרת מתודולוגיה:</b> זהו תרשים דו-צירי (שתי סקאלות Y נפרדות על אותו גרף) — יישור הסקאלות שרירותי, ולכן
        קרבה חזותית בין הקווים <b>אינה מעידה על קשר סיבתי או קורלציה אמיתית</b> בין תקציב לציון. התקציב מוצג כאן
        <b> מנורמל לנפש</b> (תקציב כולל חלקי אומדן אוכלוסיית ישראל אותה שנה, הלמ"ס) כדי לנטרל את השפעת הגידול
        הטבעי באוכלוסייה על מגמת התקציב הכולל — התקציב לנפש גדל בעקביות לאורך התקופה בעוד ציוני PISA עלו וירדו —
        ראו סעיף "האם כסף = הישגים?" למעלה לניתוח הקשר בפועל. נתוני תקציב חלקיים: מכוסות רק שנים עם מקור מאומת;
        שנים חסרות (למשל 2006–2010, 2012–2014, 2017–2018) לא אותרו במחקר זה. חלק מהערכים הם תקציב מאושר וחלק
        ביצוע בפועל — ראו הערות במקור הנתונים. ציון PISA נמדד רק אחת לשלוש שנים; הנקודות המלאות בקו הציון הן
        תוצאות מבחן בפועל, והקו בין שנות מבחן הוא אינטרפולציה לינארית (סימון עמום) לצורך המחשה בלבד — אין מבחן
        שנתי בפועל.
      </div>

      {sources && <SourceList sources={sources} />}
    </div>
  )
}
