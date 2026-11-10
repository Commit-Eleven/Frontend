import './LoadingSkeleton.css'

function Line({ width = '100%', height = 10 }) {
  return <span className="skeleton-block" style={{ width, height }} />
}

function SkeletonRows({ count = 3, avatar = false }) {
  return Array.from({ length: count }, (_, index) => (
    <div className="skeleton-row" key={index}>
      {avatar && <span className="skeleton-block skeleton-avatar" />}
      <div className="skeleton-row-copy"><Line width="42%" height={12} /><Line width="28%" /></div>
      <Line width="48px" height={22} />
    </div>
  ))
}

function ProfileSkeleton() {
  return <>
    <div className="skeleton-panel skeleton-profile-hero">
      <span className="skeleton-block skeleton-profile-avatar" />
      <div className="skeleton-row-copy"><Line width="45%" height={20} /><Line width="35%" /><Line width="20%" /></div>
      <Line width="82px" height={30} />
    </div>
    <div className="skeleton-stat-grid">{[0, 1, 2].map((item) => <div className="skeleton-panel skeleton-stat" key={item}><span className="skeleton-block skeleton-stat-icon" /><Line width="45px" height={18} /><Line width="38px" /></div>)}</div>
    <div className="skeleton-panel skeleton-section"><Line width="20%" height={15} /><Line width="32%" /><Line height={8} /><Line width="18%" /></div>
    <div className="skeleton-panel skeleton-section"><Line width="24%" height={15} /><Line width="33%" />{[0, 1, 2, 3].map((item) => <div className="skeleton-progress" key={item}><Line width="22%" /><Line height={7} /></div>)}</div>
    <div className="skeleton-panel skeleton-section"><Line width="25%" height={15} /><Line width="34%" /><SkeletonRows count={5} /></div>
    <div className="skeleton-panel skeleton-section"><Line width="20%" height={15} /><Line width="30%" /><SkeletonRows count={5} /></div>
  </>
}

export function LoadingSkeleton({ variant, label }) {
  return (
    <div className={`loading-skeleton loading-skeleton--${variant}`} role="status" aria-label={label}>
      <span className="skeleton-sr-only">{label}</span>
      <div aria-hidden="true" className="skeleton-layout">
        {variant === 'profile' ? <ProfileSkeleton /> : variant === 'groups' ? (
          Array.from({ length: 3 }, (_, index) => <div className="skeleton-panel skeleton-group" key={index}>
            <div className="skeleton-group-top"><span className="skeleton-block skeleton-avatar" /><Line width="45px" height={20} /></div>
            <Line width="35%" height={15} /><Line width="55%" />
            <div className="skeleton-group-footer"><Line width="100px" /><Line width="78px" height={30} /></div>
          </div>)
        ) : <SkeletonRows count={variant === 'history' ? 5 : 3} avatar={variant === 'friends'} />}
      </div>
    </div>
  )
}
