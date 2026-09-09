const LEVEL_CLASSES = ['high', 'midhigh', 'midlow', 'low']
const LEVEL_LABELS = ['גבוהה', 'בינונית-גבוהה', 'בינונית-נמוכה', 'נמוכה']

export function StackedLegend() {
  return (
    <div className="dash-legend">
      {LEVEL_CLASSES.map((cls, i) => (
        <span key={cls}>
          <i className={cls} />
          {LEVEL_LABELS[i]}
        </span>
      ))}
    </div>
  )
}

export default function StackedBar({ name, levels }) {
  return (
    <div className="metric">
      <div className="metric-top">
        <span className="name">{name}</span>
        <span className="figure">{levels.join(' / ')}</span>
      </div>
      <div className="bar">
        {levels.map((pct, i) => (
          <div key={i} className={LEVEL_CLASSES[i]} style={{ width: `${pct}%` }}>
            {pct >= 15 ? <span className="bar-label">{pct}%</span> : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export function SupervisionTable({ rows }) {
  return (
    <table className="sup-table">
      <thead>
        <tr>
          <th>פיקוח</th>
          <th>התפלגות</th>
          <th>גבוהה</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name}>
            <td className="name">{row.name}</td>
            <td className="bar-cell">
              <div className="bar">
                {row.levels.map((pct, i) => (
                  <div key={i} className={LEVEL_CLASSES[i]} style={{ width: `${pct}%` }} />
                ))}
              </div>
            </td>
            <td className="total">{row.levels[0]}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
