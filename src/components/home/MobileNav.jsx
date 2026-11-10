import { useEffect, useRef, useState } from 'react';
import { sidebarItems } from '../../data/navigation.js';
import { authorizationHeaders } from '../../api/auth.js';
import { MoreIcon } from '../common/MoreIcon.jsx';
import './MobileNav.css';

export function MobileNav({ activeItem = '학습', onNavigate = () => {}, onLogout = () => {} }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const loggedIn = Boolean(authorizationHeaders().Authorization);
  const moreRef = useRef(null);

  useEffect(() => {
    if (!moreOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!moreRef.current?.contains(event.target)) setMoreOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMoreOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [moreOpen]);

  return (
    <nav className="mobile-nav" aria-label="하단 메뉴">
      {sidebarItems.map((item) => {
        const isActive = activeItem === item.label;
        return (
          <button
            key={item.label}
            type="button"
            className={'mobile-nav-item' + (isActive ? ' selected' : '')}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            title={item.label}
            onClick={() => onNavigate(item.label)}
          >
            <img src={'/coddy/sidebar/' + item.asset} alt="" />
          </button>
        );
      })}
      <div className="mobile-more-wrap" ref={moreRef}>
        <button
          type="button"
          className={'mobile-nav-item mobile-more-trigger' + (moreOpen || activeItem === '설정' || activeItem === '도움말' || activeItem === '랭킹' || activeItem === '알림' ? ' selected' : '')}
          aria-label="더보기"
          aria-expanded={moreOpen}
          aria-haspopup="menu"
          title="더보기"
          onClick={() => setMoreOpen((open) => !open)}
        >
          <MoreIcon />
        </button>
        {moreOpen && (
          <div className="mobile-more-menu" role="menu" aria-label="더보기 메뉴">
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
  );
}
