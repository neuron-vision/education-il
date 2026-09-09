export default function BarCompare({ rows, field, max, highlightLabel }) {
  return (
    <div className="dash-card">
      {rows.map((row) => {
        const value = row[field]
        const isHighlight = row.country === highlightLabel
        return (
          <div className="gap-row" key={row.country} style={{ marginBottom: 10 }}>
            <span className="tag" style={{ width: 90, color: isHighlight ? '#eceef2' : undefined, fontWeight: isHighlight ? 600 : 400 }}>
              {row.country}
            </span>
            <div className="gap-track">
              <div
                className="gap-fill"
                style={{
                  width: `${(value / max) * 100}%`,
                  background: isHighlight ? '#d64545' : '#3d7ea6',
                }}
              />
            </div>
            <span className="val">{value}</span>
          </div>
        )
      })}
    </div>
  )
}
