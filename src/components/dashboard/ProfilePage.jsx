import { useEffect, useState } from 'react'
import { beginGoogleLogin } from '../../api/auth.js'
import { fetchMyProfile, fetchMyStats, updateMyNickname } from '../../api/community.js'
import { expSummary, fetchMyExp, fetchMySubmissions } from '../../api/learning.js'
import { DashboardPageHeader } from './DashboardPageHeader.jsx'
import './ProfilePage.css'

const languageNames = {
  html: 'HTML',
  html_css: 'HTML · CSS',
  js: 'JavaScript',
  javascript: 'JavaScript',
  python: 'Python',
  java: 'Java',
  css: 'CSS',
}

const levelNames = { beginner: '초급', intermediate: '중급', advanced: '고급' }
const typeNames = { mcq: '선택형', blank: '빈칸 채우기', parsons: '순서 맞추기', short: '단답형' }
const tierNames = { normal: '학습자', creator: '크리에이터', admin: '관리자' }

const formatDate = (value) => {
  const date = value ? new Date(value) : null
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : ''
}

/** GET /users/me/exp — 최근에 얻은 경험치 */
function ExpHistory() {
  const [exp, setExp] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetchMyExp({ signal: controller.signal })
      .then((data) => setExp(expSummary(data)))
      .catch((requestError) => {
        if (requestError.name !== 'CanceledError' && requestError.name !== 'AbortError') setFailed(true)
      })
    return () => controller.abort()
  }, [])

  const rows = exp?.recent.slice(0, 5) ?? []
  return (
    <article className="profile-type-card">
      <div className="profile-section-heading">
        <div><h3>최근 획득 XP</h3><p>문제를 맞혀 얻은 경험치예요.</p></div>
        {exp && <strong>{exp.totalExp.toLocaleString()} <span>XP</span></strong>}
      </div>
      {rows.length ? (
        <ul className="profile-history-list">
          {rows.map((row, index) => (
            <li key={(row.createdAt ?? '') + index}>
              <span>{row.problemTitle || row.reason || '학습 보상'}</span>
              <small>{formatDate(row.createdAt)}</small>
              <b className="is-plus">+{row.amount}</b>
            </li>
          ))}
        </ul>
      ) : (
        <p className="profile-no-history">{failed ? '경험치 기록을 불러오지 못했어요.' : exp ? '아직 얻은 경험치가 없어요.' : '불러오는 중…'}</p>
      )}
    </article>
  )
}

