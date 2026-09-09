import { useMemo, useState } from 'react'
import TimelineChart from './components/TimelineChart.jsx'
import { TIMELINE_SERIES, TIMELINE_EVENTS, EVENT_KIND_LABELS, EVENT_KIND_COLORS } from './data/trendsData.js'
import './dashboard.css'
import './trends.css'

const ALL_SERIES_KEYS = TIMELINE_SERIES.map((s) => s.key)
const ALL_EVENT_KINDS = Object.keys(EVENT_KIND_LABELS)

export default function TrendsPage() {
  const [activeKeys, setActiveKeys] = useState(ALL_SERIES_KEYS)
  const [activeKinds, setActiveKinds] = useState(ALL_EVENT_KINDS)

  const toggleSeries = (key) => {
    setActiveKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const toggleKind = (kind) => {
    setActiveKinds((prev) =>
      prev.includes(kind) ? prev.filter((k) => k !== kind) : [...prev, kind]
    )
  }

  const years = TIMELINE_SERIES.flatMap((s) => s.points.map((p) => p.year)).concat(
    TIMELINE_EVENTS.map((e) => e.year)
  )
  const minYear = Math.floor(Math.min(...years))
  const maxYear = Math.ceil(Math.max(...years))

  const visibleEvents = useMemo(
    () =>
      TIMELINE_EVENTS.filter((e) => activeKinds.includes(e.kind)).map((e) => ({
        ...e,
        color: EVENT_KIND_COLORS[e.kind],
        kindLabel: EVENT_KIND_LABELS[e.kind],
      })),
    [activeKinds]
  )

  return (
    <div className="dash-root">
      <div className="dash-wrap">
        <header className="dash-header">
          <div className="dash-kicker">חינוך · מגמות ואירועים</div>
          <h1 className="dash-title">מגמות לאורך זמן — ציר אחד, כל הנתונים</h1>
          <p className="dash-sub">
            כל סדרות ההישגים על ציר שנים אחיד, עם אירועי מדיניות ומשברים מסומנים למטה — כדי לבחון קורלציות
            אפשריות בין רפורמות, משברים ותוצאות מבחנים. הפעילו/כבו סדרות ואירועים לפי הצורך.
          </p>
        </header>

        <section className="dash-section" id="trends">
          <div className="dash-section-head">
            <h2>ציר זמן משולב</h2>
            <span className="dash-section-note">
              {minYear}–{maxYear}
            </span>
          </div>

          <div className="trends-controls">
            <div className="trends-control-group">
              <span className="trends-control-label">סדרות:</span>
              <div className="trends-chip-row">
                {TIMELINE_SERIES.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    className={`trends-chip ${activeKeys.includes(s.key) ? 'active' : ''}`}
                    style={activeKeys.includes(s.key) ? { borderColor: s.color, color: s.color } : undefined}
                    onClick={() => toggleSeries(s.key)}
                    aria-pressed={activeKeys.includes(s.key)}
                  >
                    <i style={{ background: s.color }} />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="trends-control-group">
              <span className="trends-control-label">אירועים:</span>
              <div className="trends-chip-row">
                {ALL_EVENT_KINDS.map((kind) => (
                  <button
                    key={kind}
                    type="button"
                    className={`trends-chip ${activeKinds.includes(kind) ? 'active' : ''}`}
                    style={
                      activeKinds.includes(kind)
                        ? { borderColor: EVENT_KIND_COLORS[kind], color: EVENT_KIND_COLORS[kind] }
                        : undefined
                    }
                    onClick={() => toggleKind(kind)}
                    aria-pressed={activeKinds.includes(kind)}
                  >
                    <i style={{ background: EVENT_KIND_COLORS[kind] }} />
                    {EVENT_KIND_LABELS[kind]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="dash-card">
            <TimelineChart
              series={TIMELINE_SERIES}
              events={visibleEvents}
              activeKeys={activeKeys}
              minYear={minYear}
              maxYear={maxYear}
            />
          </div>

          <p className="dash-section-note" style={{ marginTop: 12 }}>
            העברת עכבר מעל נקודת אירוע מציגה פרטים. הקורלציות המוצגות כאן הן חזותיות בלבד ואינן מהוות הוכחת
            סיבתיות — ראו את עמוד <a href="/causes">גורמים לירידה</a> לניתוח מבוסס מקורות.
          </p>
        </section>
      </div>
    </div>
  )
}
