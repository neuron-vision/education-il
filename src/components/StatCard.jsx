export default function StatCard({ value, direction, title, note }) {
  return (
    <div className="stat-card">
      <div className={`stat-num ${direction}`}>{value}</div>
      <div className="stat-lbl">
        <b>{title}</b>
        {note}
      </div>
    </div>
  )
}
