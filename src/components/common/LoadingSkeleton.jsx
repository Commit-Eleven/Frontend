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

function NoticeSkeleton({ count = 3 }) {
  return Array.from({ length: count }, (_, index) => (
    <div className="skeleton-panel skeleton-notice" key={index}>
      <span className="skeleton-block skeleton-dot" />
      <div className="skeleton-row-copy"><Line width="30%" height={13} /><Line width="72%" /></div>
      <Line width="42px" />
    </div>
  ))
}

function RankingSkeleton({ count = 7 }) {
  return Array.from({ length: count }, (_, index) => (
    <div className="skeleton-rank-row" key={index}>
      <Line width="16px" height={14} />
      <Line width="38%" height={12} />
      <Line width="64px" height={14} />
    </div>
  ))
}

function PracticeSkeleton() {
  return (
    <div className="skeleton-practice">
      <Line width="26%" height={12} />
      <Line width="70%" height={20} />
      <Line width="48%" height={14} />
      {[0, 1, 2].map((item) => <span className="skeleton-block skeleton-option" key={item} />)}
    </div>
  )
}

function LessonSkeleton() {
  return (
    <div className="skeleton-lesson">
      <div className="skeleton-lesson-topbar">
        <span className="skeleton-lesson-close"><span className="skeleton-block skeleton-lesson-x" /></span>
        <Line width="140px" height={20} />
      </div>
      <div className="skeleton-lesson-body">
        <div className="skeleton-lesson-side">
          <Line width="55%" height={20} /><Line /><Line width="88%" /><Line width="70%" />
          <span className="skeleton-block skeleton-lesson-example" />
        </div>
        <span className="skeleton-lesson-handle" />
        <div className="skeleton-lesson-main"><div className="skeleton-lesson-card"><PracticeSkeleton /></div></div>
      </div>
    </div>
  )
}

export function LoadingSkeleton({ variant, label }) {
  return (
    <div className={`loading-skeleton loading-skeleton--${variant}`} role="status" aria-label={label}>
      <span className="skeleton-sr-only">{label}</span>
      <div aria-hidden="true" className="skeleton-layout">
        {variant === 'profile' ? <ProfileSkeleton /> : variant === 'notifications' ? <NoticeSkeleton />
        : variant === 'ranking' ? <RankingSkeleton />
        : variant === 'practice' ? <PracticeSkeleton />
        : variant === 'lesson' ? <LessonSkeleton />
        : variant === 'settings' ? <SkeletonRows count={5} />
        : variant === 'xp' ? <div className="skeleton-row-copy"><Line width="46%" height={14} /><Line width="70%" /></div>
        : variant === 'group-detail' ? (
          <div className="skeleton-group-detail">
            <Line width="60%" /><div className="skeleton-detail-meta"><Line width="75px" height={30} /><Line width="75px" height={30} /></div>
            <Line width="90px" height={16} /><SkeletonRows count={3} avatar />
            <Line width="90px" height={16} /><SkeletonRows count={2} avatar />
          </div>
        ) : variant === 'groups' ? (
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
