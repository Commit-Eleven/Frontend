import { useEffect, useState } from 'react'
import { fetchUnit } from '../../api/learning.js'
import { ModalBackdrop } from '../common/ModalBackdrop.jsx'
import './UnitDetailModal.css'

const statusNames = { correct: '정답', wrong: '오답', todo: '도전 전' }

/** GET /units/{unitId} — 단원 안 문제별 상태와 다음 단원 잠금 여부 */
export function UnitDetailModal({ unitId, onClose }) {
  const [state, setState] = useState({ loading: true, unit: null, error: '' })

  useEffect(() => {
    const controller = new AbortController()
    fetchUnit(unitId, { signal: controller.signal })
      .then((unit) => setState({ loading: false, unit, error: '' }))
      .catch((error) => {
        if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
          setState({ loading: false, unit: null, error: error.status === 404 ? '단원을 찾을 수 없어요.' : error.message || '단원 정보를 불러오지 못했어요.' })
        }
      })
    return () => controller.abort()
  }, [unitId])

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const { loading, unit, error } = state

  return (
    <ModalBackdrop onClose={onClose}>
      <section className="unit-modal" role="dialog" aria-modal="true" aria-labelledby="unit-modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="unit-modal-heading">
          <div>
            <small>{unit?.courseTitle || '단원'}</small>
            <h2 id="unit-modal-title">{unit?.title || '단원 상세'}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="닫기">×</button>
        </header>
        {loading ? <p className="unit-modal-muted">단원 정보를 불러오는 중…</p>
          : error ? <p className="unit-modal-muted" role="alert">{error}</p>
          : <>
            <div className="unit-modal-progress">
              <div className="unit-modal-track" aria-label={`진행률 ${unit.completePercent}%`}><span style={{ width: unit.completePercent + '%' }} /></div>
              <dl>
                <div><dt>진행률</dt><dd>{unit.completePercent}%</dd></div>
                <div><dt>정답</dt><dd>{unit.solved}</dd></div>
                <div><dt>오답</dt><dd>{unit.wrong}</dd></div>
                <div><dt>남은 문제</dt><dd>{unit.remaining}</dd></div>
              </dl>
            </div>
            {unit.problems.length ? (
              <ol className="unit-modal-problems">
                {unit.problems.map((problem) => (
                  <li key={problem.id}>
                    <span className="unit-modal-index">{problem.index}</span>
                    <span className="unit-modal-title">{problem.title}<small>{problem.typeLabel}</small></span>
                    <span className={'unit-modal-status is-' + problem.status}>{statusNames[problem.status]}</span>
                  </li>
                ))}
              </ol>
            ) : <p className="unit-modal-muted">이 단원에는 아직 문제가 없어요.</p>}
            {unit.nextUnit && (
              <div className={'unit-modal-next' + (unit.nextUnit.unlocked ? ' is-open' : '')}>
                <span aria-hidden="true">{unit.nextUnit.unlocked ? '→' : '🔒'}</span>
                <div>
                  <strong>다음 단원 · {unit.nextUnit.title}</strong>
                  <small>{unit.nextUnit.unlocked ? '열렸어요! 이어서 학습해 보세요.' : `이 단원 문제를 모두 맞히면 열려요. (${unit.remaining}문제 남음)`}</small>
                </div>
              </div>
            )}
          </>}
      </section>
    </ModalBackdrop>
  )
}
