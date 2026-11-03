import { useEffect, useRef, useState } from 'react'
import { Sidebar } from '../home/Sidebar.jsx'
import { MobileNav } from '../home/MobileNav.jsx'
import { beginGoogleLogin } from '../../api/auth.js'
import { searchPeople, tokenUserId } from '../../api/community.js'
import {
  GROUP_CAPACITY_DEFAULT,
  GROUP_CAPACITY_MAX,
  GROUP_CAPACITY_MIN,
  GROUP_DESCRIPTION_MAX,
  GROUP_NAME_MAX,
  acceptGroupInvite,
  canUseGroupApi,
  createGroup,
  deleteGroup,
  fetchGroup,
  fetchGroupRanking,
  fetchMyGroupInvites,
  fetchMyGroups,
  inviteToGroup,
  joinGroup,
  rejectGroupInvite,
  searchGroups,
  transferGroupOwner,
} from '../../api/groups.js'
import { groupErrorMessage, validateGroup } from '../../lib/groups.js'
import './Groups.css'

const emptyGroup = () => ({ name: '', description: '', capacity: '' })
// 예전 버전이 브라우저에 저장하던 팀 데이터 키. 서버 저장으로 바뀌어 지웁니다.
const legacyGroupsKey = 'codegram.groups.v1'
const isAbort = (error) => error?.name === 'CanceledError' || error?.name === 'AbortError'
const displayName = (person) => `${person.nickname || '학습자'}${person.tag ? ' #' + person.tag : ''}`

function GroupImage({ group }) {
  return <div className="group-avatar"><span aria-hidden="true">{group.name.trim().slice(0, 1) || '〈/〉'}</span></div>
}

function GroupCard({ group, children }) {
  return (
    <article className="group-card">
      <div className="group-card-top">
        <GroupImage group={group} />
        {group.role ? <span className="group-category">{group.role === 'owner' ? '방장' : '팀원'}</span>
          : group.isFull ? <span className="group-category">정원 마감</span> : null}
      </div>
      <h2>{group.name}</h2>
      <p className="group-description">{group.description || '아직 팀 소개가 없어요.'}</p>
      <div className="group-card-footer">
        <span>팀원 {group.memberCount}명{group.capacity ? ` / ${group.capacity}명` : ''}</span>
        {children}
      </div>
    </article>
  )
}

