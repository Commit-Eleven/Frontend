import { useEffect, useMemo, useState } from 'react'
import { beginGoogleLogin } from '../../api/auth.js'
import {
  acceptFriendRequest,
  fetchFriends,
  removeFriend,
  searchPeople,
  sendFriendRequest,
} from '../../api/community.js'
import { DashboardPageHeader } from './DashboardPageHeader.jsx'
import './FriendsPage.css'

function initialFor(name = '') {
  return [...name.trim()][0] || '?'
}

function PersonAvatar({ name, size = 'normal' }) {
  return <span className={'community-avatar ' + size}>{initialFor(name)}</span>
}

function PersonIdentity({ user }) {
  return (
    <div className="community-person-identity">
      <PersonAvatar name={user.nickname} />
      <div className="community-person-copy">
        <strong>{user.nickname || '코드 학습자'}</strong>
        <span>#{user.tag || '----'} · {(user.totalExp ?? 0).toLocaleString()} XP</span>
      </div>
    </div>
  )
}

function EmptyFriends({ title, description }) {
  return (
    <div className="community-empty">
      <span className="community-empty-mark" aria-hidden="true">＋</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export function FriendsPage() {
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [activeTab, setActiveTab] = useState('friends')
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [requestedIds, setRequestedIds] = useState(() => new Set())
  const [actionId, setActionId] = useState(null)
  const [confirmRemove, setConfirmRemove] = useState(null)
  const [notice, setNotice] = useState('')
  const [removeError, setRemoveError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const reloadFriends = () => {
    setLoading(true)
    setLoadError(null)
    setReloadKey((key) => key + 1)
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchFriends({ signal: controller.signal })
      .then(setFriends)
      .catch((error) => {
        if (error.name === 'CanceledError' || error.name === 'AbortError') return
        setLoadError(error)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [reloadKey])

  useEffect(() => {
    const term = query.trim()
    if (term.length < 2) return undefined

    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      setSearching(true)
      setSearchError('')
      searchPeople(term, { signal: controller.signal })
        .then(setSearchResults)
        .catch((error) => {
          if (error.name === 'CanceledError' || error.name === 'AbortError') return
          setSearchError(error.status === 401 ? '로그인하면 친구를 찾을 수 있어요.' : error.message)
        })
        .finally(() => {
          if (!controller.signal.aborted) setSearching(false)
        })
    }, 250)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  const accepted = useMemo(() => friends.filter((item) => item.status === 'accepted'), [friends])
  const incoming = useMemo(
    () => friends.filter((item) => item.status === 'pending' && item.direction === 'incoming'),
    [friends],
  )
  const outgoing = useMemo(
    () => friends.filter((item) => item.status === 'pending' && item.direction === 'outgoing'),
    [friends],
  )
  const visible = activeTab === 'friends' ? accepted : activeTab === 'incoming' ? incoming : outgoing

  const handleSendRequest = async (user) => {
    setActionId(user.id)
    setNotice('')
    try {
      await sendFriendRequest(user.id)
      setRequestedIds((current) => new Set([...current, user.id]))
      setNotice(user.nickname + ' 님에게 친구 요청을 보냈어요.')
      reloadFriends()
    } catch (error) {
      setSearchError(error.status === 401 ? '로그인하면 친구 요청을 보낼 수 있어요.' : error.message)
    } finally {
      setActionId(null)
    }
  }

  const handleAccept = async (item) => {
    setActionId(item.friendshipId)
    setNotice('')
    try {
      await acceptFriendRequest(item.friendshipId)
      setNotice(item.user.nickname + ' 님과 친구가 되었어요.')
      reloadFriends()
    } catch (error) {
      setLoadError(error)
    } finally {
      setActionId(null)
    }
  }

  const handleRemove = async (item) => {
    if (confirmRemove !== item.friendshipId) {
      setConfirmRemove(item.friendshipId)
      setRemoveError('')
      setNotice('')
      return
    }
    setActionId(item.friendshipId)
    setRemoveError('')
    try {
      await removeFriend(item.friendshipId)
      setFriends((current) => current.filter((friend) => friend.friendshipId !== item.friendshipId))
      setRequestedIds((current) => {
        const next = new Set(current)
        next.delete(item.user.id)
        return next
      })
      setConfirmRemove(null)
      setNotice(item.status === 'accepted' ? item.user.nickname + ' 님을 친구 목록에서 삭제했습니다.' : '친구 요청을 정리했어요.')
    } catch (error) {
      setRemoveError(error.status === 401 ? '로그인이 만료되었습니다. 다시 로그인해 주세요.' : '삭제하지 못했습니다. 다시 시도해 주세요.')
    } finally {
      setActionId(null)
    }
  }

  return (
    <section className="friends-page">
      <DashboardPageHeader
        eyebrow="함께 배우기"
        title="친구"
        description="친구를 찾고, 서로의 학습 기록을 응원해 보세요."
      />

      <div className="friends-search-card">
        <div className="friends-section-title">
          <div>
            <h2>친구 찾기</h2>
            <p>닉네임을 두 글자 이상 입력해 검색하세요.</p>
          </div>
          <span className="friends-section-icon" aria-hidden="true">⌕</span>
        </div>
        <label className="friends-search-field">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setSearchResults([])
              setSearchError('')
              setSearching(event.target.value.trim().length >= 2)
            }}
            placeholder="닉네임 검색"
            aria-label="친구 닉네임 검색"
          />
          {query && <button type="button" onClick={() => {
            setQuery('')
            setSearchResults([])
            setSearchError('')
            setSearching(false)
          }} aria-label="검색어 지우기">×</button>}
        </label>
        {searchError && (
          <div className="friends-inline-error" role="status">
            <span>{searchError}</span>
            {searchError.includes('로그인') && <button type="button" onClick={() => beginGoogleLogin()}>Google로 로그인</button>}
          </div>
        )}
        {notice && <p className="friends-notice" role="status">{notice}</p>}
        {query.trim().length >= 2 && (
          <div className="friends-search-results" aria-live="polite">
            {searching ? <p className="friends-result-message">찾는 중…</p> : null}
            {!searching && searchResults.length === 0 && !searchError ? (
              <p className="friends-result-message">검색 결과가 없어요.</p>
            ) : null}
            {searchResults.map((user) => {
              const alreadyListed = friends.some((item) => item.user.id === user.id)
              const requested = requestedIds.has(user.id) || alreadyListed
              return (
                <div className="friends-search-result" key={user.id}>
                  <PersonIdentity user={user} />
                  <button
                    type="button"
                    className={requested ? 'friends-small-button is-sent' : 'friends-small-button'}
                    disabled={requested || actionId !== null}
                    onClick={() => handleSendRequest(user)}
                  >
                    {requested ? '요청됨' : actionId === user.id ? '전송 중' : '친구 추가'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="friends-list-section">
        <div className="friends-list-heading">
          <h2>내 네트워크</h2>
          <button type="button" className="friends-refresh" onClick={reloadFriends} disabled={loading || actionId !== null}>
            새로고침
          </button>
        </div>
        <div className="friends-tabs" role="tablist" aria-label="친구 목록">
          <button type="button" role="tab" aria-selected={activeTab === 'friends'} className={activeTab === 'friends' ? 'is-active' : ''} onClick={() => { setActiveTab('friends'); setConfirmRemove(null); setRemoveError('') }}>
            친구 <span>{accepted.length}</span>
          </button>
          <button type="button" role="tab" aria-selected={activeTab === 'incoming'} className={activeTab === 'incoming' ? 'is-active' : ''} onClick={() => { setActiveTab('incoming'); setConfirmRemove(null); setRemoveError('') }}>
            받은 요청 <span>{incoming.length}</span>
          </button>
          <button type="button" role="tab" aria-selected={activeTab === 'outgoing'} className={activeTab === 'outgoing' ? 'is-active' : ''} onClick={() => { setActiveTab('outgoing'); setConfirmRemove(null); setRemoveError('') }}>
            보낸 요청 <span>{outgoing.length}</span>
          </button>
        </div>

        {removeError && <p className="friends-remove-error" role="alert">{removeError}</p>}
        {loadError?.status === 401 ? (
          <div className="friends-auth-card">
            <h3>친구 기능을 사용하려면 로그인해 주세요</h3>
            <p>Google 계정으로 로그인하면 친구 요청과 학습 순위를 볼 수 있어요.</p>
            <button type="button" onClick={() => beginGoogleLogin()}>Google로 로그인</button>
          </div>
        ) : loadError ? (
          <div className="friends-error" role="alert">
            <p>친구 목록을 불러오지 못했어요.</p>
            <span>{loadError.message}</span>
            <button type="button" onClick={reloadFriends}>다시 시도</button>
          </div>
        ) : loading ? (
          <p className="friends-result-message">친구 목록을 불러오는 중…</p>
        ) : visible.length ? (
          <div className="friends-list">
            {visible.map((item) => (
              <article className="friend-row" key={item.friendshipId}>
                <PersonIdentity user={item.user} />
                <div className="friend-row-actions">
                  {activeTab === 'incoming' ? (
                    <>
                      <button type="button" className="friends-small-button" disabled={actionId !== null} onClick={() => handleAccept(item)}>
                        {actionId === item.friendshipId ? '처리 중' : '수락'}
                      </button>
                      <button type="button" className="friends-text-button" disabled={actionId !== null} onClick={() => handleRemove(item)}>
                        {confirmRemove === item.friendshipId ? '요청 거절' : '거절'}
                      </button>
                    </>
                  ) : activeTab === 'outgoing' ? (
                    <button type="button" className="friends-text-button" disabled={actionId !== null} onClick={() => handleRemove(item)}>
                      {confirmRemove === item.friendshipId ? '취소 확인' : '요청 대기'}
                    </button>
                  ) : (
                    <div className="friend-remove-actions">
                      {confirmRemove === item.friendshipId ? (
                        <>
                          <span className="friend-remove-prompt">친구를 삭제할까요?</span>
                          <button type="button" className="friends-text-button" disabled={actionId !== null} onClick={() => { setConfirmRemove(null); setRemoveError('') }}>취소</button>
                          <button type="button" className="friends-remove-button" aria-label={`${item.user.nickname} 친구 삭제 확인`} disabled={actionId !== null} onClick={() => handleRemove(item)}>
                            {actionId === item.friendshipId ? '삭제 중…' : '삭제 확인'}
                          </button>
                        </>
                      ) : (
                        <button type="button" className="friends-text-button" aria-label={`${item.user.nickname} 친구 삭제`} disabled={actionId !== null} onClick={() => handleRemove(item)}>친구 삭제</button>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyFriends
            title={activeTab === 'friends' ? '아직 친구가 없어요' : activeTab === 'incoming' ? '받은 요청이 없어요' : '보낸 요청이 없어요'}
            description={activeTab === 'friends' ? '위 검색창에서 친구를 찾아 함께 학습을 시작해 보세요.' : '새로운 친구 요청이 오면 여기에서 확인할 수 있어요.'}
          />
        )}
      </div>
    </section>
  )
}
