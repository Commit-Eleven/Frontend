import { useEffect, useRef, useState } from 'react';
import { sidebarItems } from '../../data/navigation.js';
import { authorizationHeaders } from '../../api/auth.js';
import { MoreIcon } from '../common/MoreIcon.jsx';
import './Sidebar.css';

export function Sidebar({ activeItem = '학습', onNavigate = () => {}, onLogout = () => {}, homePath = '/journeys/html/fundamentals' }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const loggedIn = Boolean(authorizationHeaders().Authorization);
  const moreRef = useRef(null);

  useEffect(() => {
    if (!moreOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!moreRef.current?.contains(event.target)) {
        setMoreOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMoreOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [moreOpen]);

  return (
    <aside className="sidebar">
      <a className="sidebar-brand" href={homePath} aria-label="Codegram 홈" onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        onNavigate('학습');
      }}>
        <img src="/coddy/sidebar/logo.svg" alt="Codegram" />
      </a>
      <nav className="sidebar-menu" aria-label="메인 메뉴">
        {sidebarItems.map((item, index) => {
          const isActive = activeItem === item.label;
          return (
            <button
              key={item.label}
              type="button"
              className={'sidebar-link' + (isActive ? ' is-active' : '')}
              aria-current={isActive || (!activeItem && index === 0) ? 'page' : undefined}
              disabled={item.disabled}
              onClick={() => onNavigate(item.label)}
            >
              <img src={'/coddy/sidebar/' + item.asset} alt="" />
              <span>{item.label}</span>
            </button>
          );
        })}
        <div className="sidebar-more-wrap" ref={moreRef}>
          <button
            type="button"
            className={'sidebar-link sidebar-more-trigger' + (moreOpen || activeItem === '설정' || activeItem === '도움말' || activeItem === '랭킹' || activeItem === '알림' ? ' is-open' : '')}
            aria-expanded={moreOpen}
            aria-haspopup="menu"
            onClick={() => setMoreOpen((open) => !open)}
          >
            <MoreIcon />
            <span>더보기</span>
          </button>
          {moreOpen && (
            <div className="sidebar-more-menu" role="menu" aria-label="더보기 메뉴">
              <button type="button" role="menuitem" onClick={() => { setMoreOpen(false); onNavigate('랭킹'); }}>
                랭킹
              </button>
              <button type="button" role="menuitem" onClick={() => { setMoreOpen(false); onNavigate('알림'); }}>
                알림
              </button>
              <button type="button" role="menuitem" onClick={() => { setMoreOpen(false); onNavigate('설정'); }}>
                설정
              </button>
              <button type="button" role="menuitem" onClick={() => { setMoreOpen(false); onNavigate('도움말'); }}>
                도움말
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMoreOpen(false);
                  if (loggedIn) onLogout();
                else window.location.assign('/auth');
                }}
              >
                {loggedIn ? '로그아웃' : '로그인'}
              </button>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
