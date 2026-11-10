import './LoadingSkeleton.css'

function Line({ width = '100%', height = 12 }) {
  return <span className="skeleton-block" style={{ width, height }} />
}

export function LoadingSkeleton({ variant, label }) {
  const rows = variant === 'groups' ? 3 : variant === 'profile' ? 2 : 4
  return (
    <div className={`loading-skeleton loading-skeleton--${variant}`} role="status" aria-label={label}>
      <span className="skeleton-sr-only">{label}</span>
      {Array.from({ length: rows }, (_, index) => (
        <div className="skeleton-card" key={index} aria-hidden="true">
          <span className="skeleton-block skeleton-avatar" />
          <div className="skeleton-content">
            <Line width="45%" height={16} />
            <Line width="75%" />
            {variant !== 'friends' && <Line width="60%" />}
          </div>
          {variant === 'friends' && <Line width="70px" height={32} />}
        </div>
      ))}
    </div>
  )
}
