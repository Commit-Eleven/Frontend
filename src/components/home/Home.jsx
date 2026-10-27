import { useEffect, useRef, useState } from 'react';
import { Stats } from '../common/Stats.jsx';
import { Sidebar } from './Sidebar.jsx';
import { MobileNav } from './MobileNav.jsx';
import { RightRail } from './RightRail.jsx';
import { MapChapter } from './JourneyMap.jsx';
import { WrongNotes } from './WrongNotes.jsx';
import './Home.css';

export function Home({
  language,
  activeItem,
  onActiveItemChange,
  journey,
  completed,
  active,
  selectedId,
  onSelect,
  onOpen,
  onLogout,
  onSearch,
  onSyllabus,
  jumpTo,
}) {
  const { chapterData } = journey;
  const centerRef = useRef(null);
  const activeRef = useRef(null);
  const [visibleChapter, setVisibleChapter] = useState(language.code === 'html' ? 1 : 0);
  const navigate = (label) => {
    onActiveItemChange(label);
    onSelect(null);
  };
  useEffect(() => {
    if (!selectedId) return;

    const dismissPopover = (event) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest('.node-popover, .hex-node')) return;
      onSelect(null);
    };
    const dismissOnEscape = (event) => {
      if (event.key === 'Escape') onSelect(null);
    };

    document.addEventListener('pointerdown', dismissPopover);
    document.addEventListener('keydown', dismissOnEscape);
    return () => {
      document.removeEventListener('pointerdown', dismissPopover);
      document.removeEventListener('keydown', dismissOnEscape);
    };
  }, [selectedId, onSelect]);

  useEffect(() => {
    if (jumpTo) return;
    const timer = requestAnimationFrame(() => {
      if (!centerRef.current || !activeRef.current) return;
      const scroller = centerRef.current;
      const top =
        activeRef.current.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
      scroller.scrollTop += top - 315;
    });
    return () => cancelAnimationFrame(timer);
  }, [jumpTo, language.code]);
  useEffect(() => {
    if (!jumpTo) return;
    const target = document.getElementById('chapter-' + jumpTo.chapter);
    if (!target || !centerRef.current) return;
    centerRef.current.scrollTo({ top: target.offsetTop - 150, behavior: 'smooth' });
    setVisibleChapter(jumpTo.chapter);
  }, [jumpTo]);
  const handleScroll = () => {
    if (!centerRef.current) return;
    const rect = centerRef.current.getBoundingClientRect();
    let found = 0;
    chapterData.forEach((_, index) => {
      const target = document.getElementById('chapter-' + index);
      if (target && target.getBoundingClientRect().top - rect.top < 230) found = index;
    });
    setVisibleChapter(found);
  };
  return (
    <div className="home-layout">
      <Sidebar activeItem={activeItem} onNavigate={navigate} onLogout={onLogout} />
      <main className="center-pane" ref={centerRef} onScroll={handleScroll}>
        <div className="center-content">
          {activeItem === '오답 노트' ? (
            <WrongNotes language={language} onOpen={onOpen} />
          ) : (
            <>
              <div className="floating-course-card">
                <div>
                  <button className="course-link" onClick={onSyllabus}>
                    강의 계획
                  </button>
                  <span className="course-breadcrumb">
                    › 섹션 1 · 챕터 {visibleChapter + 1}
                  </span>
                  <h1>{chapterData[visibleChapter].title}</h1>
                </div>
                <button className="course-search" onClick={onSearch}>
                  ⌕ <kbd>⌘K</kbd>
                </button>
              </div>
              {chapterData.map((chapter, index) => (
                <MapChapter
                  key={chapter.title}
                  chapter={chapter}
                  chapterIndex={index}
                  completed={completed}
                  active={active}
                  selectedId={selectedId}
                  onSelect={onSelect}
                  onOpen={onOpen}
                  activeRef={activeRef}
                />
              ))}
              <div className="next-section">
                <small>다음 섹션 2</small>
                <h2>{journey.nextSectionTitle}</h2>
                <p>{language.description}</p>
                <span>다음 과정</span>
              </div>
            </>
          )}
        </div>
      </main>
      <RightRail
        completedCount={completed.length}
        initialCompletedCount={journey.initialCompleted.length}
      />
      <div className="mobile-stats">
        <Stats compact />
      </div>
      <MobileNav activeItem={activeItem} onNavigate={navigate} onLogout={onLogout} />
    </div>
  );
}
