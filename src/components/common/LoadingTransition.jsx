import { useEffect, useState } from 'react'
import './LoadingSkeleton.css'

const EXIT_DURATION = 280

/** Keeps the skeleton over the loaded view briefly so both can crossfade. */
export function LoadingTransition({ loading, skeleton, children, className = '' }) {
  const [previousLoading, setPreviousLoading] = useState(loading)
  const [phase, setPhase] = useState(loading ? 'loading' : 'ready')

  if (loading !== previousLoading) {
    setPreviousLoading(loading)
    setPhase(loading ? 'loading' : 'exiting')
  }

  useEffect(() => {
    if (phase === 'exiting') {
      const timeout = window.setTimeout(() => setPhase('ready'), EXIT_DURATION)
      return () => window.clearTimeout(timeout)
    }
    return undefined
  }, [phase])

  return (
    <div className={`loading-transition ${className}`.trim()} aria-busy={loading} data-phase={phase}>
      {phase !== 'loading' && <div className="loading-transition-content">{children}</div>}
      {phase !== 'ready' && (
        <div className={'loading-transition-skeleton' + (phase === 'exiting' ? ' is-exiting' : '')} aria-hidden={phase !== 'loading'}>
          {skeleton}
        </div>
      )}
    </div>
  )
}
