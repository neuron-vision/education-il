export default function SourceList({ sources }) {
  return (
    <div className="source-list">
      מקורות:{' '}
      {sources.map((s, i) => (
        <span key={s.url}>
          <a href={s.url} target="_blank" rel="noreferrer">
            {s.label}
          </a>
          {i < sources.length - 1 ? ' · ' : ''}
        </span>
      ))}
    </div>
  )
}
