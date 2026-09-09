export default function GapCard({ title, rows }) {
  return (
    <div className="gap-card">
      <div className="title">{title}</div>
      {rows.map((row) => (
        <div className="gap-row" key={row.tag}>
          <span className="tag">{row.tag}</span>
          <div className="gap-track">
            <div className={`gap-fill ${row.color}`} style={{ width: `${row.pct}%` }} />
          </div>
          <span className="val">{row.value}</span>
        </div>
      ))}
    </div>
  )
}
