import { useEffect, useRef, useState } from 'react'
import { chapterData } from '../constants/dummy/journey.js'
import { Stats } from '../components/common/Stats.jsx'
import { Sidebar } from '../components/home/Sidebar.jsx'
import { MobileNav } from '../components/home/MobileNav.jsx'
import { RightRail } from '../components/home/RightRail.jsx'
import { MapChapter } from '../components/home/JourneyMap.jsx'

/** 여정 지도와 홈 화면의 공통 UI를 조합합니다. */
export function HomePage({ completed, active, selectedId, onSelect, onOpen, onSearch, onSyllabus, jumpTo, onLogin }) {
  const centerRef = useRef(null)
  const activeRef = useRef(null)
  const [visibleChapter, setVisibleChapter] = useState(1)
  useEffect(() => {
    if (!selectedId) return

    /** 지도의 바깥을 선택하면 열린 레슨 안내를 닫습니다. */
    const handleDismissPopover = (event) => {
      if (!(event.target instanceof Element)) return
      if (event.target.closest('.node-popover, .hex-node')) return
      onSelect(null)
    }
    /** Escape 키로 열린 레슨 안내를 닫습니다. */
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') onSelect(null)
    }

    document.addEventListener('pointerdown', handleDismissPopover)
    document.addEventListener('keydown', handleEscapeKey)
    return () => {
      document.removeEventListener('pointerdown', handleDismissPopover)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [selectedId, onSelect])

  useEffect(() => {
    if (jumpTo) return
    const timer = requestAnimationFrame(() => {
      if (!centerRef.current || !activeRef.current) return
      const scroller = centerRef.current
      const top = activeRef.current.getBoundingClientRect().top - scroller.getBoundingClientRect().top
      scroller.scrollTop += top - 315
    })
    return () => cancelAnimationFrame(timer)
  }, [jumpTo])
  useEffect(() => {
    if (!jumpTo) return
    const target = document.getElementById('chapter-' + jumpTo.chapter)
    if (!target || !centerRef.current) return
    centerRef.current.scrollTo({ top: target.offsetTop - 150, behavior: 'smooth' })
    setVisibleChapter(jumpTo.chapter)
  }, [jumpTo])
  /** 스크롤 위치에 맞춰 현재 챕터 표시를 갱신합니다. */
  const handleScroll = () => {
    if (!centerRef.current) return
    const rect = centerRef.current.getBoundingClientRect()
    let found = 0
    chapterData.forEach((_, index) => {
      const target = document.getElementById('chapter-' + index)
      if (target && target.getBoundingClientRect().top - rect.top < 230) found = index
    })
    setVisibleChapter(found)
  }
  return (
    <div className="home-layout">
      <Sidebar onLogin={onLogin} />
      <main className="center-pane" ref={centerRef} onScroll={handleScroll}>
        <div className="center-content">
          <div className="floating-course-card"><div><button className="course-link" onClick={onSyllabus}>강의 계획</button><span className="course-breadcrumb">› 섹션 1 · 챕터 {visibleChapter + 1}</span><h1>{chapterData[visibleChapter].title}</h1></div><button className="course-search" onClick={onSearch}>⌕ <kbd>⌘K</kbd></button></div>
          {chapterData.map((chapter, index) => <MapChapter key={chapter.title} chapter={chapter} chapterIndex={index} completed={completed} active={active} selectedId={selectedId} onSelect={onSelect} onOpen={onOpen} activeRef={activeRef} />)}
          <div className="certificate-block"><div className="certificate-preview">♜<span>수료증</span><strong>HTML 기초</strong></div><h2>인증서 획득</h2><p>이 섹션을 끝내면 무료로 검증 가능한 인증서를 발급해 드려요. 이력서에 추가하거나 LinkedIn에 공유해 보세요.</p><small>{completed.length}/60개 레슨 완료. {Math.max(0, 60 - completed.length)}개를 더 완료하면 수료증을 받을 수 있습니다.</small><button disabled>인증서 보기</button></div>
          <div className="next-section"><small>다음  섹션 2</small><h2>CSS로 스타일링하기</h2><p>색상, 레이아웃, 스타일로 웹 페이지를 생동감 있게 만드세요</p><span>76 레슨</span></div>
        </div>
      </main>
      <RightRail completedCount={completed.length} />
      <div className="mobile-stats"><Stats compact /></div>
      <MobileNav onLogin={onLogin} />
    </div>
  )
}