function InviteMembers({ groupId, memberIds }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [message, setMessage] = useState('')
  const [invited, setInvited] = useState([])

  async function search(event) {
    event.preventDefault()
    const term = query.trim()
    if (!term) return
    setSearching(true); setMessage('')
    try {
      const people = await searchPeople(term)
      setResults(people)
      if (!people.length) setMessage('검색 결과가 없어요.')
    } catch (error) {
      setMessage(groupErrorMessage(error, '사용자를 찾지 못했어요.'))
    } finally {
      setSearching(false)
    }
  }

  async function invite(person) {
    setMessage('')
    try {
      await inviteToGroup(groupId, person.id)
      setInvited((list) => [...list, person.id])
      setMessage(`${displayName(person)}님에게 초대를 보냈어요.`)
    } catch (error) {
      setMessage(groupErrorMessage(error, '초대를 보내지 못했어요.'))
    }
  }

  return (
    <section className="group-detail-section">
      <h3>팀원 초대</h3>
      <form className="group-search" onSubmit={search}>
        <input value={query} onChange={(event) => setQuery(event.target.value)} maxLength={35} placeholder="닉네임 또는 닉네임#1234" aria-label="초대할 사용자 검색" />
        <button type="submit" className="group-secondary" disabled={searching}>{searching ? '찾는 중…' : '검색'}</button>
      </form>
      {results.length > 0 && (
        <ul className="group-detail-members">
          {results.map((person) => {
            const member = memberIds.includes(person.id)
            const sent = invited.includes(person.id)
            return (
              <li key={person.id}>
                <span>{person.nickname}{person.tag ? <small> #{person.tag}</small> : null}</span>
                <span />
                <button type="button" className="group-text-button" disabled={member || sent} onClick={() => invite(person)}>
                  {member ? '팀원' : sent ? '초대함' : '초대'}
                </button>
              </li>
            )
          })}
        </ul>
      )}
      {message && <p className="group-detail-state" role="status">{message}</p>}
    </section>
  )
}

function GroupDetail({ groupId, onClose, onChanged }) {
  const [state, setState] = useState({ loading: true, data: null, ranking: null, rankingError: '', error: '' })
  const [reloadKey, setReloadKey] = useState(0)
  const [confirm, setConfirm] = useState(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const myId = tokenUserId()

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    Promise.all([
      fetchGroup(groupId, { signal }),
      fetchGroupRanking(groupId, { signal }).then((ranking) => ({ ranking }), (error) => ({ error })),
    ])
      .then(([data, rankingResult]) => {
        if (isAbort(rankingResult.error)) return
        setState({
          loading: false,
          data,
          ranking: rankingResult.ranking ?? null,
          rankingError: rankingResult.error
            ? rankingResult.error.status === 404 ? '그룹 랭킹은 서버 업데이트 후 볼 수 있어요.' : groupErrorMessage(rankingResult.error, '랭킹을 불러오지 못했어요.')
            : '',
          error: '',
        })
      })
      .catch((error) => {
        if (!isAbort(error)) setState({ loading: false, data: null, ranking: null, rankingError: '', error: groupErrorMessage(error, '그룹 정보를 불러오지 못했어요.') })
      })
    return () => controller.abort()
  }, [groupId, reloadKey])

  async function runConfirmed() {
    if (!confirm || busy) return
    setBusy(true); setMessage('')
    try {
      if (confirm.type === 'delete') {
        await deleteGroup(groupId)
        onChanged('그룹을 삭제했어요.')
        onClose()
        return
      }
      await transferGroupOwner(groupId, confirm.member.id)
      setMessage(`${displayName(confirm.member)}님에게 방장을 넘겼어요.`)
      setConfirm(null)
      setReloadKey((key) => key + 1)
      onChanged()
    } catch (error) {
      setMessage(confirm.type === 'delete' && error.status === 404
        ? '그룹 삭제는 서버 업데이트 후 사용할 수 있어요.'
        : groupErrorMessage(error, '요청을 처리하지 못했어요.'))
      setConfirm(null)
    } finally {
      setBusy(false)
    }
  }

  const { loading, data, ranking, rankingError, error } = state
  const group = data?.group
  const members = data?.members ?? []
  const isOwner = data?.myRole === 'owner'

  return (
    <section className="group-detail-page" aria-label="그룹 상세">
      <div className="group-detail-heading">
        <h1>{group?.name || '그룹 상세'}</h1>
      </div>
      {loading ? <p className="group-detail-state">그룹 정보를 불러오는 중…</p>
        : error ? <p className="group-error" role="alert">{error}</p>
        : <>
          <p className="group-description">{group.description || '아직 팀 소개가 없어요.'}</p>
          <dl className="group-detail-meta">
            <div><dt>인원</dt><dd>{members.length}{group.capacity ? ' / ' + group.capacity : ''}명</dd></div>
            <div><dt>내 역할</dt><dd>{isOwner ? '방장' : '팀원'}</dd></div>
            {ranking?.myRank ? <div><dt>내 순위</dt><dd>{ranking.myRank}위</dd></div> : null}
          </dl>

          <section className="group-detail-section">
            <h3>팀 랭킹</h3>
            {rankingError ? <p className="group-detail-state">{rankingError}</p>
              : ranking?.items.length ? (
                <ol className="group-ranking">
                  {ranking.items.map((row) => (
                    <li key={row.id ?? row.rank} className={row.rank === ranking.myRank ? 'is-me' : ''}>
                      <b>{row.rank}</b>
                      <span>{row.nickname}{row.tag ? <small> #{row.tag}</small> : null}</span>
                      <span>{row.totalExp.toLocaleString()} XP</span>
                    </li>
                  ))}
                </ol>
              ) : <p className="group-detail-state">아직 랭킹 정보가 없어요.</p>}
          </section>

          <section className="group-detail-section">
            <h3>팀원 {members.length}</h3>
            <ul className="group-detail-members">
              {members.map((member) => (
                <li key={member.id}>
                  <span>{member.nickname}{member.tag ? <small> #{member.tag}</small> : null}{member.id === myId ? <small> (나)</small> : null}</span>
                  <span className="group-detail-role">{member.role === 'owner' ? '방장' : '팀원'}</span>
                  {isOwner && member.role !== 'owner'
                    ? <button type="button" className="group-text-button" onClick={() => setConfirm({ type: 'owner', member })}>방장 위임</button>
                    : <span>{member.totalExp.toLocaleString()} XP</span>}
                </li>
              ))}
            </ul>
          </section>

          <InviteMembers groupId={groupId} memberIds={members.map((member) => member.id)} />

          {isOwner && (
            <section className="group-detail-section">
              <h3>그룹 관리</h3>
              <button type="button" className="group-danger" onClick={() => setConfirm({ type: 'delete' })}>그룹 삭제</button>
            </section>
          )}

          {confirm && (
            <div className="group-confirm" role="alertdialog" aria-label="작업 확인">
              <p>{confirm.type === 'delete'
                ? '그룹을 삭제할까요? 팀원 기록도 함께 사라지고 되돌릴 수 없어요.'
                : `${displayName(confirm.member)}님에게 방장을 넘길까요? 나는 팀원이 돼요.`}</p>
              <div>
                <button type="button" className="group-secondary" onClick={() => setConfirm(null)} disabled={busy}>취소</button>
                <button type="button" className={confirm.type === 'delete' ? 'group-danger' : 'group-primary'} onClick={runConfirmed} disabled={busy}>
                  {busy ? '처리 중…' : confirm.type === 'delete' ? '삭제하기' : '넘기기'}
                </button>
              </div>
            </div>
          )}
          {message && <p className="group-detail-state" role="status">{message}</p>}
        </>}
    </section>
  )
}

/** GET /users/me/group-invites — 받은 초대를 수락하거나 거절합니다. */
function ReceivedInvites({ reloadKey, onAccepted }) {
  const [invites, setInvites] = useState([])
  const [busyId, setBusyId] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetchMyGroupInvites({ signal: controller.signal }).then(setInvites).catch(() => {})
    return () => controller.abort()
  }, [reloadKey])

  async function respond(invite, accept) {
    setBusyId(invite.id); setMessage('')
    try {
      if (accept) await acceptGroupInvite(invite.id)
      else await rejectGroupInvite(invite.id)
      setInvites((list) => list.filter((item) => item.id !== invite.id))
      if (accept) onAccepted(`'${invite.groupName}' 팀에 참여했어요.`)
    } catch (error) {
      setMessage(groupErrorMessage(error, '초대를 처리하지 못했어요.'))
    } finally {
      setBusyId('')
    }
  }

  if (!invites.length) return null
  return (
    <section className="group-invites" aria-label="받은 초대">
      <h2>받은 초대 <span>{invites.length}</span></h2>
      <ul>
        {invites.map((invite) => (
          <li key={invite.id}>
            <div>
              <strong>{invite.groupName}</strong>
              <small>{invite.inviter ? `${displayName(invite.inviter)}님이 초대했어요` : '팀 초대가 왔어요'}</small>
            </div>
            <div className="group-invite-actions">
              <button type="button" className="group-secondary" disabled={busyId === invite.id} onClick={() => respond(invite, false)}>거절</button>
              <button type="button" className="group-primary" disabled={busyId === invite.id} onClick={() => respond(invite, true)}>수락</button>
            </div>
          </li>
        ))}
      </ul>
      {message && <p className="group-error" role="alert">{message}</p>}
    </section>
  )
}

