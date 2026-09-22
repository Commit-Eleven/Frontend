import { useEffect, useId, useRef, useState } from 'react';
import symbolLogo from '../../../assets/images/SimbolLogo.svg';
import textLogo from '../../../assets/images/textLogo.svg';
import homeIcon from '../../../assets/images/homeIcon.svg';
import studyIcon from '../../../assets/images/studyIcon.svg';
import groupIcon from '../../../assets/images/groupIcon.svg';
import profileIcon from '../../../assets/images/profileIcon.svg';
import incorrectIcon from '../../../assets/images/incorrectIcon.svg';
import friendIcon from '../../../assets/images/friendIcon.svg';
import moreIcon from '../../../assets/images/moreIcon.svg';
import './Sidebar.css';

const icons = { home: homeIcon, learn: studyIcon, friends: friendIcon, groups: groupIcon, profile: profileIcon, notes: incorrectIcon, more: moreIcon };

const navigation = [
  { id: 'home', label: '홈', href: '#/' },
  { id: 'learn', label: '학습하기', href: '#/learn' },
  { id: 'notes', label: '오답 노트', href: '#/notes' },
  { id: 'profile', label: '프로필', href: '#/profile' },
  { id: 'friends', label: '친구', href: '#/friends' },
  { id: 'groups', label: '그룹', href: '#/groups' },
];

const extraNavigation = [
  { id: 'settings', label: '설정', href: '#/settings' },
  { id: 'help', label: '도움말', href: '#/help' },
  { id: 'submit', label: '문제 공모', href: '#/submit' },
  { id: 'login', label: '로그인', href: '#/login', tone: 'mint' },
  { id: 'logout', label: '로그아웃', href: '#/logout', tone: 'danger' },
];

function Icon({ name }) {
  return <span className="sidebar__icon" style={{ '--icon-url': `url("${icons[name]}")` }} aria-hidden="true" />;
}

function Sidebar({ activeItem = 'home', onNavigate, onLogout }) {
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const expanded = hovered || keyboardFocus;
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);
  const triggerRef = useRef(null);
  const popupId = useId();

  useEffect(() => {
    if (!moreOpen) return;
    function handlePointer(event) {
      if (!moreRef.current?.contains(event.target)) setMoreOpen(false);
    }
    function handleKey(event) {
      if (event.key === 'Escape') {
        setMoreOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener('pointerdown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [moreOpen]);

  function navigate(event, item) {
    setMoreOpen(false);
    if (onNavigate) {
      event.preventDefault();
      onNavigate(item.id);
    }
  }

  return (
    <aside
      className={`sidebar${expanded ? ' sidebar--expanded' : ''}`}
      aria-label="사이드바"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setMoreOpen(false);
      }}
      onFocus={(event) => {
        if (event.target.matches(':focus-visible')) setKeyboardFocus(true);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setKeyboardFocus(false);
      }}
    >
      <a className="sidebar__brand" href="#/" aria-label="codegram 홈" onClick={(event) => navigate(event, navigation[0])}>
        <img className="sidebar__logo" src={symbolLogo} alt="" />
        <img className="sidebar__wordmark" src={textLogo} alt="" />
      </a>

      <nav className="sidebar__nav" aria-label="주 메뉴">
        {navigation.map((item) => (
          <a key={item.id} href={item.href} className={`sidebar__item${activeItem === item.id ? ' is-active' : ''}`} aria-current={activeItem === item.id ? 'page' : undefined} aria-label={item.label} title={item.label} onClick={(event) => navigate(event, item)}>
            <Icon name={item.id} />
            <span className="sidebar__label">{item.label}</span>
          </a>
        ))}
        <div
          className="sidebar__more"
          ref={moreRef}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setMoreOpen(false);
          }}
        >
          <button ref={triggerRef} className={`sidebar__item${moreOpen || extraNavigation.some((item) => item.id === activeItem) ? ' is-active' : ''}`} type="button" aria-label="더보기" title="더보기" aria-expanded={moreOpen} aria-controls={popupId} onClick={() => setMoreOpen((open) => !open)}>
            <Icon name="more" />
            <span className="sidebar__label">더보기</span>
          </button>
          {moreOpen && (
            <div className="sidebar__popup" id={popupId} aria-label="더보기 메뉴">
              {extraNavigation.map((item) => {
                const className = `sidebar__popup-item${item.tone ? ` sidebar__popup-item--${item.tone}` : ''}${activeItem === item.id ? ' is-current' : ''}`;
                return item.id === 'logout' && onLogout ? (
                  <button
                    key={item.id}
                    className={className}
                    type="button"
                    onClick={() => {
                      setMoreOpen(false);
                      onLogout();
                    }}
                  >
                    로그아웃
                  </button>
                ) : (
                  <a key={item.id} className={className} href={item.href} aria-current={activeItem === item.id ? 'page' : undefined} onClick={(event) => navigate(event, item)}>
                    {item.label}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
