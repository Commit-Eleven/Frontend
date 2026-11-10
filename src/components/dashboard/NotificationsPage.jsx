import { useEffect, useState } from 'react'
import { beginGoogleLogin } from '../../api/auth.js'
import {
  NOTIFICATION_TYPES,
  fetchNotificationSettings,
  fetchNotifications,
  markNotificationRead,
  relativeTime,
  updateNotificationSettings,
} from '../../api/notifications.js'
import { DashboardPageHeader } from './DashboardPageHeader.jsx'
import './NotificationsPage.css'

const PAGE_SIZE = 20
const isAbort = (error) => error?.name === 'CanceledError' || error?.name === 'AbortError'

function NotificationSettings() {
  const [settings, setSettings] = useState(null)
  const [error, setError] = useState('')
  const [savingType, setSavingType] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetchNotificationSettings({ signal: controller.signal })
      .then(setSettings)
      .catch((err) => { if (!isAbort(err)) setError(err.message) })
    return () => controller.abort()
  }, [])

  async function toggle(type) {
    if (!settings || savingType) return
    const enabled = !settings[type]
    setSavingType(type); setError('')
    setSettings((current) => ({ ...current, [type]: enabled }))
    try {
      await updateNotificationSettings([{ type, enabled }])
    } catch (err) {
      setSettings((current) => ({ ...current, [type]: !enabled }))
      setError(err.message || '알림 설정을 저장하지 못했어요.')
    } finally {
      setSavingType('')
    }
  }

  return (
    <article className="notice-card">
      <h2>알림 설정</h2>
      <p className="notice-muted">받고 싶은 알림만 켜 두세요.</p>
      {error && <p className="notice-error" role="alert">{error}</p>}
      {!settings && !error ? <p className="notice-muted">설정을 불러오는 중…</p> : settings && (
        <ul className="notice-settings">
          {NOTIFICATION_TYPES.map(({ type, label, description }) => (
            <li key={type}>
              <span><b>{label}</b><small>{description}</small></span>
              <button
                type="button"
                role="switch"
                aria-checked={settings[type]}
                aria-label={label + ' 알림'}
                className={'notice-switch' + (settings[type] ? ' is-on' : '')}
                disabled={savingType === type}
                onClick={() => toggle(type)}
              />
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

/** GET /notifications — 알림 목록과 알림 설정 */
export function NotificationsPage() {
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [state, setState] = useState({ loading: true, items: [], total: 0, error: null })

  useEffect(() => {
    const controller = new AbortController()
    fetchNotifications({ page, limit: PAGE_SIZE, unreadOnly }, { signal: controller.signal })
      .then((data) => setState((current) => ({
        loading: false,
        items: page === 1 ? data.items : [...current.items, ...data.items.filter((item) => !current.items.some((old) => old.id === item.id))],
        total: data.total,
        error: null,
      })))
      .catch((error) => { if (!isAbort(error)) setState({ loading: false, items: [], total: 0, error }) })
    return () => controller.abort()
  }, [page, unreadOnly])

  function changeFilter(next) {
    if (next === unreadOnly) return
    setState({ loading: true, items: [], total: 0, error: null })
    setPage(1)
    setUnreadOnly(next)
  }

  function loadMore() {
    setState((current) => ({ ...current, loading: true }))
    setPage((current) => current + 1)
  }

  async function open(item) {
    if (item.isRead) return
    setState((current) => ({ ...current, items: current.items.map((row) => (row.id === item.id ? { ...row, isRead: true } : row)) }))
    try {
      await markNotificationRead(item.id)
    } catch {
      // 읽음 처리 API가 아직 서버에 없어도 화면에서는 읽은 것으로 보여줍니다.
    }
  }

  const header = <DashboardPageHeader eyebrow="소식" title="알림" description="친구, 팀, 서비스 소식을 한곳에서 확인해요." />
  const { loading, items, total, error } = state

  if (error?.status === 401) {
    return (
      <section className="notice-page">
        {header}
        <div className="notice-card notice-login">
          <h2>로그인하면 알림이 보여요</h2>
          <p className="notice-muted">친구 요청과 팀 초대를 놓치지 마세요.</p>
          <button type="button" className="notice-primary" onClick={() => beginGoogleLogin()}>Google로 로그인</button>
        </div>
      </section>
    )
  }

  return (
    <section className="notice-page">
      {header}
      <div className="notice-tabs" role="tablist" aria-label="알림 보기">
        <button type="button" role="tab" aria-selected={!unreadOnly} className={!unreadOnly ? 'is-active' : ''} onClick={() => changeFilter(false)}>전체</button>
        <button type="button" role="tab" aria-selected={unreadOnly} className={unreadOnly ? 'is-active' : ''} onClick={() => changeFilter(true)}>안 읽은 알림</button>
      </div>

      <article className="notice-card">
        {loading && !items.length ? <p className="notice-muted">알림을 불러오는 중…</p>
          : error ? (
            <p className="notice-error" role="alert">
              알림을 불러오지 못했어요. {error.message}
              <button type="button" className="notice-text-button" onClick={() => changeFilter(unreadOnly)}>다시 시도</button>
            </p>
          ) : items.length ? (
            <ul className="notice-list">
              {items.map((item) => (
                <li key={item.id}>
                  <button type="button" className={'notice-item' + (item.isRead ? '' : ' is-unread')} onClick={() => open(item)}>
                    <span className="notice-dot" aria-hidden="true" />
                    <span className="notice-body">
                      <b>{item.title}</b>
                      {item.message && <span>{item.message}</span>}
                    </span>
                    <time dateTime={item.createdAt ?? undefined}>{relativeTime(item.createdAt)}</time>
                  </button>
                </li>
              ))}
            </ul>
          ) : <p className="notice-muted">{unreadOnly ? '안 읽은 알림이 없어요.' : '아직 받은 알림이 없어요.'}</p>}
        {!error && items.length < total && (
          <button type="button" className="notice-more" disabled={loading} onClick={loadMore}>{loading ? '불러오는 중…' : '더 보기'}</button>
        )}
      </article>

      <NotificationSettings />
    </section>
  )
}