/** GET /users/me/submissions — 내 제출 이력(더 보기로 다음 페이지) */
function SubmissionHistory() {
  const [items, setItems] = useState([])
  const [nextCursor, setNextCursor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  const load = async (cursor, signal) => {
    try {
      const page = await fetchMySubmissions({ cursor, limit: 10 }, { signal })
      setItems((current) => (cursor ? [...current, ...page.items] : page.items))
      setNextCursor(page.nextCursor)
      setFailed(false)
    } catch (requestError) {
      if (requestError.name === 'CanceledError' || requestError.name === 'AbortError') return
      setFailed(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchMySubmissions({ limit: 10 }, { signal: controller.signal })
      .then((page) => { setItems(page.items); setNextCursor(page.nextCursor); setLoading(false) })
      .catch((requestError) => {
        if (requestError.name === 'CanceledError' || requestError.name === 'AbortError') return
        setFailed(true); setLoading(false)
      })
    return () => controller.abort()
  }, [])

  return (
    <article className="profile-type-card">
      <div className="profile-section-heading">
        <div><h3>제출 기록</h3><p>최근에 제출한 답안이에요.</p></div>
      </div>
      {items.length ? (
        <ul className="profile-history-list">
          {items.map((item) => (
            <li key={item.id}>
              <span>{item.title || item.problemId}<small> · {typeNames[item.type] || item.type || '문제'}{item.language ? ' · ' + (languageNames[item.language] || item.language) : ''}</small></span>
              <small>{formatDate(item.createdAt)}</small>
              <b className={item.isCorrect ? 'is-correct' : 'is-wrong'}>{item.isCorrect ? '정답' : '오답'}</b>
            </li>
          ))}
        </ul>
      ) : !loading ? (
        <p className="profile-no-history">{failed ? '제출 기록을 불러오지 못했어요.' : '아직 제출한 답안이 없어요.'}</p>
      ) : null}
      {loading && <p className="profile-no-history">불러오는 중…</p>}
      {!loading && nextCursor && (
        <button type="button" className="profile-more-button" onClick={() => { setLoading(true); load(nextCursor) }}>더 보기</button>
      )}
    </article>
  )
}

export function ProfilePage({ onNavigate }) {
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [nickname, setNickname] = useState('')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const reloadProfile = () => {
    setLoading(true)
    setError(null)
    setReloadKey((key) => key + 1)
  }

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      fetchMyProfile({ signal: controller.signal }),
      fetchMyStats({ signal: controller.signal }),
    ])
      .then(([user, summary]) => {
        setProfile(user)
        setStats(summary)
        setNickname(user.nickname || '')
      })
      .catch((requestError) => {
        if (requestError.name !== 'CanceledError' && requestError.name !== 'AbortError') {
          setError(requestError)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [reloadKey])

  const saveNickname = async (event) => {
    event.preventDefault()
    const value = nickname.trim().replace(/\s+/g, ' ')
    if (value.length < 2 || value.length > 20) {
      setNotice('닉네임은 2자 이상 20자 이하로 입력해 주세요.')
      return
    }
    setSaving(true)
    setNotice('')
    try {
      const updated = await updateMyNickname(value)
      setProfile((current) => ({ ...current, ...updated }))
      setNickname(updated.nickname || value)
      setEditing(false)
      setNotice('닉네임을 저장했어요.')
    } catch (requestError) {
      setNotice(requestError.message || '닉네임을 저장하지 못했어요.')
    } finally {
      setSaving(false)
    }
  }

  if (error?.status === 401) {
    return (
      <section className="profile-page">
        <DashboardPageHeader eyebrow="내 학습 기록" title="프로필" description="학습 진행 상황과 계정 정보를 확인해요." />
        <div className="profile-auth-state">
          <span aria-hidden="true">○</span>
          <h2>로그인하면 프로필이 보여요</h2>
          <p>학습 기록과 XP를 계정에 저장하고 여러 기기에서 이어서 학습하세요.</p>
          <button type="button" onClick={() => beginGoogleLogin()}>Google로 로그인</button>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="profile-page">
        <DashboardPageHeader eyebrow="내 학습 기록" title="프로필" description="학습 진행 상황과 계정 정보를 확인해요." />
        <div className="profile-loading">프로필을 불러오는 중…</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="profile-page">
        <DashboardPageHeader eyebrow="내 학습 기록" title="프로필" description="학습 진행 상황과 계정 정보를 확인해요." />
        <div className="profile-error" role="alert">
          <p>프로필을 불러오지 못했어요.</p>
          <span>{error.message}</span>
          <button type="button" onClick={reloadProfile}>다시 시도</button>
        </div>
      </section>
    )
  }

  const total = stats?.totalProblemCount ?? 0
  const solved = stats?.solvedProblemCount ?? 0
  const progress = total ? Math.min(100, Math.round((solved / total) * 100)) : 0
  const typeStats = Array.isArray(stats?.byType) ? stats.byType : []

  return (
    <section className="profile-page">
      <DashboardPageHeader
        eyebrow="내 학습 기록"
        title="프로필"
        description="배운 내용을 돌아보고 다음 목표를 정해 보세요."
        action={<button type="button" className="profile-settings-link" onClick={() => onNavigate('설정')}>설정</button>}
      />

      <article className="profile-hero">
        <div className="profile-identity">
          <span className="profile-avatar">{[...(profile?.nickname || '나')][0]}</span>
          <div className="profile-identity-copy">
            <div className="profile-name-row">
              <h2>{profile?.nickname || '코드 학습자'}</h2>
              <span className="profile-tier">{tierNames[profile?.tier] || '학습자'}</span>
            </div>
            <p>#{profile?.tag || '----'} · {languageNames[profile?.studyLanguage] || '학습 언어 미설정'}</p>
            <span className="profile-level">{levelNames[profile?.studyLevel] || '기초부터 차근차근'}</span>
          </div>
        </div>
        <button type="button" className="profile-edit-button" onClick={() => { setEditing((value) => !value); setNotice('') }}>
          {editing ? '닫기' : '닉네임 수정'}
        </button>
        {editing && (
          <form className="profile-edit-form" onSubmit={saveNickname}>
            <label htmlFor="profile-nickname">닉네임</label>
            <div>
              <input id="profile-nickname" value={nickname} maxLength={20} onChange={(event) => setNickname(event.target.value)} autoComplete="nickname" />
              <button type="submit" disabled={saving}>{saving ? '저장 중…' : '저장'}</button>
            </div>
            <small>친구에게 표시되는 이름이에요. 2~20자로 입력해 주세요.</small>
          </form>
        )}

        {notice && <p className="profile-notice" role="status">{notice}</p>}
      </article>

      <div className="profile-stat-grid" aria-label="학습 통계">
        <article className="profile-stat-card">
          <span className="profile-stat-icon xp" aria-hidden="true">✦</span>
          <strong>{(stats?.totalExp ?? profile?.totalExp ?? 0).toLocaleString()}</strong>
          <small>총 XP</small>
        </article>
        <article className="profile-stat-card">
          <span className="profile-stat-icon solved" aria-hidden="true">✓</span>
          <strong>{solved.toLocaleString()}</strong>
          <small>푼 문제</small>
        </article>
        <article className="profile-stat-card">
          <span className="profile-stat-icon accuracy" aria-hidden="true">◎</span>
          <strong>{stats?.accuracy ?? 0}%</strong>
          <small>정답률</small>
        </article>
      </div>

      <article className="profile-progress-card">
        <div className="profile-section-heading">
          <div><h3>학습 진행</h3><p>현재 언어의 전체 문제 기준</p></div>
          <strong>{solved} <span>/ {total}</span></strong>
        </div>
        <div className="profile-progress-track" aria-label={`학습 진행률 ${progress}%`}><span style={{ width: progress + '%' }} /></div>
        <div className="profile-progress-foot"><span>{progress}% 완료</span><button type="button" onClick={() => onNavigate('학습')}>학습 계속하기 <b aria-hidden="true">→</b></button></div>
      </article>

      <article className="profile-type-card">
        <div className="profile-section-heading">
          <div><h3>문제 유형별 기록</h3><p>유형별로 해결한 문제를 확인해요.</p></div>
          <button type="button" onClick={() => onNavigate('오답 노트')}>오답 노트</button>
        </div>
        {typeStats.length ? (
          <div className="profile-type-list">
            {typeStats.map((item) => {
              const percent = item.total ? Math.round((item.solved / item.total) * 100) : 0
              return (
                <div className="profile-type-row" key={item.type}>
                  <div><span>{typeNames[item.type] || item.type}</span><small>{item.solved} / {item.total}</small></div>
                  <div className="profile-type-track"><span style={{ width: percent + '%' }} /></div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="profile-no-history">문제를 풀면 유형별 기록이 여기에 쌓여요.</p>
        )}
      </article>

      <ExpHistory />
      <SubmissionHistory />
    </section>
  )
}