function FindGroups({ myGroupIds, onJoined }) {
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState({ query: '', page: 1 })
  const [result, setResult] = useState({ loading: true, items: [], total: 0, error: '' })
  const [joining, setJoining] = useState('')
  const [message, setMessage] = useState('')
  const limit = 12

  useEffect(() => {
    const controller = new AbortController()
    searchGroups({ ...search, limit }, { signal: controller.signal })
      .then((data) => setResult({ loading: false, items: data.items, total: data.total, error: '' }))
      .catch((error) => {
        if (!isAbort(error)) setResult({ loading: false, items: [], total: 0, error: groupErrorMessage(error, '그룹을 불러오지 못했어요.') })
      })
    return () => controller.abort()
  }, [search])

  function submit(event) {
    event.preventDefault()
    setResult((current) => ({ ...current, loading: true }))
    setSearch({ query, page: 1 })
  }

  function goPage(page) {
    setResult((current) => ({ ...current, loading: true }))
    setSearch((current) => ({ ...current, page }))
  }

  async function join(group) {
    setJoining(group.id); setMessage('')
    try {
      await joinGroup(group.id)
      onJoined(`'${group.name}' 팀에 참여했어요.`)
    } catch (error) {
      setMessage(groupErrorMessage(error, '팀에 참여하지 못했어요.'))
    } finally {
      setJoining('')
    }
  }

  const lastPage = Math.max(1, Math.ceil(result.total / limit))

  return (
    <>
      <form className="group-search" onSubmit={submit}>
        <input value={query} onChange={(event) => setQuery(event.target.value)} maxLength={50} placeholder="팀 이름으로 찾기" aria-label="팀 이름 검색" />
        <button type="submit" className="group-secondary">검색</button>
      </form>
      {message && <p className="group-error" role="alert">{message}</p>}
      {result.loading ? <p className="group-detail-state">팀을 찾는 중…</p>
        : result.error ? <p className="group-error" role="alert">{result.error}</p>
        : result.items.length ? <>
          <div className="group-grid">
            {result.items.map((group) => {
              const member = myGroupIds.includes(group.id)
              return (
                <GroupCard group={group} key={group.id}>
                  <button type="button" className="group-text-button" disabled={member || group.isFull || joining === group.id} onClick={() => join(group)}>
                    {member ? '참여 중' : group.isFull ? '정원 마감' : joining === group.id ? '참여 중…' : '참여하기'}
                  </button>
                </GroupCard>
              )
            })}
          </div>
          {lastPage > 1 && (
            <div className="group-pagination">
              <button type="button" className="group-secondary" disabled={search.page <= 1} onClick={() => goPage(search.page - 1)}>이전</button>
              <span>{search.page} / {lastPage}</span>
              <button type="button" className="group-secondary" disabled={search.page >= lastPage} onClick={() => goPage(search.page + 1)}>다음</button>
            </div>
          )}
        </>
        : <div className="group-empty"><div aria-hidden="true">〈/〉</div><h2>찾는 팀이 없어요</h2><p>다른 이름으로 찾아보거나<br />직접 팀을 만들어 보세요.</p></div>}
    </>
  )
}

