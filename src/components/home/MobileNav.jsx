import { useEffect, useRef, useState } from 'react'
import { sidebarItems } from '../../constants/dummy/navigation.js'

/** 모바일 화면용 하단 내비게이션을 표시합니다. */
export function MobileNav({ onLogin }) {
  const [moreOpen, setMoreOpen] = useState(false)
  const [activeItem, setActiveItem] = useState('학습')
  const moreRef = useRef(null)

  useEffect(() => {
    if (!moreOpen) return undefined

    /** 하단 메뉴 바깥을 누르면 더보기 메뉴를 닫습니다. */
    const handlePointerDown = (event) => {
      if (!moreRef.current?.contains(event.target)) setMoreOpen(false)
    }
    /** Escape 키를 눌렀을 때 더보기 메뉴를 닫습니다. */
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMoreOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [moreOpen])

  return (
    <nav className="mobile-nav" aria-label="하단 메뉴">
      {sidebarItems.map((item) => {
        const isActive = activeItem === item.label
        return (
          <button
            key={item.label}
            type="button"
            className={'mobile-nav-item' + (isActive ? ' selected' : '')}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            title={item.label}
            onClick={() => setActiveItem(item.label)}
          >
            <img src={'/coddy/sidebar/' + item.asset} alt="" />
          </button>
        )
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
          <span className="sidebar-more-icon" aria-hidden="true">•••</span>
        </button>
        {moreOpen && (
          <div className="mobile-more-menu" role="menu" aria-label="더보기 메뉴">
            <button type="button" role="menuitem" onClick={() => setMoreOpen(false)}>설정</button>
            <button type="button" role="menuitem" onClick={() => setMoreOpen(false)}>도움말</button>
            <button type="button" role="menuitem" onClick={onLogin}>로그인</button>
          </div>
        )}
      </div>
    </nav>
  )
}
