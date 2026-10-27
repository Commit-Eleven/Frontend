import { useEffect, useRef, useState } from 'react';
import { sidebarItems } from '../../data/navigation.js';
import { MoreIcon } from '../common/MoreIcon.jsx';
import './MobileNav.css';

export function MobileNav({ activeItem = '학습', onNavigate = () => {} }) {
  const [moreOpen, setMoreOpen] = useState(false);
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
          className={'mobile-nav-item mobile-more-trigger' + (moreOpen ? ' selected' : '')}
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
            <button type="button" role="menuitem" onClick={() => setMoreOpen(false)}>
              설정
            </button>
            <button type="button" role="menuitem" onClick={() => setMoreOpen(false)}>
              도움말
            </button>
            <button type="button" role="menuitem" onClick={() => setMoreOpen(false)}>
              로그아웃
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
