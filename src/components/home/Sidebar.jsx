import { useEffect, useRef, useState } from 'react';
import { sidebarItems } from '../../data/navigation.js';
import { MoreIcon } from '../common/MoreIcon.jsx';
import './Sidebar.css';

export function Sidebar({ activeItem = '학습', onNavigate = () => {}, onLogout = () => {} }) {
  const [moreOpen, setMoreOpen] = useState(false);
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
      <a className="sidebar-brand" href="/coddy/" aria-label="Codegram 홈">
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
            className={'sidebar-link sidebar-more-trigger' + (moreOpen ? ' is-open' : '')}
            aria-expanded={moreOpen}
            aria-haspopup="menu"
            onClick={() => setMoreOpen((open) => !open)}
          >
            <MoreIcon />
            <span>더보기</span>
          </button>
          {moreOpen && (
            <div className="sidebar-more-menu" role="menu" aria-label="더보기 메뉴">
              <button type="button" role="menuitem" onClick={() => setMoreOpen(false)}>
                설정
              </button>
              <button type="button" role="menuitem" onClick={() => setMoreOpen(false)}>
                도움말
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMoreOpen(false);
                  onLogout();
                }}
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
