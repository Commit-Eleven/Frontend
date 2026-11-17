import { useCallback, useEffect, useRef, useState } from 'react';
import { useDashboardSummary } from '../../hooks/useDashboardSummary.js';
import { Stats } from '../common/Stats.jsx';
import { Sidebar } from './Sidebar.jsx';
import { MobileNav } from './MobileNav.jsx';
import { RightRail } from './RightRail.jsx';
import { MapChapter } from './JourneyMap.jsx';
import { WrongNotes } from './WrongNotes.jsx';
import { FriendsPage } from '../dashboard/FriendsPage.jsx';
import { ProfilePage } from '../dashboard/ProfilePage.jsx';
import { SettingsPage } from '../dashboard/SettingsPage.jsx';
import { HelpPage } from '../dashboard/HelpPage.jsx';
import { NotificationsPage } from '../dashboard/NotificationsPage.jsx';
import { RankingPage } from '../dashboard/RankingPage.jsx';
import { Groups } from '../groups/Groups.jsx';
import './Home.css';

export function Home(props) {
  const { language, activeItem, onActiveItemChange, onSelect, onLogout } = props;
  const summary = useDashboardSummary();
  const navigate = useCallback((label) => {
    onActiveItemChange(label);
    onSelect(null);
  }, [onActiveItemChange, onSelect]);

  return (
    <div className={'home-layout' + (activeItem === '그룹' ? ' groups-page' : '')}>
      <Sidebar activeItem={activeItem} onNavigate={navigate} onLogout={onLogout} homePath={`/journeys/${language.code}/fundamentals`} />
      <HomeContent key={language.code} {...props} onNavigate={navigate} />
      <RightRail onNavigate={navigate} summary={summary} journey={props.journey} completed={props.completed} active={props.active} onSyllabus={props.onSyllabus} />
      <div className="mobile-stats">
        <Stats compact streakDays={summary.home?.stats.streakDays ?? 0} />
      </div>
      <MobileNav activeItem={activeItem} onNavigate={navigate} onLogout={onLogout} />
    </div>
  );
}

function HomeContent({
  language,
  activeItem,
  onNavigate,
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
  const [visibleChapter, setVisibleChapter] = useState(0);
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
    if (activeItem !== '학습') {
      centerRef.current?.scrollTo(0, 0);
      return;
    }
    if (jumpTo) return;
    const timer = requestAnimationFrame(() => {
      if (!centerRef.current || !activeRef.current) return;
      const scroller = centerRef.current;
      const top =
        activeRef.current.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
      scroller.scrollTop += top - 315;
    });
    return () => cancelAnimationFrame(timer);
  }, [activeItem, jumpTo, language.code]);
  useEffect(() => {
    if (!jumpTo || activeItem !== '학습') return;
    const target = document.getElementById('chapter-' + jumpTo.chapter);
    if (!target || !centerRef.current) return;
    centerRef.current.scrollTo({ top: target.offsetTop - 150, behavior: 'smooth' });
    setVisibleChapter(jumpTo.chapter);
  }, [activeItem, jumpTo]);
  const sectionTabs = chapterData
    .map((chapter, index) => ({ section: chapter.section ?? 1, title: chapter.sectionTitle, index, start: chapter.sectionStart }))
    .filter((tab) => tab.start || tab.index === 0);
  const goToChapter = (index) => {
    const target = document.getElementById('chapter-' + index);
    if (!target || !centerRef.current) return;
    centerRef.current.scrollTo({ top: target.offsetTop - 150, behavior: 'smooth' });
    setVisibleChapter(index);
  };
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
    <main className="center-pane" ref={centerRef} onScroll={activeItem === '학습' ? handleScroll : undefined}>
      <div className="center-content">
        {activeItem === '그룹' ? (
          <Groups scrollRef={centerRef} />
        ) : activeItem === '오답 노트' ? (
          <WrongNotes language={language} onOpen={onOpen} />
        ) : activeItem === '친구' ? (
          <FriendsPage />
        ) : activeItem === '프로필' ? (
          <ProfilePage onNavigate={onNavigate} />
        ) : activeItem === '설정' ? (
          <SettingsPage language={language} onNavigate={onNavigate} onLogout={onLogout} />
        ) : activeItem === '도움말' ? (
          <HelpPage onNavigate={onNavigate} />
        ) : activeItem === '랭킹' ? (
          <RankingPage />
        ) : activeItem === '알림' ? (
          <NotificationsPage />
        ) : (
          <>
            <div className="floating-course-card">
              <div>
                <button className="course-link" onClick={onSyllabus}>
                  강의 계획
                </button>
                <span className="course-breadcrumb">
                  › 섹션 {chapterData[visibleChapter].section ?? 1} · 챕터 {chapterData[visibleChapter].sectionChapter ?? visibleChapter + 1}
                </span>
                <h1>{chapterData[visibleChapter].title}</h1>
              </div>
              <button type="button" className="course-search" onClick={onSearch} aria-label="강의 검색">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" focusable="false">
                  <circle cx="10.5" cy="10.5" r="6.5" />
                  <path d="m15.5 15.5 5 5" />
                </svg>
                <kbd>⌘K</kbd>
              </button>
            </div>
            {sectionTabs.length > 1 && (
              <div className="section-tabs" role="tablist" aria-label="섹션 이동">
                {sectionTabs.map((tab) => (
                  <button
                    type="button"
                    role="tab"
                    key={tab.section}
                    aria-selected={tab.section === (chapterData[visibleChapter].section ?? 1)}
                    className={tab.section === (chapterData[visibleChapter].section ?? 1) ? 'is-active' : ''}
                    onClick={() => goToChapter(tab.index)}
                  >
                    섹션 {tab.section} · {tab.title}
                  </button>
                ))}
              </div>
            )}
            {chapterData.map((chapter, index) => (
              <MapChapter
                key={chapter.title + index}
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
            {journey.hiddenSections > 0 && (
              <div className="next-section">
                <small>잠긴 섹션 {journey.hiddenSections}개</small>
                <h2>이 섹션을 모두 풀면 열려요</h2>
                <p>위 레슨을 끝까지 풀면 다음 섹션으로 넘어가요.</p>
                <span>설정에서 등급을 올려도 열 수 있어요</span>
              </div>
            )}
            {journey.nextSectionTitle && (
              <div className="next-section">
                <small>다음 섹션 {(chapterData[chapterData.length - 1].section ?? 1) + 1}</small>
                <h2>{journey.nextSectionTitle}</h2>
                <p>{language.description}</p>
                <span>다음 과정</span>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
