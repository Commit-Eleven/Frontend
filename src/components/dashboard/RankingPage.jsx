import { useEffect, useState } from 'react'
import { beginGoogleLogin } from '../../api/auth.js'
import { fetchRanking } from '../../api/learning.js'
import { DashboardPageHeader } from './DashboardPageHeader.jsx'
import './RankingPage.css'

const PAGE_SIZE = 20

/** GET /ranking — 전체 경험치 랭킹 */
export function RankingPage() {
  const [page, setPage] = useState(1)
  const [state, setState] = useState({ loading: true, data: null, error: null })

  useEffect(() => {
    const controller = new AbortController()
    fetchRanking({ page, size: PAGE_SIZE }, { signal: controller.signal })
      .then((data) => setState({ loading: false, data, error: null }))
      .catch((error) => {
        if (error.name !== 'CanceledError' && error.name !== 'AbortError') setState({ loading: false, data: null, error })
      })
    return () => controller.abort()
  }, [page])

  const goPage = (next) => {
    setState((current) => ({ ...current, loading: true }))
    setPage(next)
  }

  const header = <DashboardPageHeader eyebrow="이번 시즌" title="랭킹" description="XP를 모아 다른 학습자들과 순위를 겨뤄 보세요." />
  const { loading, data, error } = state

  if (error?.status === 401) {
    return (
      <section className="ranking-page">
        {header}
        <div className="ranking-state">
          <h2>로그인하면 랭킹이 보여요</h2>
          <p>문제를 풀어 XP를 모으고 순위를 올려 보세요.</p>
          <button type="button" className="ranking-primary" onClick={() => beginGoogleLogin()}>Google로 로그인</button>
        </div>
      </section>
    )
  }

  const lastPage = data ? Math.max(1, Math.ceil(data.total / data.size)) : 1

  return (
    <section className="ranking-page">
      {header}
      {data?.me && (
        <article className="ranking-me">
          <span>내 순위</span>
          <strong>{data.me.rank.toLocaleString()}<small>위</small></strong>
          <span className="ranking-me-exp">{data.me.totalExp.toLocaleString()} XP</span>
          <span className="ranking-me-total">전체 {data.total.toLocaleString()}명</span>
        </article>
      )}

      <article className="ranking-list-card">
        {loading && !data ? <p className="ranking-muted">랭킹을 불러오는 중…</p>
          : error ? (
            <div className="ranking-muted" role="alert">
              랭킹을 불러오지 못했어요. {error.message}
              <button type="button" className="ranking-text-button" onClick={() => goPage(page)}>다시 시도</button>
            </div>
          ) : data?.items.length ? (
            <ol className="ranking-list" aria-busy={loading}>
              {data.items.map((row) => (
                <li key={row.userId ?? row.rank} className={row.isMe ? 'is-me' : ''}>
                  <b className={row.rank <= 3 ? 'is-top' : ''}>{row.rank}</b>
                  <span className="ranking-name">{row.nickname || '학습자'}{row.tag ? <small> #{row.tag}</small> : null}{row.isMe ? <small> (나)</small> : null}</span>
                  <span className="ranking-exp">{row.totalExp.toLocaleString()} XP</span>
                </li>
              ))}
            </ol>
          ) : <p className="ranking-muted">아직 랭킹에 오른 학습자가 없어요.</p>}
      </article>

      {lastPage > 1 && (
        <div className="ranking-pagination">
          <button type="button" disabled={page <= 1 || loading} onClick={() => goPage(page - 1)}>이전</button>
          <span>{page} / {lastPage}</span>
          <button type="button" disabled={page >= lastPage || loading} onClick={() => goPage(page + 1)}>다음</button>
        </div>
      )}
    </section>
  )
}
