import SourceList from './components/SourceList.jsx'
import { CAUSES } from './data/causesData.js'

function CauseCard({ cause }) {
  return (
    <div className="dash-card cause-card">
      <div className="cause-q">{cause.q}</div>

      <div className="cause-stats">
        <div className="cause-stat">
          <div className="cause-stat-num">{cause.stat}</div>
          <div className="cause-stat-lbl">{cause.statLabel}</div>
        </div>
        <div className="cause-stat cause-stat-compare">
          <div className="cause-stat-num compare">{cause.compare}</div>
          <div className="cause-stat-lbl">{cause.compareLabel}</div>
        </div>
      </div>

      <p className="cause-answer">{cause.answer}</p>

      <div className={`verdict-pill verdict-${cause.verdictColor}`}>{cause.verdict}</div>

      <SourceList sources={cause.sources} />
    </div>
  )
}

export default function CausesSection() {
  return (
    <section className="dash-section" id="causes">
      <div className="dash-section-head">
        <h2>מה גורם לירידה? 10 שאלות סיבתיות נפוצות</h2>
        <span className="dash-section-note">מבוסס מחקר נתונים, ספטמבר 2026</span>
      </div>

      <p className="dash-sub" style={{ marginBottom: 24 }}>
        לכל שאלה: הנתון המרכזי, השוואה בינלאומית, תשובה מבוססת-נתונים, ו"פסיקה" — עד כמה הנתונים תומכים
        בגורם כהסבר לירידה.
      </p>

      <div className="causes-grid">
        {CAUSES.map((cause) => (
          <CauseCard key={cause.id} cause={cause} />
        ))}
      </div>
    </section>
  )
}
