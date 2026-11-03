import { useRef, useState } from 'react'
import { Sidebar } from '../home/Sidebar.jsx'
import { MobileNav } from '../home/MobileNav.jsx'
import { categories, languages, readGroups, persistGroups, validateGroup } from '../../lib/groups.js'
import './Groups.css'

const emptyGroup = () => ({ name: '', description: '', image: '', members: [], category: '스터디', languages: [] })

function GroupImage({ group, large = false }) {
  return <div className={'group-avatar' + (large ? ' large' : '')}>{group.image ? <img src={group.image} alt="팀 이미지" /> : <span aria-hidden="true">{group.name.trim().slice(0, 1) || '〈/〉'}</span>}</div>
}

export function Groups({ onNavigate, onLogout }) {
  const [groups, setGroups] = useState(() => readGroups(window.localStorage))
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState(emptyGroup)
  const [member, setMember] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const imageRequest = useRef(0)
  const titleRef = useRef(null)

  function openForm(group) {
    imageRequest.current += 1
    setImageLoading(false)
    setDraft(group ? { ...group, members: [...group.members], languages: [...group.languages] } : emptyGroup())
    setEditing(group?.id || 'new')
    setMember(''); setError(''); setNotice('')
    requestAnimationFrame(() => titleRef.current?.focus())
  }
  function closeForm() {
    imageRequest.current += 1
    setImageLoading(false); setEditing(null); setError('')
  }
  function addMember() {
    const value = member.trim()
    if (!value) return
    if (value.length > 40 || draft.members.length >= 30) { setError('팀원 이름은 40자 이내, 팀원은 최대 30명까지 추가할 수 있어요.'); return }
    if (draft.members.some(name => name.toLowerCase() === value.toLowerCase())) { setError('이미 추가된 팀원이에요.'); return }
    setDraft(previous => ({ ...previous, members: [...previous.members, value] }))
    setMember(''); setError('')
  }
  function uploadImage(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 1024 * 1024) { setError('1MB 이하의 PNG, JPG, WebP 이미지를 선택해 주세요.'); return }
    const request = ++imageRequest.current
    const reader = new FileReader()
    setImageLoading(true)
    reader.onload = () => {
      if (request !== imageRequest.current) return
      const image = new Image()
      image.onload = () => {
        if (request !== imageRequest.current) return
        setDraft(previous => ({ ...previous, image: reader.result }))
        setImageLoading(false); setError('')
      }
      image.onerror = () => { if (request === imageRequest.current) { setError('올바른 이미지 파일을 선택해 주세요.'); setImageLoading(false) } }
      image.src = reader.result
    }
    reader.onerror = () => { if (request === imageRequest.current) { setError('이미지를 읽을 수 없어요. 다시 선택해 주세요.'); setImageLoading(false) } }
    reader.readAsDataURL(file)
  }
  function save(event) {
    event.preventDefault()
    const nextDraft = { ...draft, name: draft.name.trim(), description: draft.description.trim(), members: [...draft.members] }
    if (member.trim()) nextDraft.members.push(member.trim())
    const validation = validateGroup(nextDraft)
    if (validation) { setError(validation); return }
    if (groups.some(group => group.id !== editing && group.name.toLowerCase() === nextDraft.name.toLowerCase())) { setError('이미 사용 중인 팀명이에요. 다른 이름을 입력해 주세요.'); return }
    const saved = { ...nextDraft, id: editing === 'new' ? crypto.randomUUID() : editing }
    const next = editing === 'new' ? [...groups, saved] : groups.map(group => group.id === editing ? saved : group)
    try { persistGroups(window.localStorage, next) } catch { setError('저장 공간이 부족하거나 브라우저 저장이 차단되어 있어요. 이미지 크기를 줄이거나 브라우저 설정을 확인해 주세요.'); return }
    setGroups(next); closeForm(); setNotice(editing === 'new' ? '새 팀을 만들었어요.' : '팀 설정을 저장했어요.')
  }

  return <div className="groups-layout">
    <Sidebar activeItem="그룹" onNavigate={onNavigate} onLogout={onLogout} />
    <main className="groups-main">
      <div className="groups-content">
        <header className="groups-header"><div><p className="groups-eyebrow">CODEGRAM · GROUPS</p><h1>{editing ? editing === 'new' ? '팀 생성하기' : '팀 설정' : '나의 팀'}</h1><p>{editing ? '함께 성장할 팀의 이야기를 알려 주세요.' : '함께 배우고, 만들고, 한 걸음 더 성장해요.'}</p></div>{!editing && <button className="group-primary" onClick={() => openForm(null)}>＋ 팀 생성하기</button>}</header>
        <p className="group-local-note">이 브라우저에 저장되는 나의 팀 공간이에요. 팀원 추가는 명단 관리용이며 초대 알림은 전송되지 않아요.</p>
        {notice && <p className="group-notice" role="status">✓ {notice}</p>}
        {editing ? <form className="group-form" onSubmit={save}>
          <section className="group-section"><div className="group-section-heading"><span>01</span><div><h2>팀 프로필</h2><p>팀을 표현하는 이미지와 이름을 정해 주세요.</p></div></div>
            <div className="group-profile-fields"><div className="group-image-field"><GroupImage group={draft} large /><label className="group-secondary group-upload">{imageLoading ? '이미지 확인 중…' : '이미지 바꾸기'}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadImage} /></label>{draft.image && <button type="button" className="group-text-button" onClick={() => setDraft({ ...draft, image: '' })}>이미지 삭제</button>}<small>PNG, JPG, WebP · 최대 1MB</small></div><label className="group-field">팀명 <span className="group-required">필수</span><input ref={titleRef} autoComplete="off" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} maxLength={30} placeholder="예: 매일 코딩하는 사람들" required /><small>{draft.name.length}/30</small></label></div>
          </section>
          <section className="group-section"><div className="group-section-heading"><span>02</span><div><h2>팀 소개 및 팀원 추가</h2><p>어떤 팀인지 소개하고 함께할 팀원을 추가해 주세요.</p></div></div><label className="group-field">팀 소개<textarea value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} maxLength={500} rows={4} placeholder="팀의 목표와 함께하고 싶은 활동을 소개해 주세요." /><small>{draft.description.length}/500</small></label><label className="group-field" htmlFor="group-member">팀원 이름</label><div className="group-member-input"><input id="group-member" value={member} onChange={e => setMember(e.target.value)} maxLength={40} placeholder="팀원 이름을 입력해 주세요" onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) { e.preventDefault(); addMember() } }} /><button className="group-secondary" type="button" onClick={addMember}>추가</button></div><ul className="group-member-list">{draft.members.map(name => <li key={name}>{name}<button type="button" aria-label={`${name} 팀원 삭제`} onClick={() => setDraft({ ...draft, members: draft.members.filter(value => value !== name) })}>×</button></li>)}</ul><small className="group-help">추가 팀원 {draft.members.length}/30명</small></section>
          <section className="group-section"><div className="group-section-heading"><span>03</span><div><h2>카테고리 및 사용 언어</h2><p>팀의 관심 분야를 선택해 주세요.</p></div></div><label className="group-field">카테고리<select value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })}>{categories.map(category => <option key={category}>{category}</option>)}</select></label><fieldset className="group-languages"><legend>사용 언어 <span className="group-required">필수 · 여러 개 선택 가능</span></legend>{languages.map(language => <label key={language}><input type="checkbox" checked={draft.languages.includes(language)} onChange={e => setDraft({ ...draft, languages: e.target.checked ? [...draft.languages, language] : draft.languages.filter(value => value !== language) })} /><span>{language}</span></label>)}</fieldset></section>
          {error && <p className="group-error" role="alert">{error}</p>}<div className="group-form-actions"><button type="button" className="group-secondary" onClick={closeForm}>취소</button><button className="group-primary" disabled={imageLoading} type="submit">{editing === 'new' ? '팀 생성하기' : '변경 사항 저장'}</button></div>
        </form> : <><div className="group-list-heading"><h2>참여 중인 팀 <span>{groups.length}</span></h2></div>{groups.length ? <div className="group-grid">{groups.map(group => <article className="group-card" key={group.id}><div className="group-card-top"><GroupImage group={group} /><span className="group-category">{group.category}</span></div><h2>{group.name}</h2><p className="group-description">{group.description || '아직 팀 소개가 없어요.'}</p><div className="group-tags">{group.languages.map(language => <span key={language}>{language}</span>)}</div><div className="group-card-footer"><span>추가 팀원 {group.members.length}명</span><button className="group-text-button" onClick={() => openForm(group)} aria-label={`${group.name} 팀 설정`}>팀 설정 <span aria-hidden="true">→</span></button></div></article>)}</div> : <div className="group-empty"><div aria-hidden="true">〈/〉</div><h2>함께할 첫 번째 팀을 만들어 보세요</h2><p>코딩 스터디부터 사이드 프로젝트까지,<br />혼자보다 함께할 때 더 멀리 갈 수 있어요.</p><button className="group-primary" onClick={() => openForm(null)}>첫 팀 만들기</button></div>}</>}
      </div>
    </main>
    <MobileNav activeItem="그룹" onNavigate={onNavigate} onLogout={onLogout} />
  </div>
}