export function Groups({ onNavigate, onLogout }) {
  const loggedIn = canUseGroupApi()
  const [tab, setTab] = useState('mine')
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(loggedIn)
  const [loadError, setLoadError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [creating, setCreating] = useState(false)
  const [draft, setDraft] = useState(emptyGroup)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)
  const [detailId, setDetailId] = useState(null)
  const titleRef = useRef(null)
  const mainRef = useRef(null)

  useEffect(() => {
    try { window.localStorage.removeItem(legacyGroupsKey) } catch { /* 저장소를 쓸 수 없으면 무시합니다. */ }
  }, [])

  useEffect(() => {
    if (!loggedIn) return undefined
    const controller = new AbortController()
    fetchMyGroups({ signal: controller.signal })
      .then((items) => { setGroups(items); setLoadError('') })
      .catch((requestError) => {
        if (!isAbort(requestError)) setLoadError(groupErrorMessage(requestError, '팀 목록을 불러오지 못했어요.'))
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [loggedIn, reloadKey])

  function reload() { setLoading(true); setLoadError(''); setReloadKey((key) => key + 1) }
  function changed(text) { if (text) setNotice(text); reload() }
  function openForm() {
    setDraft(emptyGroup()); setCreating(true); setError(''); setNotice(''); setDetailId(null)
    requestAnimationFrame(() => titleRef.current?.focus())
  }
  function closeForm() { setCreating(false); setError('') }
  function openDetail(groupId) { setDetailId(groupId); setNotice(''); mainRef.current?.scrollTo(0, 0) }
  function closeDetail() { setDetailId(null); mainRef.current?.scrollTo(0, 0) }

  async function save(event) {
    event.preventDefault()
    if (saving) return
    const validation = validateGroup(draft)
    if (validation) { setError(validation); return }
    setSaving(true); setError('')
    try {
      const created = await createGroup(draft)
      closeForm()
      setTab('mine')
      changed(`'${created.group.name || draft.name.trim()}' 팀을 만들었어요.`)
      if (created.group.id) openDetail(created.group.id)
    } catch (requestError) {
      setError(groupErrorMessage(requestError, '팀을 만들지 못했어요.'))
    } finally {
      setSaving(false)
    }
  }

  return <div className="groups-layout">
    <Sidebar activeItem="그룹" onNavigate={onNavigate} onLogout={onLogout} />
    <main className="groups-main" ref={mainRef}>
      <div className="groups-content">
        {detailId && !creating ? (
          <>
            <button type="button" className="group-back" onClick={closeDetail}><span aria-hidden="true">←</span> 팀 목록</button>
            {notice && <p className="group-notice" role="status">✓ {notice}</p>}
            <GroupDetail key={detailId} groupId={detailId} onClose={closeDetail} onChanged={changed} />
          </>
        ) : <>
        <header className="groups-header">
          <div>
            <p className="groups-eyebrow">CODEGRAM · GROUPS</p>
            <h1>{creating ? '팀 생성하기' : '팀'}</h1>
            <p>{creating ? '함께 성장할 팀의 이야기를 알려 주세요.' : '함께 배우고, 만들고, 한 걸음 더 성장해요.'}</p>
          </div>
          {!creating && loggedIn && <button className="group-primary" onClick={openForm}>＋ 팀 생성하기</button>}
        </header>
        {notice && <p className="group-notice" role="status">✓ {notice}</p>}

        {!loggedIn ? (
          <div className="group-empty">
            <div aria-hidden="true">〈/〉</div>
            <h2>로그인하고 팀을 만들어 보세요</h2>
            <p>Google 계정으로 로그인하면<br />팀을 만들고 함께 학습할 수 있어요.</p>
            <button className="group-primary" onClick={() => beginGoogleLogin()}>Google로 로그인</button>
          </div>
        ) : creating ? (
          <form className="group-form" onSubmit={save}>
            <section className="group-section">
              <div className="group-section-heading"><span>01</span><div><h2>팀 프로필</h2><p>팀 이름은 꼭 필요하고, 소개와 정원은 비워 둬도 돼요.</p></div></div>
              <label className="group-field">팀명 <span className="group-required">필수</span>
                <input ref={titleRef} autoComplete="off" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} maxLength={GROUP_NAME_MAX} placeholder="예: 알고리즘 스터디" required />
                <small>{draft.name.length}/{GROUP_NAME_MAX}</small>
              </label>
              <label className="group-field">팀 소개 <span className="group-required">선택</span>
                <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} maxLength={GROUP_DESCRIPTION_MAX} rows={4} placeholder="예: 매주 3문제씩 함께 풀어요." />
                <small>{draft.description.length}/{GROUP_DESCRIPTION_MAX}</small>
              </label>
              <label className="group-field">정원 <span className="group-required">선택</span>
                <input type="number" min={GROUP_CAPACITY_MIN} max={GROUP_CAPACITY_MAX} inputMode="numeric" value={draft.capacity} onChange={(e) => setDraft({ ...draft, capacity: e.target.value })} placeholder={`비워 두면 ${GROUP_CAPACITY_DEFAULT}명`} />
                <small>{GROUP_CAPACITY_MIN}~{GROUP_CAPACITY_MAX}명</small>
              </label>
            </section>
            {error && <p className="group-error" role="alert">{error}</p>}
            <div className="group-form-actions">
              <button type="button" className="group-secondary" onClick={closeForm}>취소</button>
              <button className="group-primary" disabled={saving} type="submit">{saving ? '만드는 중…' : '팀 생성하기'}</button>
            </div>
          </form>
        ) : <>
          <div className="group-tabs" role="tablist" aria-label="팀 보기">
            <button type="button" role="tab" aria-selected={tab === 'mine'} className={tab === 'mine' ? 'is-active' : ''} onClick={() => setTab('mine')}>나의 팀 <span>{groups.length}</span></button>
            <button type="button" role="tab" aria-selected={tab === 'find'} className={tab === 'find' ? 'is-active' : ''} onClick={() => { setTab('find'); setDetailId(null) }}>팀 찾기</button>
          </div>

          {tab === 'find' ? (
            <FindGroups myGroupIds={groups.map((group) => group.id)} onJoined={(text) => { changed(text); setTab('mine') }} />
          ) : <>
            <ReceivedInvites reloadKey={reloadKey} onAccepted={changed} />
            {loading ? <p className="group-detail-state">팀 목록을 불러오는 중…</p>
              : loadError ? <div className="group-error" role="alert">{loadError} <button type="button" className="group-text-button" onClick={reload}>다시 시도</button></div>
              : groups.length ? (
                <div className="group-grid">
                  {groups.map((group) => (
                    <GroupCard group={group} key={group.id}>
                      <button className="group-text-button" onClick={() => openDetail(group.id)} aria-label={`${group.name} 상세 보기`}>상세 보기 <span aria-hidden="true">→</span></button>
                    </GroupCard>
                  ))}
                </div>
              ) : (
                <div className="group-empty">
                  <div aria-hidden="true">〈/〉</div>
                  <h2>아직 참여한 팀이 없어요</h2>
                  <p>팀을 직접 만들거나<br />팀 찾기에서 마음에 드는 팀에 참여해 보세요.</p>
                  <div className="group-empty-actions">
                    <button className="group-secondary" onClick={() => setTab('find')}>팀 찾기</button>
                    <button className="group-primary" onClick={openForm}>첫 팀 만들기</button>
                  </div>
                </div>
              )}
          </>}
        </>}
        </>}
      </div>
    </main>
    <MobileNav activeItem="그룹" onNavigate={onNavigate} onLogout={onLogout} />
  </div>
}
